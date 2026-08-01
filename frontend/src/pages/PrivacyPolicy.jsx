import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>Privacy Policy | CS Insights</title>
      </Helmet>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          At CS Insights, we take your privacy seriously. This Privacy Policy outlines the types of personal information that is received and collected by CS Insights and how it is used.
        </p>
        
        <h2>Information We Collect</h2>
        <p>
          We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.
        </p>
        <ul>
          <li><strong>Information you provide to us:</strong> We collect information that you provide directly to us, such as your email address when you sign up for our newsletter or register for an account.</li>
          <li><strong>Information we collect automatically:</strong> Like most websites, we collect information that web browsers, mobile devices, and servers typically make available, such as the browser type, IP address, unique device identifiers, language preference, referring site, the date and time of access, and operating system.</li>
        </ul>

        <h2>How We Use Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our Services, to develop new ones, and to protect CS Insights and our users.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at csinsights3@gmail.com.
        </p>
      </div>
    </div>
  );
}
