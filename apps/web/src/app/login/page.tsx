import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
    title: 'Log in',
    description: 'Sign in to your account',
};

export default function LoginPage() {
    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="text-2xl font-semibold">Log in</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Use your email and password. Your session is stored in an httpOnly cookie.
            </p>
            <LoginForm />
        </main>
    );
}
