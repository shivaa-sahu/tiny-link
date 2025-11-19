import Link from 'next/link';
import Head from 'next/head';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center px-4">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="text-blue-600" size={80} />
          </div>
          <h1 className="text-7xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-3 font-medium">Link not found</p>
          <p className="text-gray-500 mb-8">The short link you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Home size={20} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
