import { FormEvent, useState } from 'react';
import { Link } from '@inertiajs/react';

import ProjectForm from '@/components/ProjectForm';
import { createProject } from '@/services/projectService';
import type { ProjectFormData, ProjectValidationErrors } from '@/types/project';

const initialForm: ProjectFormData = {
    clientName: '',
    projectName: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
};

export default function CreateProject() {
    const [form, setForm] = useState<ProjectFormData>(initialForm);

    const [validationErrors, setValidationErrors] =
        useState<ProjectValidationErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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
            await createProject(form);

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
                setError('Failed to create project.');
            }
        } finally {
            setIsSubmitting(false);
        }
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
                    Create Project
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Add a new client project to the tracker.
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
                    submitLabel="Create Project"
                />
            </div>
        </div>
    );
}
