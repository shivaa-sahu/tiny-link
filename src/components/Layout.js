import Link from 'next/link';
import { Link2, LayoutDashboard, Activity } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700 transition-colors">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Link2 className="text-white" size={24} />
              </div>
              <span>Tiny-Link</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link 
                href="/healthz" 
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
              >
                <Activity size={18} />
                Health
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
