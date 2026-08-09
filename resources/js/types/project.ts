export type ProjectStatus =
    'Planning' | 'In Progress' | 'On Hold' | 'Completed';

export type ProjectPriority = 'Low' | 'Medium' | 'High';

export interface Project {
    id: number;
    clientName: string;
    projectName: string;
    description: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    dueDate: string;
}

export interface ProjectFormData {
    clientName: string;
    projectName: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    dueDate: string;
}

export type ProjectValidationErrors = Partial<
    Record<keyof ProjectFormData, string[]>
>;
