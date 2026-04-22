import { ApiError, apiGet } from '@/lib/api';
import { CommentComposer } from '@/components/comment-composer';
import { notFound } from 'next/navigation';

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  author: { displayName: string | null };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: { displayName: string | null };
  }>;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Post;

  try {
    post = await apiGet<Post>(`/posts/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Unable to load post</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {error instanceof Error ? error.message : 'Something went wrong while loading this post.'}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <div className="mt-2 text-xs text-gray-500">
        {new Date(post.createdAt).toLocaleString()} ·{' '}
        {post.author.displayName ?? 'Unknown'}
      </div>

      <article className="prose mt-6 max-w-none">
        <p>{post.content}</p>
      </article>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Comments</h2>
        <div className="mt-4 space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">
                {c.author.displayName ?? 'Anonymous'} ·{' '}
                {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 text-sm">{c.content}</div>
            </div>
          ))}
          {post.comments.length === 0 && (
            <div className="rounded-lg border p-3 text-sm text-gray-600">
              No comments yet.
            </div>
          )}
        </div>

        <CommentComposer postId={post.id} />
      </section>
    </main>
  );
}