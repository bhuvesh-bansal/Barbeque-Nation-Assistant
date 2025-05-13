import { NextPage } from 'next';
import { NextPageContext } from 'next';

interface CustomErrorProps {
  statusCode: number | null;
}

const Error: NextPage<CustomErrorProps> = ({ statusCode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </h1>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again later.
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

Error.getInitialProps = ({ res, err }: NextPageContext): CustomErrorProps => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : null;
  return { statusCode };
};

export default Error; 