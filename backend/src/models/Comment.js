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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Comment_exports = {};
__export(Comment_exports, {
  Comment: () => Comment,
  CommentStatus: () => CommentStatus
});
module.exports = __toCommonJS(Comment_exports);
var import_mongoose = __toESM(require("mongoose"));

var CommentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};

const CommentSchema = new import_mongoose.Schema(
  {
    article: { type: import_mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    user: { type: import_mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    adminReply: { type: String, default: null },
    status: { type: String, enum: Object.values(CommentStatus), default: "APPROVED" }
  },
  { timestamps: true }
);

CommentSchema.index({ article: 1, createdAt: -1 });

const Comment = import_mongoose.default.model("Comment", CommentSchema);
