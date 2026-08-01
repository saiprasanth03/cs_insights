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
var article_routes_exports = {};
__export(article_routes_exports, {
  default: () => article_routes_default
});
module.exports = __toCommonJS(article_routes_exports);
var import_express = require("express");
var import_interaction = require("../controllers/interaction.controller");
var import_comment = require("../controllers/comment.controller");
var import_user = require("../controllers/user.controller");
var import_article = require("../controllers/article.controller");
var import_auth = require("../middleware/auth.middleware");
const router = (0, import_express.Router)();
router.get("/", import_article.getArticles);
router.get("/:slug", import_article.getArticleBySlug);
router.get("/:id/comments", import_comment.getArticleComments);

router.use(import_auth.authenticate);
router.post("/:id/like", import_interaction.toggleLike);
router.post("/:id/bookmark", import_interaction.toggleBookmark);
router.post("/:id/comments", import_comment.addComment);
router.patch("/:id/progress", import_user.updateReadingProgress);
var article_routes_default = router;
