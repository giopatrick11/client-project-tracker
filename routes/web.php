<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/projects', function () {
        return Inertia::render('projects/index');
    })->name('projects.index');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/projects', function () {
        return Inertia::render('projects/index');
    })->name('projects.index');

    Route::get('/projects/create', function () {
        return Inertia::render('projects/create');
    })->name('projects.create');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/projects', function () {
        return Inertia::render('projects/index');
    })->name('projects.index');

    Route::get('/projects/create', function () {
        return Inertia::render('projects/create');
    })->name('projects.create');

    Route::get('/projects/{project}/edit', function (\App\Models\Project $project) {
        return Inertia::render('projects/edit', [
            'projectId' => $project->id,
        ]);
    })->name('projects.edit');
});

require __DIR__ . '/settings.php';
