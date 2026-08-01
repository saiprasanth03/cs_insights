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
var auth_routes_exports = {};
__export(auth_routes_exports, {
  default: () => auth_routes_default
});
module.exports = __toCommonJS(auth_routes_exports);
var import_express = require("express");
var import_auth = require("../controllers/auth.controller");
var import_auth2 = require("../middleware/auth.middleware");
var import_User = require("../models/User");
const router = (0, import_express.Router)();
router.post("/register", import_auth.register);
router.post("/login", import_auth.login);
router.post("/logout", import_auth.logout);
router.post("/google", import_auth.googleLogin);
router.post("/forgot-password", import_auth.forgotPassword);
router.post("/reset-password", import_auth.resetPassword);
router.get("/me", import_auth2.authenticate, async (req, res) => {
  try {
    const user = await import_User.User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ 
      success: true, 
      data: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        roles: user.roles, 
        avatar: user.avatar 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
var auth_routes_default = router;
