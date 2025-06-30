import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">❓</span>
        <h2 className="text-lg font-semibold text-gray-900">{question}</h2>
      </div>
      <p className="text-gray-600 ml-8">{answer}</p>
    </div>
  );
};

export default FAQItem; 