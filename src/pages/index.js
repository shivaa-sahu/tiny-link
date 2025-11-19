import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Plus, X, Link2, Copy, Trash2, Search, 
  ExternalLink, TrendingUp, Clock, CheckCircle2,
  AlertCircle, Loader2, BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ targetUrl: '', code: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccess('Link created successfully!');
      setFormData({ targetUrl: '', code: '' });
      setShowForm(false);
      fetchLinks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete link');
      fetchLinks();
    } catch (err) {
      alert(err.message);
    }
  };

  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text, code) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.target_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Dashboard - URL Shortener</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Link2 className="text-blue-600" size={32} />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your shortened links</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            {showForm ? (
              <>
                <X size={18} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={18} />
                Create Link
              </>
            )}
          </button>
        </div>

        {/* Stats Overview */}
        {!loading && links.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Links</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{links.length}</p>
                </div>
                <BarChart3 className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {links.reduce((sum, link) => sum + link.clicks, 0)}
                  </p>
                </div>
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg. Clicks</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {links.length > 0 ? Math.round(links.reduce((sum, link) => sum + link.clicks, 0) / links.length) : 0}
                  </p>
                </div>
                <Clock className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Link2 size={24} className="text-blue-600" />
              Create New Short Link
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <ExternalLink size={16} />
                  Target URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://example.com/your-long-url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Link2 size={16} />
                  Custom Code (optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., docs123"
                  pattern="[A-Za-z0-9]{6,8}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  6-8 alphanumeric characters (leave empty for auto-generated)
                </p>
              </div>
              {formError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}
              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {formLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Link
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Loader2 className="inline-block animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-600 font-medium">Loading your links...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-xl flex items-center gap-3">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300">
            <Link2 className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium mb-2">
              {search ? 'No links match your search' : 'No links yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {search ? 'Try a different search term' : 'Create your first shortened link to get started!'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Link2 size={14} />
                        Short Code
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ExternalLink size={14} />
                        Target URL
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} />
                        Clicks
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        Last Clicked
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.code} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`/code/${link.code}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 group"
                        >
                          <span className="bg-blue-100 px-3 py-1 rounded-lg group-hover:bg-blue-200 transition-colors">
                            {link.code}
                          </span>
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-md text-gray-700" title={link.target_url}>
                            {link.target_url}
                          </span>
                          <button
                            onClick={() => copyToClipboard(link.target_url, link.code)}
                            className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                              copiedCode === link.code
                                ? 'bg-green-100 text-green-600'
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Copy URL"
                          >
                            {copiedCode === link.code ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          <TrendingUp size={14} />
                          {link.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all flex items-center gap-1 font-medium"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
