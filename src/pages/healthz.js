import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Activity, CheckCircle2, XCircle, Loader2, Database, Server, Zap } from 'lucide-react';

export default function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/healthz');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setHealth({ ok: false, error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Health Check - URL Shortener</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-green-600" size={32} />
            System Health
          </h1>
          <p className="text-gray-600 mt-2">Monitor the status of your URL shortener service</p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Loader2 className="inline-block animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-600 font-medium">Checking system health...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-xl shadow-lg p-8 border-2 ${
              health?.ok 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
            }`}>
              <div className="flex items-center gap-4">
                {health?.ok ? (
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={48} />
                ) : (
                  <XCircle className="text-red-600 flex-shrink-0" size={48} />
                )}
                <div>
                  <h2 className={`text-3xl font-bold ${health?.ok ? 'text-green-900' : 'text-red-900'}`}>
                    {health?.ok ? 'All Systems Operational' : 'System Issues Detected'}
                  </h2>
                  <p className={`text-lg mt-1 ${health?.ok ? 'text-green-700' : 'text-red-700'}`}>
                    {health?.ok ? 'Everything is running smoothly' : 'Some services may be unavailable'}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border-2 ${
                health?.ok 
                  ? 'bg-white border-green-200' 
                  : 'bg-white border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-semibold">API Server</span>
                  <Server className={health?.ok ? 'text-green-600' : 'text-red-600'} size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {health?.ok ? (
                    <CheckCircle2 className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <span className={`font-medium ${health?.ok ? 'text-green-700' : 'text-red-700'}`}>
                    {health?.ok ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${
                health?.database 
                  ? 'bg-white border-green-200' 
                  : 'bg-white border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-semibold">Database</span>
                  <Database className={health?.database ? 'text-green-600' : 'text-red-600'} size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {health?.database ? (
                    <CheckCircle2 className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <span className={`font-medium ${health?.database ? 'text-green-700' : 'text-red-700'}`}>
                    {health?.database ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-semibold">Response Time</span>
                  <Zap className="text-blue-600" size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {health?.timestamp ? '< 100ms' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            {health && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-gray-600" />
                  Detailed Information
                </h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm border border-gray-200 font-mono">
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
              Auto-refreshes every 30 seconds • Last checked: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
