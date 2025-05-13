import React from 'react';
import Head from 'next/head';
import FAQSection from '../components/FAQSection';

const FAQPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Barbeque Nation</title>
        <meta 
          name="description" 
          content="Find answers to frequently asked questions about Barbeque Nation's menu, drinks, and more." 
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-orange-600 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Barbeque Nation FAQs</h1>
            <p className="mt-2">Find answers to common questions about our food, drinks, and services</p>
          </div>
        </header>
        <main className="container mx-auto py-8">
          <FAQSection />
        </main>
      </div>
    </>
  );
};

export default FAQPage; 