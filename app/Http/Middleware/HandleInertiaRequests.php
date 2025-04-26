<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => [
                    'id' => $request->user()?->id,
                    'name' => $request->user()?->name,
                    'email' => $request->user()?->email,
                    'createdAt' => $request->user()?->createdAt,
                    'updatedAt' => $request->user()?->updatedAt,
                    'branches' => $request->user()?->branches
                        ? array_map(fn($branch) => (string) $branch, $request->user()->branches)
                        : [],
                    'companies' => $request->user()?->companies
                        ? array_map(fn($company) => (string) $company, $request->user()->companies)
                        : [],
                    'roles' => $request->user()?->roles ?? []
                ],
            ],
            'csrf_token' => csrf_token(),
        ];
    }
}
