import React, { useState, useEffect } from 'react';
import { faqs, searchFAQs, FAQ } from '../config/faqs';

interface FAQAccordionProps {
  faq: FAQ;
  isOpen: boolean;
  toggleAccordion: () => void;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faq, isOpen, toggleAccordion }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="text-gray-800 font-medium">{faq.question}</span>
        <svg
          className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 p-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{faq.answer}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {faq.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQs, setOpenFAQs] = useState<{ [key: string]: boolean }>({});
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFAQs(faqs[0].faqs);
    } else {
      setFilteredFAQs(searchFAQs(searchQuery));
    }
  }, [searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <FAQAccordion
              key={faq.id}
              faq={faq}
              isOpen={!!openFAQs[faq.id]}
              toggleAccordion={() => toggleAccordion(faq.id)}
            />
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No FAQs match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQSection; 