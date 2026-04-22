'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiPostJson, type AuthUser } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { useAuthSubmit } from './use-auth-submit';

export function RegisterForm() {
    const router = useRouter();
    const { refresh } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const { pending, error, run } = useAuthSubmit();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        await run(async () => {
            await apiPostJson<AuthUser>('/auth/register', {
                email,
                password,
                ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
            });
            await refresh();
            router.push('/');
            router.refresh();
        });
    }

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600"
                />
            </div>
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium">
                    Display name <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="nickname"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
            </div>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
            >
                {pending ? 'Creating account…' : 'Create account'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                    Log in
                </Link>
            </p>
        </form>
    );
}
