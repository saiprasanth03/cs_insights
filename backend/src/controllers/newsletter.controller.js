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
var newsletter_controller_exports = {};
__export(newsletter_controller_exports, {
  subscribe: () => subscribe,
  unsubscribe: () => unsubscribe,
  verifySubscription: () => verifySubscription
});
module.exports = __toCommonJS(newsletter_controller_exports);
var import_crypto = __toESM(require("crypto"));
var import_Subscriber = require("../models/Subscriber");
var import_GoogleAppsScriptEmailProvider = require("../providers/GoogleAppsScriptEmailProvider");
const emailProvider = new import_GoogleAppsScriptEmailProvider.GoogleAppsScriptEmailProvider();
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    let subscriber = await import_Subscriber.Subscriber.findOne({ email: cleanEmail });
    if (subscriber) {
      if (subscriber.status === import_Subscriber.SubscriberStatus.ACTIVE) {
        res.status(200).json({ success: true, message: "Already subscribed" });
        return;
      }
    } else {
      subscriber = new import_Subscriber.Subscriber({ email: cleanEmail });
    }
    
    // Auto-verify for simplicity
    subscriber.status = import_Subscriber.SubscriberStatus.ACTIVE;
    subscriber.verifiedAt = new Date();
    subscriber.subscribedAt = new Date();
    
    await subscriber.save();
    
    res.status(200).json({ success: true, message: "Successfully subscribed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const verifySubscription = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) {
      res.status(400).json({ success: false, message: "Invalid verification link" });
      return;
    }
    const subscriber = await import_Subscriber.Subscriber.findOne({ email }).select("+verificationTokenHash +verificationExpiresAt");
    if (!subscriber) {
      res.status(404).json({ success: false, message: "Subscriber not found" });
      return;
    }
    if (subscriber.status === import_Subscriber.SubscriberStatus.ACTIVE) {
      res.status(200).json({ success: true, message: "Already verified" });
      return;
    }
    const tokenHash = import_crypto.default.createHash("sha256").update(token).digest("hex");
    if (subscriber.verificationTokenHash !== tokenHash || subscriber.verificationExpiresAt && subscriber.verificationExpiresAt < /* @__PURE__ */ new Date()) {
      res.status(400).json({ success: false, message: "Invalid or expired token" });
      return;
    }
    subscriber.status = import_Subscriber.SubscriberStatus.ACTIVE;
    subscriber.verifiedAt = /* @__PURE__ */ new Date();
    subscriber.subscribedAt = /* @__PURE__ */ new Date();
    subscriber.verificationTokenHash = void 0;
    subscriber.verificationExpiresAt = void 0;
    await subscriber.save();
    res.status(200).json({ success: true, message: "Subscription verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Email required" });
      return;
    }
    await import_Subscriber.Subscriber.findOneAndUpdate(
      { email },
      { status: import_Subscriber.SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: /* @__PURE__ */ new Date() }
    );
    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
