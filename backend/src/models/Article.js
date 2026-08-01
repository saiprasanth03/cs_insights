"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Article_exports = {};
__export(Article_exports, {
  Article: () => Article,
  ArticleStatus: () => ArticleStatus
});
module.exports = __toCommonJS(Article_exports);
var import_mongoose = __toESM(require("mongoose"));
var ArticleStatus = /* @__PURE__ */ ((ArticleStatus2) => {
  ArticleStatus2["DRAFT"] = "DRAFT";
  ArticleStatus2["SCHEDULED"] = "SCHEDULED";
  ArticleStatus2["PUBLISHED"] = "PUBLISHED";
  ArticleStatus2["ARCHIVED"] = "ARCHIVED";
  return ArticleStatus2;
})(ArticleStatus || {});
const ArticleSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    // Store Editor JSON as stringified
    coverImage: { type: String },
    author: { type: import_mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: import_mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: import_mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(ArticleStatus),
      default: "DRAFT" /* DRAFT */
    },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number },
    // in minutes
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    allowLikes: { type: Boolean, default: true },
    allowComments: { type: Boolean, default: true },
    allowShares: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    canonicalUrl: { type: String },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ featured: 1 });
const Article = import_mongoose.default.model("Article", ArticleSchema);
