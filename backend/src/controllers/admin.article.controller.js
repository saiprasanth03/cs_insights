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
var admin_article_controller_exports = {};
__export(admin_article_controller_exports, {
  createArticle: () => createArticle,
  deleteArticle: () => deleteArticle,
  getArticle: () => getArticle,
  getArticles: () => getArticles,
  updateArticle: () => updateArticle
});
module.exports = __toCommonJS(admin_article_controller_exports);
var import_Article = require("../models/Article");
var import_NewsletterCampaign = require("../models/NewsletterCampaign");
var import_Subscriber = require("../models/Subscriber");
const emailService = require("../services/email.service");

const createArticle = async (req, res) => {
  try {
    const { sendNewsletter, ...articleData } = req.body;
    const authorId = req.user?.userId || req.user?._id || req.user?.id;
    
    const article = await import_Article.Article.create({
      ...articleData,
      author: articleData.author || authorId
    });

    // Respond immediately — publishing is instant (<200ms)
    res.status(201).json({ success: true, data: article });

    // Fire newsletter as a live floating Promise AFTER responding.
    // This is NOT setImmediate — it is an active Promise that keeps
    // the Node.js event loop alive on Render until emails are sent.
    const isSendNewsletter = sendNewsletter === true || sendNewsletter === 'true';
    if (isSendNewsletter && article.status === 'PUBLISHED') {
      Promise.resolve().then(async () => {
        try {
          import_NewsletterCampaign.NewsletterCampaign.create({
            subject: article.title,
            title: article.title,
            contentHtml: article.content,
            contentPlain: article.excerpt || article.title,
            status: "SENT",
            type: "ARTICLE",
            createdBy: authorId,
            sentAt: new Date()
          }).catch(console.error);

          const subscribers = await import_Subscriber.Subscriber.find({ status: 'ACTIVE' });
          console.log(`[NEWSLETTER] Dispatching "${article.title}" to ${subscribers.length} subscribers in background...`);
          if (subscribers && subscribers.length > 0) {
            await emailService.sendNewsletter(
              {
                subject: article.title,
                title: article.title,
                slug: article.slug,
                content: article.content,
                coverImage: article.coverImage,
                author: req.user?.name || 'CS Insights'
              },
              subscribers
            );
          }
        } catch (err) {
          console.error('[NEWSLETTER] Background dispatch error in createArticle:', err);
        }
      });
    }
  } catch (error) {
    let message = error.message;
    if (error.code === 11000) {
      message = 'An article with this URL Slug or Title already exists. Please change the URL Slug or Title.';
    }
    res.status(400).json({ success: false, message });
  }
};
const getArticles = async (req, res) => {
  try {
    const articles = await import_Article.Article.find().sort({ createdAt: -1 }).populate("category", "name slug").populate("author", "name email");
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await import_Article.Article.findById(req.params.id)
      .populate("category", "name slug")
      .populate("author", "name email");
      
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { sendNewsletter, ...updateData } = req.body;
    const authorId = req.user?.userId || req.user?._id || req.user?.id;

    const article = await import_Article.Article.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    // Respond immediately — update is instant (<200ms)
    res.status(200).json({ success: true, data: article });

    // Fire newsletter as a live floating Promise AFTER responding.
    const isSendNewsletter = sendNewsletter === true || sendNewsletter === 'true';
    if (isSendNewsletter && article.status === 'PUBLISHED') {
      Promise.resolve().then(async () => {
        try {
          import_NewsletterCampaign.NewsletterCampaign.create({
            subject: article.title,
            title: article.title,
            contentHtml: article.content,
            contentPlain: article.excerpt || article.title,
            status: "SENT",
            type: "ARTICLE",
            createdBy: authorId,
            sentAt: new Date()
          }).catch(console.error);

          const subscribers = await import_Subscriber.Subscriber.find({ status: 'ACTIVE' });
          console.log(`[NEWSLETTER] Dispatching update "${article.title}" to ${subscribers.length} subscribers in background...`);
          if (subscribers && subscribers.length > 0) {
            await emailService.sendNewsletter(
              {
                subject: article.title,
                title: article.title,
                slug: article.slug,
                content: article.content,
                coverImage: article.coverImage,
                author: req.user?.name || 'CS Insights'
              },
              subscribers
            );
          }
        } catch (err) {
          console.error('[NEWSLETTER] Background dispatch error in updateArticle:', err);
        }
      });
    }
  } catch (error) {
    let message = error.message;
    if (error.code === 11000) {
      message = 'An article with this URL Slug or Title already exists. Please change the URL Slug or Title.';
    }
    res.status(400).json({ success: false, message });
  }
};
const deleteArticle = async (req, res) => {
  try {
    const articleId = (req.params.id || '').trim();
    const article = await import_Article.Article.findByIdAndDelete(articleId);
    if (!article) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
