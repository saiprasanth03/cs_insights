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
var comment_controller_exports = {};
__export(comment_controller_exports, {
  addComment: () => addComment,
  getCommentsForModeration: () => getCommentsForModeration,
  moderateComment: () => moderateComment,
  getArticleComments: () => getArticleComments,
  deleteComment: () => deleteComment,
  updateComment: () => updateComment,
  replyToComment: () => replyToComment
});
module.exports = __toCommonJS(comment_controller_exports);
var import_Comment = require("../models/Comment");
var import_Article = require("../models/Article");
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const articleId = req.params.id;
    const userId = req.user?.userId;
    if (!content) {
      res.status(400).json({ success: false, message: "Content is required" });
      return;
    }
    
    const article = await import_Article.Article.findById(articleId);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });
    if (article.allowComments === false) return res.status(403).json({ success: false, message: "Comments are disabled for this article" });

    const comment = await import_Comment.Comment.create({
      content,
      user: userId,
      article: articleId,
      status: import_Comment.CommentStatus.APPROVED
    });
    res.status(201).json({ success: true, message: "Comment posted", data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArticleComments = async (req, res) => {
  try {
    const articleId = req.params.id;
    const comments = await import_Comment.Comment.find({ article: articleId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCommentsForModeration = async (req, res) => {
  try {
    const comments = await import_Comment.Comment.find().populate("user", "name email").populate("article", "title slug").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const moderateComment = async (req, res) => {
  try {
    const { status } = req.body;
    const commentId = req.params.id;
    if (!Object.values(import_Comment.CommentStatus).includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status" });
      return;
    }
    const comment = await import_Comment.Comment.findByIdAndUpdate(commentId, { status }, { new: true });
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await import_Comment.Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const replyToComment = async (req, res) => {
  try {
    const { adminReply } = req.body;
    if (!adminReply) return res.status(400).json({ success: false, message: "Reply content is required" });
    
    const comment = await import_Comment.Comment.findByIdAndUpdate(
      req.params.id, 
      { adminReply }, 
      { new: true }
    );
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "Content is required" });
    const comment = await import_Comment.Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    ).populate("user", "name email").populate("article", "title slug");
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
