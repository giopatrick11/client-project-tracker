import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

import type { Project } from '@/types/project';
import { deleteProject, getProjects } from '@/services/projectService';

export default function ProjectsIndex() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const [sort, setSort] = useState<'due_asc' | 'due_desc'>('due_asc');

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, priority, sort]);

    useEffect(() => {
        async function loadProjects() {
            setIsLoading(true);
            setLoadError('');

            try {
                const result = await getProjects({
                    search: debouncedSearch,
                    status,
                    priority,
                    sort,
                    page,
                });

                setProjects(result.data);

                setPagination({
                    currentPage: result.meta.current_page,
                    lastPage: result.meta.last_page,
                    total: result.meta.total,
                });
            } catch (error) {
                if (error instanceof Error) {
                    setLoadError(error.message);
                } else {
                    setLoadError('Failed to load projects.');
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadProjects();
    }, [debouncedSearch, status, priority, sort, page]);

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this project?',
        );

        if (!confirmed) {
            return;
        }

        setActionError('');
        setDeletingId(id);

        try {
            await deleteProject(id);

            const result = await getProjects({
                search: debouncedSearch,
                status,
                priority,
                sort,
                page,
            });

            if (result.data.length === 0 && page > 1) {
                setPage((currentPage) => currentPage - 1);
                return;
            }

            setProjects(result.data);

            setPagination({
                currentPage: result.meta.current_page,
                lastPage: result.meta.last_page,
                total: result.meta.total,
            });
        } catch (error) {
            if (error instanceof Error) {
                setActionError(error.message);
            } else {
                setActionError('Failed to delete project.');
            }
        } finally {
            setDeletingId(null);
        }
    }

    function toggleDueDateSort() {
        setSort((currentSort) =>
            currentSort === 'due_asc' ? 'due_desc' : 'due_asc',
        );
    }

    function clearFilters() {
        setSearch('');
        setStatus('');
        setPriority('');
        setPage(1);
    }

    const hasFilters = search !== '' || status !== '' || priority !== '';

    if (loadError) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 px-6 py-4">
                    <p className="text-sm text-red-700">{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Client Project Tracker
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage client projects, priorities, and progress.
                    </p>
                </div>

                <Link
                    href="/projects/create"
                    className="w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
                >
                    Create Project
                </Link>
            </div>

            {actionError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{actionError}</p>
                </div>
            )}

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search client or project..."
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 lg:max-w-sm"
                />

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 sm:w-auto"
                >
                    <option value="">All Statuses</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 sm:w-auto"
                >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-left text-sm font-medium text-gray-500 hover:text-gray-900 sm:text-center"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-gray-200 bg-white sm:min-h-[560px]">
                    <p className="text-sm text-gray-500">Loading projects...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-gray-300 sm:min-h-[560px]">
                    <div className="px-6 text-center">
                        <h2 className="text-lg font-medium text-gray-900">
                            No projects found
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {hasFilters
                                ? 'No projects match the selected search or filters.'
                                : 'Create your first project to get started.'}
                        </p>

                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 text-sm font-medium text-gray-700 underline"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link
                                href="/projects/create"
                                className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Create your first project
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white sm:min-h-[560px]">
                    <div className="flex-1 overflow-x-auto">
                        <table className="min-w-[900px] table-fixed text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="w-[15%] px-4 py-3 font-medium">
                                        Client
                                    </th>

                                    <th className="w-[25%] px-4 py-3 font-medium">
                                        Project
                                    </th>

                                    <th className="w-[12%] px-4 py-3 font-medium">
                                        Status
                                    </th>

                                    <th className="w-[10%] px-4 py-3 font-medium">
                                        Priority
                                    </th>

                                    <th className="w-[13%] px-4 py-3 font-medium">
                                        Start Date
                                    </th>

                                    <th className="w-[13%] px-4 py-3 font-medium">
                                        <button
                                            type="button"
                                            onClick={toggleDueDateSort}
                                            className="flex items-center gap-1 hover:text-gray-900"
                                        >
                                            Due Date
                                            <span>
                                                {sort === 'due_asc' ? '↑' : '↓'}
                                            </span>
                                        </button>
                                    </th>

                                    <th className="w-[12%] px-4 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        <td
                                            className="truncate px-4 py-3 font-medium text-gray-900"
                                            title={project.clientName}
                                        >
                                            {project.clientName}
                                        </td>

                                        <td
                                            className="truncate px-4 py-3 text-gray-700"
                                            title={project.projectName}
                                        >
                                            {project.projectName}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="inline-flex max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {project.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {project.priority}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                            {project.startDate}
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                            {project.dueDate}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                <Link
                                                    href={`/projects/${project.id}/edit`}
                                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        deletingId ===
                                                        project.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(project.id)
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingId === project.id
                                                        ? 'Deleting...'
                                                        : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            {pagination.total}{' '}
                            {pagination.total === 1 ? 'project' : 'projects'}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                disabled={pagination.currentPage === 1}
                                onClick={() =>
                                    setPage((currentPage) => currentPage - 1)
                                }
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-gray-600">
                                Page {pagination.currentPage} of{' '}
                                {pagination.lastPage}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    pagination.currentPage ===
                                    pagination.lastPage
                                }
                                onClick={() =>
                                    setPage((currentPage) => currentPage + 1)
                                }
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
