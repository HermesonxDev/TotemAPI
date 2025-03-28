<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use MongoDB\BSON\ObjectId;

class DashboardController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();

        $companies = Company::whereIn('_id', $user->companies ?? [])->get();

        return Inertia::render('Dashboard', [
            'companies' => $companies
        ]);
    }
}
