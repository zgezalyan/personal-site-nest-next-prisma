import type { Metadata } from 'next';
import { RegisterForm } from '@/components/register-form';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create an account',
};

export default function RegisterPage() {
    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="text-2xl font-semibold">Create an account</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                After registering you will be signed in automatically.
            </p>
            <RegisterForm />
        </main>
    );
}
