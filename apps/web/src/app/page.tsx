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
  let posts: PostListItem[] = [];
  let errorMessage: string | null = null;
  try {
    posts = await apiGet<PostListItem[]>('/posts');
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load posts';
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>
      <p className="mt-2 text-sm text-gray-600">
        Collecting my thoughts and experiences.
      </p>

      {errorMessage ? (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

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