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
var GoogleAppsScriptEmailProvider_exports = {};
__export(GoogleAppsScriptEmailProvider_exports, {
  GoogleAppsScriptEmailProvider: () => GoogleAppsScriptEmailProvider
});
module.exports = __toCommonJS(GoogleAppsScriptEmailProvider_exports);
var import_env = require("../config/env");
class GoogleAppsScriptEmailProvider {
  endpoint;
  secret;
  constructor() {
    this.endpoint = process.env.APPS_SCRIPT_ENDPOINT || "";
    this.secret = process.env.APPS_SCRIPT_SECRET || "";
  }
  async postToAppsScript(payload) {
    if (!this.endpoint) {
      console.warn("Apps Script endpoint not configured, simulating email send.");
      return true;
    }
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.secret}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Failed to send email via Apps Script:", error);
      return false;
    }
  }
  async sendEmail(options) {
    return this.postToAppsScript({
      action: "sendEmail",
      ...options
    });
  }
  async sendBatch(options) {
    let successful = 0;
    let failed = 0;
    const chunkSize = 20;
    for (let i = 0; i < options.length; i += chunkSize) {
      const chunk = options.slice(i, i + chunkSize);
      const res = await this.postToAppsScript({
        action: "sendBatch",
        emails: chunk
      });
      if (res) {
        successful += chunk.length;
      } else {
        failed += chunk.length;
      }
    }
    return { successful, failed };
  }
  async sendVerificationEmail(to, verificationToken) {
    const verificationUrl = `${import_env.ENV.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(to)}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm your subscription to CS Insights</h2>
        <p>Thank you for subscribing! Please click the button below to confirm your email address.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Confirm Subscription</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;
    return this.sendEmail({
      to,
      subject: "Verify your CS Insights subscription",
      html,
      text: `Please verify your subscription by visiting: ${verificationUrl}`
    });
  }
  async sendNewsletter(options) {
    return this.sendEmail(options);
  }
}
