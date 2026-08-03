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
var admin_newsletter_controller_exports = {};
__export(admin_newsletter_controller_exports, {
  createCampaign: () => createCampaign,
  getCampaigns: () => getCampaigns,
  getSubscribers: () => getSubscribers,
  unsubscribe: () => unsubscribe,
  testEmail: () => testEmail
});
module.exports = __toCommonJS(admin_newsletter_controller_exports);
var import_NewsletterCampaign = require("../models/NewsletterCampaign");
var import_Subscriber = require("../models/Subscriber");
var import_User = require("../models/User");
var emailService = require("../services/email.service");
  const testEmail = async (req, res) => {
    try {
      const email = req.body.email || req.user.email;
      const results = await emailService.testEmailConnections(email);
      res.status(200).json({ success: true, results });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
const createCampaign = async (req, res) => {
  try {
    const htmlContent = emailService.transporter ? require('../services/templates/newsletter.template')(req.body) : '';

    const campaign = await import_NewsletterCampaign.NewsletterCampaign.create({
      ...req.body,
      type: 'ARTICLE', // Adding required field
      contentPlain: req.body.content,
      contentHtml: htmlContent || '<p>HTML Preview</p>',
      createdBy: req.user?.userId
    });

    // Fetch all active subscribers
    const subscribers = await import_Subscriber.Subscriber.find({ status: 'ACTIVE' });
    
    let previewUrl = null;
    
    if (subscribers.length > 0) {
      previewUrl = await emailService.sendNewsletter(req.body, subscribers);
      // Update campaign status
      campaign.status = 'SENT';
      campaign.sentAt = new Date();
      campaign.metrics = { sent: subscribers.length, opened: 0, clicked: 0 };
      await campaign.save();
    }

    res.status(201).json({ 
      success: true, 
      data: campaign, 
      previewUrl,
      subscriberCount: subscribers.length
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await import_NewsletterCampaign.NewsletterCampaign.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getSubscribers = async (req, res) => {
  try {
    // 1. Sync all registered users into Subscriber collection so no registered reader is ever missing in dashboard
    const users = await import_User.User.find({}, 'email createdAt');
    for (const u of users) {
      if (u.email) {
        const cleanEmail = u.email.trim().toLowerCase();
        const existing = await import_Subscriber.Subscriber.findOne({ email: cleanEmail });
        if (!existing) {
          await import_Subscriber.Subscriber.create({
            email: cleanEmail,
            status: import_Subscriber.SubscriberStatus.ACTIVE,
            subscribedAt: u.createdAt || new Date(),
            verifiedAt: u.createdAt || new Date()
          });
        }
      }
    }

    // 2. Fetch all subscribers sorted by latest
    const subscribers = await import_Subscriber.Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const subscriber = await import_Subscriber.Subscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
      { new: true }
    );
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }
    res.status(200).json({ success: true, message: "Successfully unsubscribed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
