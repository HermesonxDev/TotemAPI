<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Totemcharge;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use App\Models\Branch;
use Inertia\Inertia;

class MenuCloningController extends Controller {
    
    public function index(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);
        
        $companyID = new ObjectId($company);
    
        $branches = Branch::where('company', $companyID)
                          ->where('deleted', '<>', true)
                          ->get();
    
        $totemCharges = Totemcharge::where('company', $companyID)
                                   ->where('deleted', '<>', true)
                                   ->orderBy('createdAt', 'desc')
                                   ->get();
    
        $options = $branches->map(function ($branch) {
            return [
                'value' => (string) $branch->_id,
                'label' => $branch->name
            ];
        })->values();
    
        $branchNames = $branches->mapWithKeys(function ($branch) {
            return [(string) $branch->_id => $branch->name];
        });
    
        $history = $totemCharges->map(function ($charge) use ($branchNames) {
            return [
                'id' => (string) $charge->_id,
                'to' => $branchNames[(string) $charge->to] ?? 'Desconhecido',
                'from' => $branchNames[(string) $charge->from] ?? 'Desconhecido',
                'status' => $charge->status,
                'createdAt' => $charge->createdAt,
                'time' => $charge->time,
                'details' => $charge->details,
            ];
        });
    
        return Inertia::render('MenuCloning', [
            'branch' => $branchData,
            'company' => $companyData,
            'totemChargesHistory' => $history,
            'options' => $options
        ]);
    }    

    private function getBranchData(string $branch) {
        return Branch::findOrFail($branch);
    }

    private function getCompanyData(string $company) {
        return Company::findOrFail($company);
    }
}
