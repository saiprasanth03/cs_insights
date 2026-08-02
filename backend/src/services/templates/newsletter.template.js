const { marked } = require('marked');

module.exports = function generateNewsletterHtml(campaign) {
  const { subject, title, author = 'CS Insights', date = new Date(), content, coverImage, slug } = campaign;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cs-insights-frontend.vercel.app';
  const logoUrl = `https://raw.githubusercontent.com/saiprasanth03/cs_insights/main/frontend/public/cs_insights.png`;
  const targetUrl = slug ? `${FRONTEND_URL}/articles/${slug}` : FRONTEND_URL;
  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date)).toUpperCase();

  // Convert markdown to HTML using marked
  let htmlContent = '';
  if (content) {
    // Process custom syntax like #1'Heading'# before passing to marked
    const preProcessedContent = content
      .replace(/#1'([^']+)'#/g, '# $1')
      .replace(/#2'([^']+)'#/g, '## $1');

    htmlContent = marked(preProcessedContent);
    // Convert code blocks into line-by-line nowrap divs inside a table-centered container so character columns align with 100% mathematical precision
    htmlContent = htmlContent.replace(/<pre><code(?: class="[^"]*")?>([\s\S]*?)<\/code><\/pre>/gi, (match, codeContent) => {
      const lines = codeContent.split('\n');
      const formattedLines = lines.map(line => 
        `<div style="white-space: nowrap !important; word-break: normal !important; word-wrap: normal !important; font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.35; letter-spacing: 0px; -webkit-text-size-adjust: 100%; color: #f4f4f5; text-align: left;">${line || '&nbsp;'}</div>`
      ).join('');

      return `<div style="width: 100%; box-sizing: border-box; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 24px 0; background-color: #18181b; border-radius: 12px; padding: 20px 16px; border: 1px solid #27272a; text-align: center;"><div style="display: table; margin: 0 auto; text-align: left; max-width: 100%;">${formattedLines}</div></div>`;
    });
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Markdown Styles for Email */
    .content-body {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
      font-size: 15px; 
      line-height: 1.8; 
      color: #1f2937;
    }
    .content-body p { margin-bottom: 24px; }
    .content-body h1, .content-body h2, .content-body h3 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #111827; 
      margin-top: 40px; 
      margin-bottom: 16px; 
      letter-spacing: -0.5px;
    }
    .content-body h1 { font-size: 32px; font-weight: 800; }
    .content-body h2 { font-size: 28px; font-weight: 800; }
    .content-body h3 { font-size: 24px; font-weight: 700; }
    .content-body blockquote {
      border-left: 4px solid #6366f1; 
      padding-left: 16px; 
      margin: 24px 0; 
      font-size: 16px; 
      font-weight: 600; 
      color: #111827; 
      line-height: 1.6;
    }
    .content-body img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 24px 0;
      display: block;
    }
    .content-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .content-body th, .content-body td {
      border: 1px solid #e5e7eb;
      padding: 12px 16px;
      text-align: left;
    }
    .content-body th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    .content-body a {
      color: #6366f1;
      text-decoration: underline;
    }
    
    @media only screen and (max-width: 600px) {
      .content-body h1 { font-size: 26px !important; word-break: break-word; }
      .content-body h2 { font-size: 22px !important; word-break: break-word; }
      .content-body h3 { font-size: 18px !important; word-break: break-word; }
      .email-title { font-size: 26px !important; word-break: break-word !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 20px 20px 60px 20px;">
    
    <!-- Header Row: Website Logo (Top-Left) & Forwarded Banner (Top-Right) -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td align="left" valign="middle">
          <a href="${FRONTEND_URL}" style="text-decoration: none; display: inline-block;">
            <img src="${logoUrl}" width="42" height="42" alt="CS Insights" style="display: block; width: 42px; height: 42px; max-width: 42px; max-height: 42px; border-radius: 10px; border: 0; outline: none; text-decoration: none;" />
          </a>
        </td>
        <td align="right" valign="middle" style="font-size: 12px; color: #6b7280; font-family: -apple-system, sans-serif;">
          Forwarded this email? <a href="${FRONTEND_URL}" style="color: #111827; text-decoration: underline;">Subscribe here</a>
        </td>
      </tr>
    </table>

    <!-- Main Section: Title on Left, Author & Date on Right -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px;">
      <tr>
        <td align="left" valign="bottom" style="padding-right: 12px;">
          <h1 class="email-title" style="font-size: 32px; font-weight: 800; color: #111827; line-height: 1.2; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing: -0.5px; word-break: break-word;">
            <a href="${targetUrl}" style="color: #111827; text-decoration: none;">${title || subject}</a>
          </h1>
        </td>
        <td align="right" valign="bottom" style="white-space: nowrap;">
          <div style="font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 4px; letter-spacing: 0.3px;">${author}</div>
          <div style="font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.3px;">${formattedDate}</div>
        </td>
      </tr>
    </table>

    <!-- Action Row (Icons & Read in App) -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px;">
      <tr>
        <td align="left">
          <!-- Icons -->
          <a href="${slug ? `${FRONTEND_URL}/articles/${slug}` : FRONTEND_URL}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e7eb; text-align: center; line-height: 36px; text-decoration: none; color: #6b7280; margin-right: 8px;">♡</a>
          <a href="${slug ? `${FRONTEND_URL}/articles/${slug}#comments` : FRONTEND_URL}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e7eb; text-align: center; line-height: 36px; text-decoration: none; color: #6b7280; margin-right: 8px;">💬</a>
          <a href="${slug ? `${FRONTEND_URL}/articles/${slug}` : FRONTEND_URL}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e7eb; text-align: center; line-height: 36px; text-decoration: none; color: #6b7280;">⎋</a>
        </td>
        <td align="right">
          <a href="${slug ? `${FRONTEND_URL}/articles/${slug}` : FRONTEND_URL}" style="display: inline-block; padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 20px; font-size: 12px; font-weight: 600; color: #6b7280; text-decoration: none; letter-spacing: 0.5px;">
            READ IN APP ↗
          </a>
        </td>
      </tr>
    </table>

    <!-- Content Body -->
    <div class="content-body">
      ${htmlContent}
    </div>
    
    <!-- Footer Divider -->
    <div style="border-top: 1px solid #e5e7eb; margin-top: 60px; padding-top: 40px; text-align: center;">
      <div style="font-size: 24px; font-weight: 900; color: #d1d5db; letter-spacing: -1px; margin-bottom: 20px;">CS INSIGHTS</div>
      <p style="font-size: 12px; color: #9ca3af; font-family: -apple-system, sans-serif;">
        You're receiving this because you subscribed to our newsletter.<br/>
        <a href="${FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
};
