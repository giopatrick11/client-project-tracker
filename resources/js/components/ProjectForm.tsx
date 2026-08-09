import type { FormEvent } from 'react';
import type { ProjectFormData, ProjectValidationErrors } from '@/types/project';

interface ProjectFormProps {
    form: ProjectFormData;
    errors: ProjectValidationErrors;
    onChange: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ) => void;
    onSubmit: (event: FormEvent) => void;
    isSubmitting: boolean;
    submitLabel: string;
}

export default function ProjectForm({
    form,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
    submitLabel,
}: ProjectFormProps) {
    const inputClasses =
        'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500';

    const errorClasses = 'mt-1 text-sm text-red-600';

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Client Name
                </label>

                <input
                    name="clientName"
                    value={form.clientName}
                    onChange={onChange}
                    className={inputClasses}
                />

                {errors.clientName && (
                    <p className={errorClasses}>{errors.clientName[0]}</p>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">
                    Project Name
                </label>

                <input
                    name="projectName"
                    value={form.projectName}
                    onChange={onChange}
                    className={inputClasses}
                />

                {errors.projectName && (
                    <p className={errorClasses}>{errors.projectName[0]}</p>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={4}
                    className={inputClasses}
                />

                {errors.description && (
                    <p className={errorClasses}>{errors.description[0]}</p>
                )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={onChange}
                        className={inputClasses}
                    >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>

                    {errors.status && (
                        <p className={errorClasses}>{errors.status[0]}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={onChange}
                        className={inputClasses}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    {errors.priority && (
                        <p className={errorClasses}>{errors.priority[0]}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={onChange}
                        className={inputClasses}
                    />

                    {errors.startDate && (
                        <p className={errorClasses}>{errors.startDate[0]}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={onChange}
                        className={inputClasses}
                    />

                    {errors.dueDate && (
                        <p className={errorClasses}>{errors.dueDate[0]}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
