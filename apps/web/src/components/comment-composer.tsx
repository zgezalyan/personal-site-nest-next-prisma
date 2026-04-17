'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { apiPostJson } from '@/lib/api';

type CreatedComment = {
    id: string;
    content: string;
    createdAt: string;
    author: { displayName: string | null };
};

export function CommentComposer({ postId }: { postId: string }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;
        setError(null);
        setPending(true);
        try {
            await apiPostJson<CreatedComment>(`/post/${postId}/comments`, {
                content: trimmed,
            });
            setContent('');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post comment');
        } finally {
            setPending(false);
        }
    }

    if (loading) {
        return (
            <div className="mt-6 rounded-lg border p-4 text-sm text-gray-500 dark:text-gray-400">
                Checking sign-in…
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mt-6 rounded-lg border p-4 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/login" className="underline underline-offset-4">
                    Sign in
                </Link>{' '}
                to leave a comment.
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label htmlFor="comment" className="block text-sm font-medium">
                Add a comment
            </label>
            <textarea
                id="comment"
                name="comment"
                rows={4}
                required
                minLength={1}
                maxLength={10000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600"
                placeholder="Write something…"
                disabled={pending}
            />
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={pending || !content.trim()}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
            >
                {pending ? 'Posting…' : 'Post comment'}
            </button>
        </form>
    );
}
