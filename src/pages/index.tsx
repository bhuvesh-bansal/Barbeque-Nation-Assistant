import type { NextPage } from 'next';
import Head from 'next/head';
import ChatBot from '../components/ChatBot';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>BBQ Nation Chatbot</title>
        <meta name="description" content="BBQ Nation Restaurant Chatbot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">BBQ Nation Assistant</h1>
                <ChatBot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 