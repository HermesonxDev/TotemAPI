<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Branch;
use Inertia\Inertia;

class OperatingPeriodController extends Controller
{
    public function index(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);
        
        return Inertia::render('OperatingPeriod', [
            'branch' => $branchData,
            'company' => $companyData
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    private function getBranchData(string $branch) {
        return Branch::findOrFail($branch);
    }

    private function getCompanyData(string $company) {
        return Company::findOrFail($company);
    }
}