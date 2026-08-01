import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>About Us | CS Insights</title>
      </Helmet>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">About CS Insights</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>
          Welcome to <strong>CS Insights</strong>, created by <strong>S Sai Prasanth</strong>. This is your premier destination for mastering computer science, software engineering, and system design. 
        </p>
        <p>
          Our mission is to break down complex, intimidating technical concepts into clear, digestible, and highly visual tutorials. Whether you are a student preparing for your first technical interview, or a senior engineer looking to brush up on distributed systems architecture, CS Insights is built for you.
        </p>
        <h2>Our Vision</h2>
        <p>
          We believe that high-quality technical education should be accessible and engaging. The modern software landscape evolves rapidly, and we strive to provide timeless foundational knowledge alongside modern best practices.
        </p>
        <h2>What We Cover</h2>
        <ul>
          <li>Data Structures & Algorithms</li>
          <li>System Design & Architecture</li>
          <li>Database Internals</li>
          <li>Modern Web Development</li>
          <li>Cloud Computing & DevOps</li>
        </ul>
        <p>
          Thank you for joining us on this journey to become better engineers, one concept at a time.
        </p>
      </div>
    </div>
  );
}
