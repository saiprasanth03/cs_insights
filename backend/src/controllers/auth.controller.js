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
var auth_controller_exports = {};
__export(auth_controller_exports, {
  googleLogin: () => googleLogin,
  login: () => login,
  logout: () => logout,
  register: () => register,
  forgotPassword: () => forgotPassword,
  resetPassword: () => resetPassword
});
module.exports = __toCommonJS(auth_controller_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_google_auth_library = require("google-auth-library");
var import_User = require("../models/User");
var import_Subscriber = require("../models/Subscriber");
var import_jwt = require("../utils/jwt");
var import_env = require("../config/env");
var crypto = require("crypto");
var emailService = require("../services/email.service");
const googleClient = new import_google_auth_library.OAuth2Client(import_env.ENV.GOOGLE_CLIENT_ID);
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Please provide all required fields" });
      return;
    }
    const existingUser = await import_User.User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }
    const salt = await import_bcryptjs.default.genSalt(10);
    const passwordHash = await import_bcryptjs.default.hash(password, salt);
    const user = await import_User.User.create({
      name,
      email,
      passwordHash,
      roles: [import_User.UserRole.READER],
      authProviders: [import_User.AuthProvider.LOCAL]
    });

    // Auto-subscribe user to newsletter
    try {
      const cleanEmail = email.trim().toLowerCase();
      const existingSub = await import_Subscriber.Subscriber.findOne({ email: cleanEmail });
      if (!existingSub) {
        await import_Subscriber.Subscriber.create({
          email: cleanEmail,
          status: import_Subscriber.SubscriberStatus.ACTIVE,
          subscribedAt: new Date(),
          verifiedAt: new Date()
        });
      }
    } catch (subErr) {
      console.error("Auto-subscribe error on register:", subErr.message);
    }

    const token = (0, import_jwt.generateToken)({ userId: user._id, roles: user.roles });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Please provide email and password" });
      return;
    }
    const user = await import_User.User.findOne({ email }).select("+passwordHash");
    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const isMatch = await import_bcryptjs.default.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const token = (0, import_jwt.generateToken)({ userId: user._id, roles: user.roles });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1e3),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: "Google token required" });
      return;
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: import_env.ENV.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      res.status(400).json({ success: false, message: "Invalid Google token payload" });
      return;
    }
    let user = await import_User.User.findOne({ email: payload.email });
    if (user) {
      if (!user.authProviders.includes(import_User.AuthProvider.GOOGLE)) {
        user.authProviders.push(import_User.AuthProvider.GOOGLE);
        user.googleId = payload.sub;
        await user.save();
      }
    } else {
      user = await import_User.User.create({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        roles: [import_User.UserRole.READER],
        authProviders: [import_User.AuthProvider.GOOGLE],
        googleId: payload.sub
      });
    }

    // Auto-subscribe Google user to newsletter
    try {
      const cleanEmail = payload.email.trim().toLowerCase();
      const existingSub = await import_Subscriber.Subscriber.findOne({ email: cleanEmail });
      if (!existingSub) {
        await import_Subscriber.Subscriber.create({
          email: cleanEmail,
          status: import_Subscriber.SubscriberStatus.ACTIVE,
          subscribedAt: new Date(),
          verifiedAt: new Date()
        });
      }
    } catch (subErr) {
      console.error("Auto-subscribe error on Google login:", subErr.message);
    }

    const jwtToken = (0, import_jwt.generateToken)({ userId: user._id, roles: user.roles });
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Google Authentication Failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await import_User.User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: "If an account exists, a password reset email has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${email}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ success: true, message: "If an account exists, a password reset email has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await import_User.User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await import_bcryptjs.default.genSalt(10);
    user.passwordHash = await import_bcryptjs.default.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};
