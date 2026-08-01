import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ icon: Icon = FileQuestion, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
