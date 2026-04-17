import Link from 'next/link';
import { apiGet } from '@/lib/api';

type PostListItem = {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    author: {
        displayName: string | null;
    };
};

export default async function HomePage() {
  const posts = await apiGet<PostListItem[]>('/posts');
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>
      <p className="mt-2 text-sm text-gray-600">
        Collecting my thoughts and experiences.
      </p>

      <div className='mt-6 space-y-4'>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/post/${p.slug}`}
            className="block rounded-lg border p-4 hover:bg-gray-50"
          >
            <div className="text-lg font-medium">{p.title}</div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(p.createdAt).toLocaleString()} ·{' '}
              {p.author.displayName || 'Anonymous'}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="rounded-lg border p-4 text-center text-gray-600">
            No published posts yet.
          </div>
        )}
      </div>
    </main>
  );
}  