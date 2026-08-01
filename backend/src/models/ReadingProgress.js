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
var ReadingProgress_exports = {};
__export(ReadingProgress_exports, {
  ReadingProgress: () => ReadingProgress
});
module.exports = __toCommonJS(ReadingProgress_exports);
var import_mongoose = __toESM(require("mongoose"));
const ReadingProgressSchema = new import_mongoose.Schema(
  {
    user: { type: import_mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    article: { type: import_mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    lastReadAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
ReadingProgressSchema.index({ user: 1, article: 1 }, { unique: true });
const ReadingProgress = import_mongoose.default.model("ReadingProgress", ReadingProgressSchema);
