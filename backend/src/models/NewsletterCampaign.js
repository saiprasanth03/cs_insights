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
var NewsletterCampaign_exports = {};
__export(NewsletterCampaign_exports, {
  CampaignStatus: () => CampaignStatus,
  CampaignType: () => CampaignType,
  NewsletterCampaign: () => NewsletterCampaign
});
module.exports = __toCommonJS(NewsletterCampaign_exports);
var import_mongoose = __toESM(require("mongoose"));
var CampaignStatus = /* @__PURE__ */ ((CampaignStatus2) => {
  CampaignStatus2["DRAFT"] = "DRAFT";
  CampaignStatus2["QUEUED"] = "QUEUED";
  CampaignStatus2["SENDING"] = "SENDING";
  CampaignStatus2["SENT"] = "SENT";
  CampaignStatus2["PARTIALLY_FAILED"] = "PARTIALLY_FAILED";
  CampaignStatus2["FAILED"] = "FAILED";
  return CampaignStatus2;
})(CampaignStatus || {});
var CampaignType = /* @__PURE__ */ ((CampaignType2) => {
  CampaignType2["ARTICLE"] = "ARTICLE";
  CampaignType2["DIGEST"] = "DIGEST";
  return CampaignType2;
})(CampaignType || {});
const NewsletterCampaignSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, enum: Object.values(CampaignType), required: true },
    contentHtml: { type: String, required: true },
    contentPlain: { type: String, required: true },
    articles: [{ type: import_mongoose.Schema.Types.ObjectId, ref: "Article" }],
    status: {
      type: String,
      enum: Object.values(CampaignStatus),
      default: "DRAFT" /* DRAFT */
    },
    totalRecipients: { type: Number, default: 0 },
    successfulSends: { type: Number, default: 0 },
    failedSends: { type: Number, default: 0 },
    createdBy: { type: import_mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sentAt: { type: Date }
  },
  { timestamps: true }
);
NewsletterCampaignSchema.index({ status: 1, createdAt: -1 });
const NewsletterCampaign = import_mongoose.default.model("NewsletterCampaign", NewsletterCampaignSchema);
