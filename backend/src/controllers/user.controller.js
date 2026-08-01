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
var user_controller_exports = {};
__export(user_controller_exports, {
  getMyBookmarks: () => getMyBookmarks,
  toggleBookmark: () => toggleBookmark,
  getMyHistory: () => getMyHistory,
  updateReadingProgress: () => updateReadingProgress
});
module.exports = __toCommonJS(user_controller_exports);
var import_Bookmark = require("../models/Bookmark");
var import_ReadingProgress = require("../models/ReadingProgress");
const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const bookmarks = await import_Bookmark.Bookmark.find({ user: userId }).populate("article");
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const articleId = req.params.id;
    const existing = await import_Bookmark.Bookmark.findOne({ user: userId, article: articleId });
    if (existing) {
      await import_Bookmark.Bookmark.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, message: 'Bookmark removed', bookmarked: false });
    }
    const newBookmark = await import_Bookmark.Bookmark.create({ user: userId, article: articleId });
    res.status(201).json({ success: true, message: 'Bookmarked', bookmarked: true, data: newBookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getMyHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const history = await import_ReadingProgress.ReadingProgress.find({ user: userId }).populate("article").sort({ lastReadAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateReadingProgress = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const articleId = req.params.id;
    const { progressPercentage, isCompleted } = req.body;
    const progress = await import_ReadingProgress.ReadingProgress.findOneAndUpdate(
      { user: userId, article: articleId },
      {
        progressPercentage,
        isCompleted: isCompleted || progressPercentage >= 90,
        lastReadAt: /* @__PURE__ */ new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
