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
var Subscriber_exports = {};
__export(Subscriber_exports, {
  Subscriber: () => Subscriber,
  SubscriberStatus: () => SubscriberStatus
});
module.exports = __toCommonJS(Subscriber_exports);
var import_mongoose = __toESM(require("mongoose"));
var SubscriberStatus = /* @__PURE__ */ ((SubscriberStatus2) => {
  SubscriberStatus2["PENDING"] = "PENDING";
  SubscriberStatus2["ACTIVE"] = "ACTIVE";
  SubscriberStatus2["UNSUBSCRIBED"] = "UNSUBSCRIBED";
  return SubscriberStatus2;
})(SubscriberStatus || {});
const SubscriberSchema = new import_mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: Object.values(SubscriberStatus),
      default: "PENDING" /* PENDING */
    },
    verificationTokenHash: { type: String, select: false },
    verificationExpiresAt: { type: Date, select: false },
    subscribedAt: { type: Date },
    verifiedAt: { type: Date },
    unsubscribedAt: { type: Date },
    source: { type: String }
  },
  { timestamps: true }
);
SubscriberSchema.index({ status: 1 });
const Subscriber = import_mongoose.default.model("Subscriber", SubscriberSchema);
