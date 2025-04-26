<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Complementsgroup;
use App\Models\Productcategory;
use App\CentralLogics\Helpers;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use App\Models\Product;
use App\Models\Branch;
use App\Models\Order;
use Inertia\Inertia;
use Carbon\Carbon;

class ItemsController extends Controller {

    public function index(Request $request, string $company, string $branch) {
        $branch = $this->getBranchData($branch);
        $company = $this->getCompanyData($company);

        return Inertia::render('Items', [
            'branch' => $branch,
            'company' => $company,
            'categories' => [],
            'complements' => [],
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function listBranches(Request $request, string $company) {
        $user = $request->user();

        $company = $this->getCompanyData($company);

        if (Helpers::hasAnyRole($user->roles, ['admin', 'consultant'])) {
            $branches = Branch::where('company', new ObjectId($company->id))
                              ->get();
        } else {
            $branches = Branch::whereIn('_id', $user->branches ?? [])
                              ->get();
        }

        return Inertia::render('BranchSelect', [
            'company' => $company,
            'branches' => $branches,
            'categories' => [],
            'complements' => [],
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function categories(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $categories = $this->getCategoriesData($branch)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => $categories,
            'complements' => [],
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }


    public function complements(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $complements = $this->getComplementsData($branch)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => [],
            'complements' => $complements,
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }


    public function category_products(Request $request, string $company, string $branch, string $categoryID){
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $categories = $this->getCategoriesData($branch)
            ->sortBy('seq')
            ->values();

        $categoriesComplements = $this->getComplementsData($branch);

        $categoriesProducts = $this->getCategoriesProductData($categoryID)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => $categories,
            'complements' => [],
            'orders' => [],
            'categoryID' => $categoryID,
            'categoriesProducts' => $categoriesProducts,
            'sortCategoryProducts' => [],
            'categoriesComplements' => $categoriesComplements,
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }


    public function sort_category_products(Request $request, string $company, string $branch, string $categoryID){
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $categories = $this->getCategoriesData($branch)
            ->sortBy('seq')
            ->values();
    
        $sortCategoryProducts = $this->getCategoriesProductData($categoryID)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => $categories,
            'complements' => [],
            'orders' => [],
            'categoryID' => $categoryID,
            'categoriesProducts' => [],
            'sortCategoryProducts' => $sortCategoryProducts,
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }    


    public function sort_complement_products(Request $request, string $company, string $branch, string $complementID){
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $complements = $this->getComplementsData($branch)
            ->sortBy('seq')
            ->values();

        $sortComplementsProducts = $this->getComplementsProductData($complementID, $branch)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => [],
            'complements' => $complements,
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => $complementID,
            'complementsProducts' => [],
            'sortComplementsProducts' => $sortComplementsProducts
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }  


    public function complement_products(Request $request, string $company, string $branch, string $complementID){
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $complements = $this->getComplementsData($branch)
            ->sortBy('seq')
            ->values();
            
        $complementsProducts = $this->getComplementsProductData($complementID, $branch)
            ->sortBy('seq')
            ->values();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => [],
            'complements' => $complements,
            'orders' => [],
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => $complementID,
            'complementsProducts' => $complementsProducts,
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }


    public function order_panel(Request $request, string $company, string $branch) {
        $branchData = $this->getBranchData($branch);
        $companyData = $this->getCompanyData($company);

        $branchId = new ObjectId($branch);

        $startOfDay = Carbon::today()->utc();
        $endOfDay = Carbon::today()->utc()->endOfDay();

        $orders = Order::where('branch', $branchId)
            ->whereBetween('createdAt', [$startOfDay, $endOfDay])
            ->get();

        return Inertia::render('Items', [
            'branch' => $branchData,
            'company' => $companyData,
            'categories' => [],
            'complements' => [],
            'orders' => $orders,
            'categoryID' => '',
            'categoriesProducts' => [],
            'sortCategoryProducts' => [],
            'categoriesComplements' => [],
            'complementID' => '',
            'complementsProducts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    private function getBranchData(string $branch) {
        return Branch::findOrFail($branch);
    }

    private function getCompanyData(string $company) {
        return Company::findOrFail($company);
    }

    private function getCategoriesData(string $branch) {
        $branchId = new ObjectId($branch);
        $categoriesData = Productcategory::where('branch', $branchId)
            ->where('deleted', '<>', true)
            ->get();

        return $categoriesData->map(function ($category) {
            return [
                '_id' => (string) $category->_id,
                'seq' => $category->seq,
                'updatedAt' => $category->updatedAt,
                'createdAt' => $category->createdAt,
                'name' => $category->name,
                'description' => $category->description,
                'branch' => (string) $category->branch,
                'slug' => $category->slug,
                'categoryGroup' => $category->categoryGroup,
                'staticImage' => $category->staticImage,
                'staticImageTotem' => $category->staticImageTotem,
                'company' => (string) $category->company,
                '__v' => $category->__v,
                'original_cloned_id' => (string) $category->original_cloned_id,
                'integrationReference' => $category->integrationReference,
                'ingredients' => $category->ingredients,
                'products' => array_map(fn($product) => (string) $product, $category->products),
                'disabled' => $category->disabled,
                'active' =>  filter_var($category->active, FILTER_VALIDATE_BOOLEAN),
                'locationTypes' => $category->locationTypes
            ];
        });
    }


    private function getComplementsData(string $branch) {
        $branchId = new ObjectId($branch);

        $complementsData = Complementsgroup::where('branch', $branchId)->where('deleted', '<>', true)->get();

        return $complementsData->map(function ($complement) {
            return [
                '_id' => (string) $complement->_id,
                'seq' => $complement->seq,
                'updatedAt' => $complement->updatedAt,
                'createdAt' => $complement->createdAt,
                'title' => $complement->title,
                'description' => $complement->description,
                'branch' => (string) $complement->branch,
                'company' => (string) $complement->company,
                'code' => $complement->code,
                '__v' => $complement->__v,
                'original_cloned_id' => (string) $complement->original_cloned_id,
                'active' =>  filter_var($complement->active, FILTER_VALIDATE_BOOLEAN),
                'settingsTotem' => $complement->settingsTotem,
                'ingredients' => $complement->ingredients,
                'rules' => $complement->rules,
                'locationTypes' => $complement->locationTypes,
                'items' => array_map(fn($product) => (string) $product, $complement->items)
            ];
        });
    }


    private function getCategoriesProductData(string $categoryID) {
        $categoryId = new ObjectId($categoryID);

        $products = Product::where('category', $categoryId)->where('deleted', '<>', true)->get();

        return $products->map(function ($product) {
            return [
                '_id' => (string) $product->_id,
                'seq' => $product->seq,
                'updatedAt' => $product->updatedAt,
                'createdAt' => $product->createdAt,
                'name' => $product->name,
                'category' => (string) $product->category,
                'description' => $product->description,
                'slug' => $product->slug,
                'code' => (string) $product->code,
                'barCode' => $product->barCode,
                'relatedPeriod' => $product->relatedPeriod,
                'company' => (string) $product->company,
                'branch' => (string) $product->branch,
                '__v' => $product->__v,
                'staticImage' => $product->staticImage,
                'original_cloned_id' => (string) $product->original_cloned_id,
                'active' =>  filter_var($product->active, FILTER_VALIDATE_BOOLEAN),
                'credit' => $product->credit,
                'period' => $product->period,
                'complementsGroups' => $product->complementsGroups,
                'sliderHeader' => [
                    'slideImageEnabled' => $product->sliderHeader['slideImageEnabled'] ?? [],
                    'image' => array_map(function ($image) {
                        return [
                            'active' => $image['active'] ?? "",
                            'photo' => $image['photo'] ?? "",
                            'preferredType' => $image['preferredType'] ?? "",
                            '_id' => (string) $image['id'] ?? "",
                        ];
                    }, $product->sliderHeader['image'] ?? []),
                    //'video' => $product->sliderHeader['video']
                ],
                'settingsTotem' => $product->settingsTotem,
                'locationTypes' => $product->locationTypes,
                'preparationTime' => $product->preparationTime,
                'stock' => $product->stock,
                'costprice' => $product->costprice,
                'indoorPrices' => $product->indoorPrices,
                'price' => $product->price
            ];
        });
    }


    private function getComplementsProductData(string $complementID, string $branch) {
        $complements = $this->getComplementsData($branch);

        $filteredComplement = $complements->firstWhere('_id', $complementID);

        if (!$filteredComplement) {
            return collect();
        }

        $complementItemIds = $filteredComplement['items'] ?? [];

        try {
            $objectIds = array_map(fn($id) => new ObjectId($id), $complementItemIds);
        } catch (\Exception $e) {
            return collect();
        }

        $products = Product::whereIn('_id', $objectIds)->where('deleted', '<>', true)->get();

        return $products->map(function ($product) {
            return [
                '_id' => (string) $product->_id,
                'seq' => $product->seq,
                'updatedAt' => $product->updatedAt,
                'createdAt' => $product->createdAt,
                'name' => $product->name,
                'category' => (string) $product->category,
                'description' => $product->description,
                'slug' => $product->slug,
                'code' => (string) $product->code,
                'barCode' => $product->barCode,
                'relatedPeriod' => $product->relatedPeriod,
                'company' => (string) $product->company,
                'branch' => (string) $product->branch,
                '__v' => $product->__v,
                'staticImage' => $product->staticImage,
                'original_cloned_id' => (string) $product->original_cloned_id,
                'active' => filter_var($product->active, FILTER_VALIDATE_BOOLEAN),
                'credit' => $product->credit,
                'period' => $product->period,
                'complementsGroups' => $product->complementsGroups,
                'sliderHeader' => [
                    'slideImageEnabled' => $product->sliderHeader['slideImageEnabled'],
                    'image' => array_map(function ($image) {
                        return [
                            'active' => $image['active'],
                            'photo' => $image['photo'],
                            'preferredType' => $image['preferredType'],
                            '_id' => (string) $image['id'],
                        ];
                    }, $product->sliderHeader['image']),
                    //'video' => $product->sliderHeader['video']
                ],
                'settingsTotem' => $product->settingsTotem,
                'locationTypes' => $product->locationTypes,
                'preparationTime' => $product->preparationTime,
                'stock' => $product->stock,
                'costprice' => $product->costprice,
                'indoorPrices' => $product->indoorPrices,
                'price' => $product->price,
                'complementGroupCategory' => (string) $product->complementGroupCategory ?? ''
            ];
        });
    }

}
