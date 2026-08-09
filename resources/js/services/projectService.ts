import type { Project, ProjectFormData } from '@/types/project';

interface ProjectResponse {
    data: Project;
}

export interface ProjectFilters {
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
    page?: number;
}

export interface PaginatedProjects {
    data: Project[];

    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

function getXsrfToken(): string {
    return decodeURIComponent(
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? '',
    );
}

export async function getProjects(
    filters: ProjectFilters = {},
): Promise<PaginatedProjects> {
    const params = new URLSearchParams();

    if (filters.search) {
        params.set('search', filters.search);
    }

    if (filters.status) {
        params.set('status', filters.status);
    }

    if (filters.priority) {
        params.set('priority', filters.priority);
    }

    if (filters.sort) {
        params.set('sort', filters.sort);
    }

    if (filters.page) {
        params.set('page', filters.page.toString());
    }

    const queryString = params.toString();

    const url = queryString ? `/api/projects?${queryString}` : '/api/projects';

    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load projects.');
    }

    return response.json();
}

export async function getProject(id: number): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load project.');
    }

    const result: ProjectResponse = await response.json();

    return result.data;
}

export async function createProject(
    project: ProjectFormData,
): Promise<Project> {
    const response = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify(project),
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result.data;
}

export async function updateProject(
    id: number,
    project: ProjectFormData,
): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify(project),
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result.data;
}

export async function deleteProject(id: number): Promise<void> {
    const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete project.');
    }
}
