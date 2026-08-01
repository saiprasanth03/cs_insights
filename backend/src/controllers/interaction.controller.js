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
var interaction_controller_exports = {};
__export(interaction_controller_exports, {
  toggleBookmark: () => toggleBookmark,
  toggleLike: () => toggleLike
});
module.exports = __toCommonJS(interaction_controller_exports);
var import_Like = require("../models/Like");
var import_Bookmark = require("../models/Bookmark");
var import_Article = require("../models/Article");
const toggleLike = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user?.userId;
    
    const article = await import_Article.Article.findById(articleId);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });
    if (article.allowLikes === false) return res.status(403).json({ success: false, message: "Likes are disabled for this article" });

    const existingLike = await import_Like.Like.findOne({ user: userId, article: articleId });
    if (existingLike) {
      await import_Like.Like.findByIdAndDelete(existingLike._id);
      const updatedArticle = await import_Article.Article.findByIdAndUpdate(articleId, { $inc: { likes: -1 } }, { new: true });
      res.status(200).json({ success: true, message: "Like removed", likes: updatedArticle.likes });
    } else {
      await import_Like.Like.create({ user: userId, article: articleId });
      const updatedArticle = await import_Article.Article.findByIdAndUpdate(articleId, { $inc: { likes: 1 } }, { new: true });
      res.status(201).json({ success: true, message: "Like added", likes: updatedArticle.likes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const toggleBookmark = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user?.userId;
    const existingBookmark = await import_Bookmark.Bookmark.findOne({ user: userId, article: articleId });
    if (existingBookmark) {
      await import_Bookmark.Bookmark.findByIdAndDelete(existingBookmark._id);
      res.status(200).json({ success: true, message: "Bookmark removed" });
    } else {
      await import_Bookmark.Bookmark.create({ user: userId, article: articleId });
      res.status(201).json({ success: true, message: "Bookmark added" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
