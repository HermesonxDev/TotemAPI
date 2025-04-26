<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\CentralLogics\Helpers;
use Illuminate\Http\Request;
use App\Models\Totemresume;
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

        $user = $request->user();

        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $companyID = new ObjectId($company);

        $resume = Totemresume::where('company', $companyID)
                              ->where('deleted', '!=', true)
                              ->orderBy('createdAt', 'desc')
                              ->first();

        if (Helpers::hasAnyRole($user->roles, ['admin', 'consultant'])) {
            $totemUsers = Totemuser::where('company', $companyID)
                                   ->where('deleted', '<>', true)
                                   ->get();
        } else {            
            $totemUsers = Totemuser::whereIn('branch', $user->branches ?? [])
                                   ->where('deleted', '<>', true)
                                   ->get();
        }

        $efficiencyByBranch = collect($resume['efficiency'] ?? [])
            ->map(fn($i) => (array) $i)
            ->groupBy(function ($item) {
                return (string) $item['branch'];
            })
            ->map(function ($group, $branchId) use ($totemUsers) {
                $first = (array) $group->first();

                $branchName = $first['name'] ?? '';
                $branchObjectId = $first['branch'];

                $totems = $group->map(function ($effItem) use ($totemUsers) {
                    $matchedUser = $totemUsers->first(function ($user) use ($effItem) {
                        return (string) $user->_id === (string) $effItem['totem'];
                    });

                    return [
                        'name' => $matchedUser->name ?? '',
                        'active' => $matchedUser->active ?? null,
                        'email' => $matchedUser->email ?? null,
                        'totem' => (string) $effItem['totem'] ?? '',
                        'efficiency' => isset($effItem['efficiency']) 
                            ? (float) str_replace('%', '', $effItem['efficiency']) 
                            : null,
                    ];
                });

                return [
                    'name' => $branchName,
                    'branch' => (string) $branchObjectId,
                    'totems' => $totems,
                ];
            })->values();

        return Inertia::render('OperationalStatus', [
            'branch' => $branchData,
            'company' => $companyData,
            'activatedLink' => "totem",
            'branches' => [],
            'products' => [],
            'totemEfficiency' => $efficiencyByBranch
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
