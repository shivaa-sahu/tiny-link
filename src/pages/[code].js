import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectPage() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (!code) return;

    const redirect = async () => {
      try {
        const res = await fetch(`/api/redirect/${code}`);
        if (res.ok) {
          const data = await res.json();
          window.location.href = data.target_url;
        } else {
          router.push('/404');
        }
      } catch (err) {
        router.push('/404');
      }
    };

    redirect();
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
