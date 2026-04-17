'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { AuthUser } from '@/lib/api';
import { apiPostEmpty, fetchAuthSession } from '@/lib/api';

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const next = await fetchAuthSession();
        setUser(next);
    }, []);

    useEffect(() => {
        void (async () => {
            try {
                await refresh();
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh]);

    const logout = useCallback(async () => {
        await apiPostEmpty('/auth/logout');
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, loading, refresh, logout }),
        [user, loading, refresh, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
