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
    authError: string | null;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            const next = await fetchAuthSession();
            setUser(next);
            setAuthError(null);
        } catch (error) {
            setUser(null);
            setAuthError(error instanceof Error ? error.message : 'Unable to refresh session');
        }
    }, []);

    useEffect(() => {
        void (async () => {
            try {
                await refresh();
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh]);

    const logout = useCallback(async () => {
        try {
            await apiPostEmpty('/auth/logout');
            setUser(null);
            setAuthError(null);
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Unable to sign out');
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, authError, refresh, logout }),
        [user, loading, authError, refresh, logout],
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
