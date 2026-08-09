import { useEffect, useState } from 'react';

import {
    getDashboardStats,
    type DashboardStats,
} from '@/services/dashboardService';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Failed to load dashboard.');
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-sm text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-6">
                <p className="text-sm text-red-600">
                    {error || 'Failed to load dashboard.'}
                </p>
            </div>
        );
    }

    const inProgressPercentage =
        stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

    const completedPercentage =
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Overview of your client projects.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Total Projects" value={stats.total} />

                <StatCard label="In Progress" value={stats.inProgress} />

                <StatCard label="Completed" value={stats.completed} />
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Project Status Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Current distribution of project progress.
                    </p>
                </div>

                <div className="space-y-6">
                    <StatusBar
                        label="In Progress"
                        value={stats.inProgress}
                        total={stats.total}
                        percentage={inProgressPercentage}
                    />

                    <StatusBar
                        label="Completed"
                        value={stats.completed}
                        total={stats.total}
                        percentage={completedPercentage}
                    />
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: number;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">{label}</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}

interface StatusBarProps {
    label: string;
    value: number;
    total: number;
    percentage: number;
}

function StatusBar({ label, value, total, percentage }: StatusBarProps) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>

                <span className="text-sm text-gray-500">
                    {value} of {total}
                </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-gray-900 transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <p className="mt-1 text-right text-xs text-gray-500">
                {percentage.toFixed(0)}%
            </p>
        </div>
    );
}
