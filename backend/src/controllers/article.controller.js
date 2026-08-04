"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var article_controller_exports = {};
__export(article_controller_exports, {
  getArticleBySlug: () => getArticleBySlug,
  getArticles: () => getArticles,
  likeArticle: () => likeArticle
});
module.exports = __toCommonJS(article_controller_exports);
var import_Article = require("../models/Article");
const getArticles = async (req, res) => {
  try {
    const { category, tag, search, sort = "-publishedAt", limit = "10", page = "1" } = req.query;
    const query = { status: import_Article.ArticleStatus.PUBLISHED };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const articles = await import_Article.Article.find(query).populate("category", "name slug").populate("author", "name").sort(sort).skip(skip).limit(parseInt(limit));
    const total = await import_Article.Article.countDocuments(query);
    
    const import_Comment = require("../models/Comment");
    const articlesWithCounts = await Promise.all(
      articles.map(async (art) => {
        const commentsCount = await import_Comment.Comment.countDocuments({ article: art._id });
        const artObj = art.toObject();
        artObj.commentsCount = commentsCount;
        return artObj;
      })
    );

    res.status(200).json({
      success: true,
      count: articlesWithCounts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: articlesWithCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getArticleBySlug = async (req, res) => {
  try {
    const article = await import_Article.Article.findOne({ slug: req.params.slug, status: import_Article.ArticleStatus.PUBLISHED }).populate("category", "name slug").populate("author", "name");
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    article.views += 1;
    await article.save();
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const likeArticle = async (req, res) => {
  try {
    const article = await import_Article.Article.findOne({ slug: req.params.slug, status: import_Article.ArticleStatus.PUBLISHED });
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    if (!article.allowLikes) {
      res.status(400).json({ success: false, message: "Likes are disabled for this article" });
      return;
    }
    article.likes += 1;
    await article.save();
    res.status(200).json({ success: true, likes: article.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
