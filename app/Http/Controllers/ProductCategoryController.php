<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Productcategory;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class ProductCategoryController extends Controller {

    public function create(Request $request) {

        $validator = Validator::make($request->all(), [
            'active'               => 'required',
            'name'                 => 'required|string',
            'slug'                 => 'required|string',
            'branch'               => 'required|string',
            'company'              => 'required|string',
            'description'          => 'nullable|string',
            'staticImage'          => 'nullable|array',
            'staticImage.*'        => 'file|mimes:jpeg,png,jpg',
            'staticImageTotem'     => 'nullable|array',
            'staticImageTotem.*'   => 'file|mimes:jpeg,png,jpg',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $maxSeq = Productcategory::max('seq') ?? 0;

            $category = new Productcategory();

            $category->seq = $maxSeq + 1;
            $category->name = $request->name;
            $category->description = $request->description;
            $category->branch = new ObjectId($request->branch);
            $category->slug = $request->slug;
            $category->categoryGroup = "";

            $staticImage = json_decode(json_encode($category->staticImage), true);

            if ($request->hasFile('staticImage')) {
                $newImages = [];

                foreach ($request->file('staticImage') as $image) {
                    $path = Storage::disk('s3')->put("staticImage/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $staticImage = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            $category->staticImage = $staticImage;

            $staticImageTotem = json_decode(json_encode($category->staticImageTotem), true);

            if ($request->hasFile('staticImageTotem')) {
                $newImages = [];

                foreach ($request->file('staticImageTotem') as $image) {
                    $path = Storage::disk('s3')->put("staticImageTotem/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $staticImageTotem = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            $category->staticImageTotem = $staticImageTotem;
            $category->company = new ObjectId($request->company);
            $category->integrationReference = [];
            $category->ingredients = false;
            $category->products = [];
            $category->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $category->disabled = false;
            $category->locationTypes = [
                1,
                2,
                4,
                8
            ];
            $category->__v = 0;
            $category->deleted = false;
            $category->klaviPaymentRequired = false;
            $category->original_cloned_id = "";

            $category->save();

            return response()->json($category, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function product_categories(Request $request) {

        try {
            $branch = $request->query('branch');
            $disabled = filter_var($request->query('disabled', null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $limit = $request->query('$limit', null);
            $locationTypes = $request->query('locationTypes');

            $locationTypesIn = [];
            if (isset($locationTypes['$in']) && is_array($locationTypes['$in'])) {
                $locationTypesIn = array_map('intval', $locationTypes['$in']);
            }

            $query = Productcategory::query();

            if ($branch) {
                try {
                    $branchId = new ObjectId($branch);
                    $query->where('branch', $branchId);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Branch ID inválido'], 400);
                }
            }

            if (!is_null($disabled)) {
                $query->where('disabled', $disabled);
            }

            if (!empty($locationTypesIn)) {
                $query->whereIn('locationTypes', $locationTypesIn);
            }

            if ($limit === "false") {
                $limitValue = null;
            } elseif (is_null($limit)) {
                $limitValue = 10;
            } elseif (is_numeric($limit)) {
                $limitValue = (int) $limit;
            } else {
                $limitValue = null;
            }

            if (!is_null($limitValue)) {
                $query->limit($limitValue);
            }

            $productCategories = $query->get()->map(function ($productCategory) {
                return [
                    '_id' => (string) $productCategory->_id,
                    'seq' => $productCategory->seq,
                    'updatedAt' => $productCategory->updatedAt,
                    'createdAt' => $productCategory->createdAt,
                    'name' => $productCategory->name,
                    'description' => $productCategory->description,
                    'branch' => (string) $productCategory->branch,
                    'slug' => $productCategory->slug,
                    'categoryGroup' => $productCategory->categoryGroup,
                    'staticImage' => $productCategory->staticImage,
                    'staticImageTotem' => $productCategory->staticImageTotem,
                    'company' => (string) $productCategory->company,
                    '__v' => $productCategory->__v,
                    'original_cloned_id' => (string) $productCategory->original_cloned_id,
                    'integrationReference' => $productCategory->integrationReference,
                    'ingredients' => $productCategory->ingredients,
                    'products' => array_map(fn($product) => (string) $product, $productCategory->products),
                    'disabled' => $productCategory->disabled,
                    'locationTypes' => $productCategory->locationTypes
                ];
            });

            return response()->json([
                'total' => count($productCategories),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $productCategories
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Categorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {

        $validator = Validator::make($request->all(), [
            'id'                         => 'required|string',
            'active'                     => 'required',
            'name'                       => 'required|string',
            'description'                => 'nullable|string',
            'slug'                       => 'required|string',
            'staticImage'                => 'nullable|array',
            'staticImage.*'              => 'file|mimes:jpeg,png,jpg',
            'staticImageTotem'           => 'nullable|array',
            'staticImageTotem.*'         => 'file|mimes:jpeg,png,jpg',
            'existingStaticImages'       => 'nullable|string',
            'existingStaticImagesTotem'  => 'nullable|string',
            'branch'                     => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $categoryID = new ObjectId($request->id);
            $category = Productcategory::where('_id', $categoryID)->first();

            if (!$category) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            $category->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $category->name = $request->name;
            $category->description = $request->description;
            $category->slug = $request->slug;

            $existingStaticImages = json_decode($request->existingStaticImages, true) ?? [];

            if ($request->hasFile('staticImage')) {
                foreach ($request->file('staticImage') as $image) {
                    $path = Storage::disk('s3')->put((String) $request->branch, $image);
                    $existingStaticImages[] =  env('AWS_URL') . "/" . $path;
                }

                $category->staticImage = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $existingStaticImages);
            }

            $existingStaticImagesTotem = json_decode($request->existingStaticImagesTotem, true) ?? [];

            if ($request->hasFile('staticImageTotem')) {
                foreach ($request->file('staticImageTotem') as $image) {
                    $path = Storage::disk('s3')->put((String) $request->branch, $image);
                    $existingStaticImagesTotem[] =  env('AWS_URL') . "/" . $path;
                }

                $category->staticImageTotem = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $existingStaticImagesTotem);
            }

            $category->save();

            return response()->json([
                'message' => 'Produto Atualizado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Editar Categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function status(Request $request) {

        $validator = Validator::make($request->all(), [
            'id'       => 'required|string',
            'status'   => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $categoryID = new ObjectId($request->id);

            $category = Productcategory::where('_id', $categoryID)->first();

            if (!$category) {
                return response()->json(['error' => 'Categoria não encontrada!'], 404);
            }

            $category->active = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);

            $category->save();

            return response()->json($category, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Editar Categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sort(Request $request) {

        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'categories.*._id' => 'required|string|exists:productcategories,_id',
            'categories.*.seq' => 'required|integer|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            foreach ($request->categories as $category) {
                Productcategory::where('_id', $category['_id'])
                    ->update(['seq' => $category['seq']]);
            }
    
            return response()->json([
                'message' => 'Categorias atualizados com sucesso!',
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar Categorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request) {

        $validator = Validator::make($request->all(), [
            'id' => 'required|string'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $categoryID = new ObjectId($request->id);
            $category = Productcategory::where('_id', $categoryID)->first();

            if (!$category) {
                return response()->json(['error' => 'Categoria não encontrada!'], 404);
            }

            $category->deleted = true;

            $category->save();

            return response()->json([
                'message' => 'Categoria Deletada com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Deletar Categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
