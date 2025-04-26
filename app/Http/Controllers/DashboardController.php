<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();

        if (in_array("admin", $user->roles)) {
            $companies = Company::where('deleted', '<>', true)
                                ->get();
        } else {
            $companies = Company::whereIn('_id', $user->companies ?? [])
                                ->where('deleted', '<>', true)
                                ->get();
        }

        return Inertia::render('Dashboard', [
            'companies' => $companies
        ]);
    }
}
