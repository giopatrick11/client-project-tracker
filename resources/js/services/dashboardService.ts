export interface DashboardStats {
    total: number;
    inProgress: number;
    completed: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch('/api/dashboard', {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load dashboard.');
    }

    return response.json();
}
