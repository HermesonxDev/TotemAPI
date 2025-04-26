<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\CentralLogics\Helpers;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use App\Models\Apikey;
use App\Models\Branch;
use Inertia\Inertia;

class IntegrationsController extends Controller {
    
    public function index(Request $request, string $company, string $branch) {
        $user = $request->user();

        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $companyID = new ObjectId($company);

        if (Helpers::hasAnyRole($user->roles, ['admin', 'consultant'])) {
            $apiKeys = Apikey::where('company', $companyID)->get();
        } else {
            $apiKeys = Apikey::whereIn('branches', $user->branches)->get();
        }

        return Inertia::render('Integrations', [
            'branch' => $branchData,
            'company' => $companyData,
            'apiKeys' => $apiKeys
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    private function getBranchData(string $branch) {
        return Branch::findOrFail($branch);
    }

    private function getCompanyData(string $company) {
        return Company::findOrFail($company);
    }
}
