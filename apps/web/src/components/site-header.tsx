'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export function SiteHeader() {
    const { user, loading, logout } = useAuth();

    return (
        <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold text-gray-900 dark:text-gray-100">
                    My Blog
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                    {loading ? (
                        <span className="text-gray-500">…</span>
                    ) : user ? (
                        <>
                            <span className="text-gray-600 dark:text-gray-400">
                                {user.displayName || user.email}
                            </span>
                            <button
                                type="button"
                                onClick={() => void logout()}
                                className="rounded-md border border-gray-300 px-3 py-1 text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-900"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-700 underline-offset-4 hover:underline dark:text-gray-300"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-gray-900 px-3 py-1 text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
