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
var newsletter_routes_exports = {};
__export(newsletter_routes_exports, {
  default: () => newsletter_routes_default
});
module.exports = __toCommonJS(newsletter_routes_exports);
var import_express = require("express");
var import_newsletter = require("../controllers/newsletter.controller");
const router = (0, import_express.Router)();
router.post("/subscribe", import_newsletter.subscribe);
router.get("/verify", import_newsletter.verifySubscription);
router.post("/unsubscribe", import_newsletter.unsubscribe);
var newsletter_routes_default = router;
