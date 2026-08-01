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
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_auth = __toESM(require("./routes/auth.routes"));
var import_admin = __toESM(require("./routes/admin.routes"));
var import_article = __toESM(require("./routes/article.routes"));
var import_user = __toESM(require("./routes/user.routes"));
var import_newsletter = __toESM(require("./routes/newsletter.routes"));
var import_category = __toESM(require("./routes/category.routes"));
var import_author = __toESM(require("./routes/author.routes"));
var import_upload = require("./routes/upload.routes");
var import_path = require("path");
const app = (0, import_express.default)();
  app.use((0, import_helmet.default)({
    crossOriginResourcePolicy: false,
  }));
  
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cs-insights.vercel.app",
    "https://cs-insights-frontend.vercel.app"
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  app.use((0, import_cors.default)({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
const limiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/", limiter);
app.use(import_express.default.json());
app.use((0, import_cookie_parser.default)());

// Serve static files from the uploads directory
app.use('/uploads', import_express.default.static(import_path.join(process.cwd(), 'public', 'uploads')));

app.use("/api/v1/auth", import_auth.default);
app.use("/api/v1/admin", import_admin.default);
app.use("/api/v1/articles", import_article.default);
app.use("/api/v1/me", import_user.default);
app.use("/api/v1/newsletter", import_newsletter.default);
app.use("/api/v1/categories", import_category.default);
app.use("/api/v1/authors", import_author.default);
app.use("/api/v1/upload", import_upload);
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var app_default = app;
