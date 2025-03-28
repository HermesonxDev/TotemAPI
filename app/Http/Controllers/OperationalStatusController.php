<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Totemuser;
use App\Models\Company;
use App\Models\Product;
use App\Models\Branch;
use Inertia\Inertia;

class OperationalStatusController extends Controller
{
    public function index(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);
        $branchesData = $this->getBranchesByCompany($company);
        
        return Inertia::render('OperationalStatus', [
            'branch' => $branchData,
            'company' => $companyData,
            'activatedLink' => "stores",
            'branches' => $branchesData,
            'products' => [],
            'totems' => []
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function menu(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $companyID = new ObjectId($company);

        $products = Product::where('company', $companyID)
            ->where('deleted', '<>', true)
            ->limit(5000)
            ->get();

        return Inertia::render('OperationalStatus', [
            'branch' => $branchData,
            'company' => $companyData,
            'activatedLink' => "menu",
            'branches' => [],
            'products' => $products,
            'totems' => []
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function totem(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $companyID = new ObjectId($company);

        $totemUsers = Totemuser::where('company', $companyID)
            ->where('deleted', '<>', true)
            ->get();

        return Inertia::render('OperationalStatus', [
            'branch' => $branchData,
            'company' => $companyData,
            'activatedLink' => "totem",
            'branches' => [],
            'products' => [],
            'totems' => $totemUsers
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    private function getBranchData(string $branch) {
        return Branch::findOrFail($branch);
    }

    private function getCompanyData(string $company) {
        return Company::findOrFail($company);
    }

    private function getBranchesByCompany(string $company) {
        $companyID = new ObjectId($company);

        return Branch::where('company', $companyID)->where('deleted', '<>', true)->get();
    }
}
