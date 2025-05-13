import { NextPage } from 'next';

const ServerError: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Server Error
        </h2>
        <p className="text-gray-600 mb-8">
          We apologize, but something went wrong on our server.
          Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ServerError; 