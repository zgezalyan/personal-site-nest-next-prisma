const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

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