'use client';

import { useCallback, useState } from 'react';

export function useAuthSubmit() {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(async (action: () => Promise<void>) => {
        setError(null);
        setPending(true);
        try {
            await action();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setPending(false);
        }
    }, []);

    return { pending, error, run };
}
