# Client Project Tracker

## Project Overview

Client Project Tracker is a Laravel + React application for managing client projects. It tracks each project's client name, project name, status, priority, start date, and due date, with authenticated access to the project management UI and API.

## Setup Instructions

### Prerequisites

- PHP 8.3 or newer
- Composer
- Node.js and npm
- MySQL
- Git

### Clone the Repository

```bash
git clone <repository-url>
cd client-project-tracker
```

### Install PHP Dependencies

```bash
composer install
```

### Install Frontend Dependencies

```bash
npm install
```

### Create and Configure the Environment File

```bash
cp .env.example .env
```

Update `.env` for your local environment. Do not commit real secrets, passwords, or generated keys.

### Generate the Laravel Application Key

```bash
php artisan key:generate
```

### Configure MySQL

Create a local MySQL database, then update the database variables in `.env`:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=client_project_tracker
DB_USERNAME=<your-database-user>
DB_PASSWORD=<your-database-password>
```

### Run Migrations and Seed Sample Project Data

```bash
php artisan migrate
php artisan db:seed --class=ProjectSeeder
```

The default `DatabaseSeeder` creates a sample user, while `ProjectSeeder` loads the provided sample client project records.

## Technology Choices

- **Laravel**: Provides routing, controllers, Eloquent models, migrations, API resources, validation, and authentication infrastructure.
- **React**: Powers the interactive project list, forms, filters, dashboard, and responsive UI behavior.
- **TypeScript**: Adds typed project models, form payloads, validation errors, service responses, and dashboard data.
- **Inertia**: Connects Laravel routes to React pages without requiring a separate frontend router or standalone SPA backend.
- **MySQL**: Stores users, sessions, projects, jobs, cache records, and Sanctum personal access tokens.
- **Laravel Sanctum / built-in authentication**: Protects API routes through `auth:sanctum` and supports first-party cookie-based SPA authentication alongside Laravel Fortify auth screens.
- **Tailwind CSS**: Provides utility-first styling for responsive tables, forms, cards, filters, and layout components.

## How to Run the Application

The repository defines this Composer development command:

```bash
composer run dev
```

This runs the Laravel `dev` Artisan command configured by the project.

The repository also defines these frontend commands:

```bash
npm run dev
npm run build
npm run build:ssr
npm run lint
npm run lint:check
npm run format
npm run format:check
npm run types:check
```

For local development, use `composer run dev` for the application development process. Use `npm run dev` when you need to run the Vite frontend dev server directly.

## Features

- Authenticated access to dashboard and project pages
- Project list
- Create project
- Edit project
- Delete project
- Server-side validation
- Search by client or project name
- Status filtering
- Priority filtering
- Due date sorting in ascending or descending order
- Pagination with 10 projects per page
- Dashboard showing total projects, in-progress projects, and completed projects
- Responsive UI for project management screens

## API Endpoints

The API routes are protected with `auth:sanctum` unless otherwise noted.

| Method    | Endpoint                  | Description                                                                                                   |
| --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| GET       | `/api/user`               | Returns the authenticated user.                                                                               |
| GET       | `/api/dashboard`          | Returns dashboard project counts.                                                                             |
| GET       | `/api/projects`           | Returns paginated projects with optional `search`, `status`, `priority`, `sort`, and `page` query parameters. |
| POST      | `/api/projects`           | Creates a project.                                                                                            |
| GET       | `/api/projects/{project}` | Returns one project.                                                                                          |
| PUT/PATCH | `/api/projects/{project}` | Updates a project.                                                                                            |
| DELETE    | `/api/projects/{project}` | Deletes a project.                                                                                            |

## Validation Rules

`StoreProjectRequest` and `UpdateProjectRequest` use the same validation rules:

| Field         | Rules                                                                |
| ------------- | -------------------------------------------------------------------- |
| `clientName`  | `required`, `string`, `max:255`                                      |
| `projectName` | `required`, `string`, `max:255`                                      |
| `description` | `nullable`, `string`                                                 |
| `status`      | `required`, one of `Planning`, `In Progress`, `On Hold`, `Completed` |
| `priority`    | `required`, one of `Low`, `Medium`, `High`                           |
| `startDate`   | `required`, `date`                                                   |
| `dueDate`     | `required`, `date`, `after_or_equal:startDate`                       |

## Assumptions Made

- Any authenticated user can access the project API and project pages.
- Projects are not assigned to individual users.
- Status values are limited to `Planning`, `In Progress`, `On Hold`, and `Completed`.
- Priority values are limited to `Low`, `Medium`, and `High`.
- Due date cannot be earlier than start date.
- Project search matches client names and project names.
- The dashboard counts all projects in the database.

## Project Structure

- `app/Models/Project.php`: Eloquent model for project records.
- `app/Http/Controllers/ProjectController.php`: REST API controller for project CRUD, filtering, sorting, and pagination.
- `app/Http/Controllers/DashboardController.php`: API controller for dashboard counts.
- `app/Http/Requests/StoreProjectRequest.php`: Validation rules for creating projects.
- `app/Http/Requests/UpdateProjectRequest.php`: Validation rules for updating projects.
- `app/Http/Resources/ProjectResource.php`: Formats project API responses.
- `database/migrations/2026_08_08_063906_create_projects_table.php`: Creates the `projects` table.
- `database/seeders/ProjectSeeder.php`: Seeds sample client project data.
- `routes/api.php`: Defines Sanctum-protected API endpoints.
- `routes/web.php`: Defines Inertia-rendered web pages.
- `resources/js/pages/dashboard.tsx`: React dashboard page.
- `resources/js/pages/projects/`: React project list, create, and edit pages.
- `resources/js/components/ProjectForm.tsx`: Reusable project create/edit form.
- `resources/js/services/projectService.ts`: Frontend API service for project requests.
- `resources/js/services/dashboardService.ts`: Frontend API service for dashboard stats.
- `resources/js/types/project.ts`: TypeScript project and validation types.

## Technical Decisions

- **REST API separated from the React UI**: React pages call `/api/*` endpoints through service modules instead of embedding data operations in page routes.
- **Laravel Form Requests for validation**: Create and update validation live in dedicated request classes.
- **API Resources for response formatting**: `ProjectResource` converts database snake_case fields to frontend camelCase fields.
- **Reusable `ProjectForm` component**: Create and edit pages share the same form UI and validation error rendering.
- **`projectService` for frontend API communication**: Project fetch, create, update, and delete calls are centralized in one typed service.
- **Server-side filtering, sorting, and pagination**: The API applies search, status filter, priority filter, due date sorting, and pagination before returning results.
