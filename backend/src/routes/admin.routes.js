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
var admin_routes_exports = {};
__export(admin_routes_exports, {
  default: () => admin_routes_default
});
module.exports = __toCommonJS(admin_routes_exports);
var import_express = require("express");
var import_auth = require("../middleware/auth.middleware");
var import_User = require("../models/User");
var import_admin_category = require("../controllers/admin.category.controller");
var import_admin_article = require("../controllers/admin.article.controller");
var import_comment = require("../controllers/comment.controller");
var import_admin_newsletter = require("../controllers/admin.newsletter.controller");
var import_admin_author = require("../controllers/admin.author.controller");
const router = (0, import_express.Router)();
router.use(import_auth.authenticate);
router.use((0, import_auth.authorize)([import_User.UserRole.ADMIN, import_User.UserRole.SUPER_ADMIN, import_User.UserRole.AUTHOR]));
router.route("/categories").get(import_admin_category.getCategories).post(import_admin_category.createCategory);
router.route("/categories/:id").get(import_admin_category.getCategory).put(import_admin_category.updateCategory).delete(import_admin_category.deleteCategory);
router.route("/articles").get(import_admin_article.getArticles).post(import_admin_article.createArticle);
router.route("/articles/:id").get(import_admin_article.getArticle).put(import_admin_article.updateArticle).delete(import_admin_article.deleteArticle);
router.route("/comments").get(import_comment.getCommentsForModeration);
router.route("/comments/:id/moderate").put(import_comment.moderateComment);
router.route("/comments/:id").put(import_comment.updateComment).delete(import_comment.deleteComment);
router.route("/comments/:id/reply").post(import_comment.replyToComment);
router.route("/subscribers").get(import_admin_newsletter.getSubscribers);
router.route("/authors").get(import_admin_author.getAuthors).post(import_admin_author.createAuthor);
router.route("/authors/:id").get(import_admin_author.getAuthor).put(import_admin_author.updateAuthor).delete(import_admin_author.deleteAuthor);
router.route("/test-email").post(import_admin_newsletter.testEmail);
var admin_routes_default = router;
