# CS Insights

**Computer Science, Explained Clearly.**

CS Insights is a scalable Computer Science educational publishing platform where users can learn concepts through high-quality articles, code examples, diagrams, equations, images, videos, downloadable resources, discussions, and structured content.

## Architecture

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Media:** Cloudinary
- **Emails:** Google Apps Script

## Repository Structure

```
cs-insights/
│
├── frontend/             # Next.js frontend application
├── backend/              # Node.js + Express backend API
├── google-apps-script/   # Google Apps Script for email newsletter provider
├── documentation/        # Additional documentation
├── package.json          # Root monorepo package configuration
└── README.md
```

## Requirements

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for Google OAuth)
- Cloudinary Account
- Google Apps Script

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm run dev
   ```

2. **Frontend Setup:**
   - Copy `frontend/.env.example` to `frontend/.env.local`.
   - Configure the necessary API keys and endpoints.

3. **Backend Setup:**
   - Copy `backend/.env.example` to `backend/.env`.
   - Provide your MongoDB connection string and secret keys.

4. **Start Development Servers:**
   ```bash
   npm run dev
   ```
   This will start both the Next.js frontend (port 3000) and the Express backend (port 5000) in parallel.

## Environment Variables

See the `.env.example` files in the `frontend` and `backend` directories for the required configuration.

## Features

- **Double Opt-in Newsletter:** Secure newsletter subscription and management.
- **Block-Based Editor:** Educational formatting with code blocks, Mermaid diagrams, and LaTeX.
- **RBAC (Role-Based Access Control):** Granular permissions for Readers, Authors, Admins, and Super Admins.
- **Bookmarks & Reading Progress:** Personalized tracking for registered users.
- **Content Moderation:** Comments require approval from an administrator.
- **SEO & Performance:** Server-rendered pages with dynamic metadata and high performance.

## License

All rights reserved.
