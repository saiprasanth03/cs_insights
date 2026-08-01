import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>Terms of Service | CS Insights</title>
      </Helmet>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Terms</h2>
        <p>
          By accessing the website at CS Insights, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on CS Insights's website for personal, non-commercial transitory viewing only.
        </p>
        <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on CS Insights's website;</li>
        </ul>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on CS Insights's website are provided on an 'as is' basis. CS Insights makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall CS Insights or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CS Insights's website.
        </p>
      </div>
    </div>
  );
}
