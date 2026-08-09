import { FormEvent, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

import ProjectForm from '@/components/ProjectForm';
import { getProject, updateProject } from '@/services/projectService';
import type { ProjectFormData, ProjectValidationErrors } from '@/types/project';

interface EditProjectProps {
    projectId: number;
}

const initialForm: ProjectFormData = {
    clientName: '',
    projectName: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
};

export default function EditProject({ projectId }: EditProjectProps) {
    const [form, setForm] = useState<ProjectFormData>(initialForm);

    const [validationErrors, setValidationErrors] =
        useState<ProjectValidationErrors>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProject() {
            try {
                const project = await getProject(projectId);

                setForm({
                    clientName: project.clientName,
                    projectName: project.projectName,
                    description: project.description ?? '',
                    status: project.status,
                    priority: project.priority,
                    startDate: project.startDate,
                    dueDate: project.dueDate,
                });
            } catch (error) {
                setError('Failed to load project.');
            } finally {
                setIsLoading(false);
            }
        }

        loadProject();
    }, [projectId]);

    function handleChange(
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setIsSubmitting(true);
        setError('');
        setValidationErrors({});

        try {
            await updateProject(projectId, form);

            window.location.href = '/projects';
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'errors' in error
            ) {
                const validationError = error as {
                    errors: ProjectValidationErrors;
                };

                setValidationErrors(validationError.errors);
            } else {
                setError('Failed to update project.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">Loading project...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-8">
            <div className="mb-6">
                <Link
                    href="/projects"
                    className="mb-3 inline-block text-sm text-gray-500 hover:text-gray-900"
                >
                    ← Back to projects
                </Link>

                <h1 className="text-2xl font-semibold text-gray-900">
                    Edit Project
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update the project details, status, priority, and timeline.
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <ProjectForm
                    form={form}
                    errors={validationErrors}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel="Update Project"
                />
            </div>
        </div>
    );
}
