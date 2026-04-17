const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export function getApiBaseUrl(): string {
    return baseUrl;
}

export type AuthUser = {
    id: string;
    email: string;
    role: string;
    displayName: string | null;
    createdAt: string;
    updatedAt: string;
};

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

async function parseApiErrorMessage(res: Response): Promise<string> {
    try {
        const data: unknown = await res.json();
        if (data && typeof data === 'object' && 'message' in data) {
            const msg = (data as { message: unknown }).message;
            if (Array.isArray(msg)) return msg.map(String).join(', ');
            if (typeof msg === 'string') return msg;
        }
    } catch {
        /* ignore */
    }
    return res.statusText;
}

export async function fetchAuthSession(): Promise<AuthUser | null> {
    const res = await fetch(`${baseUrl}/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
    });
    if (res.status === 401) return null;
    if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res));
    }
    return res.json() as Promise<AuthUser>;
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res));
    }
    return res.json() as Promise<T>;
}

export async function apiPostEmpty(path: string): Promise<void> {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res));
    }
}
