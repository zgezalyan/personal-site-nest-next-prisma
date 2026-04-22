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

export class ApiError extends Error {
    status: number;
    path: string;

    constructor(path: string, status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.path = path;
    }
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

type RequestOptions = Omit<RequestInit, 'credentials'> & {
    timeoutMs?: number;
};

async function apiRequest(path: string, options: RequestOptions = {}): Promise<Response> {
    const { timeoutMs = 10000, ...requestInit } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            credentials: 'include',
            cache: 'no-store',
            ...requestInit,
            signal: controller.signal,
        });

        if (!res.ok) {
            throw new ApiError(path, res.status, await parseApiErrorMessage(res));
        }

        return res;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError(path, 408, 'Request timed out');
        }
        throw new ApiError(path, 500, 'Network request failed');
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function apiGet<T>(path: string): Promise<T> {
    const response = await apiRequest(path);
    return response.json() as Promise<T>;
}

export async function fetchAuthSession(): Promise<AuthUser | null> {
    const path = '/auth/me';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
        });

        if (res.status === 401) return null;
        if (!res.ok) {
            throw new ApiError(path, res.status, await parseApiErrorMessage(res));
        }
        return res.json() as Promise<AuthUser>;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError(path, 408, 'Request timed out');
        }
        throw new ApiError(path, 500, 'Network request failed');
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
    const res = await apiRequest(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
}

export async function apiPostEmpty(path: string): Promise<void> {
    await apiRequest(path, {
        method: 'POST',
    });
}
