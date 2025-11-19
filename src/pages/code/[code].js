import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, Link2, ExternalLink, Copy, 
  TrendingUp, Clock, Calendar, CheckCircle2, Loader2, AlertCircle 
} from 'lucide-react';

export default function StatsPage() {
  const router = useRouter();
  const { code } = router.query;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;

    const fetchLink = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Link not found');
          }
          throw new Error('Failed to fetch link');
        }
        const data = await res.json();
        setLink(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const shortUrl = typeof window !== 'undefined' ? `${window.location.origin}/${code}` : '';

  return (
    <>
      <Head>
        <title>Stats - {code} - URL Shortener</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center gap-2 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link2 className="text-blue-600" size={32} />
            Link Statistics
          </h1>
          <p className="text-gray-600 mt-2">Detailed analytics for your short link</p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Loader2 className="inline-block animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-600 font-medium">Loading statistics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-xl flex items-center gap-3">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : link ? (
          <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 text-sm font-medium">Total Clicks</span>
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-blue-900">{link.clicks}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 text-sm font-medium">Last Clicked</span>
                  <Clock className="text-purple-600" size={24} />
                </div>
                <p className="text-lg font-semibold text-purple-900">
                  {link.last_clicked ? new Date(link.last_clicked).toLocaleDateString() : 'Never'}
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  {link.last_clicked ? new Date(link.last_clicked).toLocaleTimeString() : ''}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600 text-sm font-medium">Created</span>
                  <Calendar className="text-green-600" size={24} />
                </div>
                <p className="text-lg font-semibold text-green-900">
                  {new Date(link.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {new Date(link.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Link Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Link2 size={16} />
                  Short Code
                </label>
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <span className="text-2xl font-bold text-blue-600">{link.code}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Link2 size={16} />
                  Short URL
                </label>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-4 py-3 rounded-lg flex-1 break-all font-mono text-sm border border-gray-300">
                    {shortUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(shortUrl, 'short')}
                    className={`flex-shrink-0 px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                      copiedText === 'short'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copiedText === 'short' ? (
                      <>
                        <CheckCircle2 size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ExternalLink size={16} />
                  Target URL
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all flex-1 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    <ExternalLink size={16} className="flex-shrink-0" />
                    <span>{link.target_url}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(link.target_url, 'target')}
                    className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                      copiedText === 'target'
                        ? 'bg-green-100 text-green-600'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Copy URL"
                  >
                    {copiedText === 'target' ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
