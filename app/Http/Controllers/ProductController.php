<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Product;
use App\Models\Complementsgroup;
use Carbon\Carbon;

class ProductController extends Controller {

    public function create(Request $request) {

        $validator = Validator::make($request->all(), [
            'active'          => 'required',
            'name'            => 'required|string',
            'description'     => 'required|string',
            'slug'            => 'nullable|string',
            'price'           => 'required|numeric',
            'preparationTime' => 'required|numeric',
            'code'            => 'required|string',
            'barCode'         => 'nullable|string',
            'images'          => 'nullable|array',
            'images.*'        => 'file|mimes:jpeg,png,jpg',
            'existingImages'  => 'nullable|string',
            'period'          => 'nullable|string',
            'complement'      => 'nullable|string',
            'complements'     => 'nullable|array',
            'branch'          => 'required|string',
            'company'         => 'required|string',
            'category'        => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {

            $maxSeq = Product::max('seq') ?? 0;

            $product = new Product();

            $product->seq = $maxSeq + 1;
            $product->name = $request->name;
            $product->company = new ObjectId($request->company);
            $product->branch = new ObjectId($request->branch);
            $product->category = new ObjectId($request->category);
            $product->description = $request->description;
            $product->code = $request->code;
            $product->barCode = $request->barCode ?? "";
            $product->relatedPeriod = [];
            $product->slug = $request->slug;
            $product->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $product->credit = [
                "creditValue" => 0,
                "isCredit" => false
            ];
            $product->period = [
                "sunday" => [],
                "saturday" => [],
                "friday" => [],
                "thursday" => [],
                "wednesday" => [],
                "tuesday" => [],
                "monday" => [],
            ];
            
            if ($request->has('complements')) {
                $product->complementsGroups = array_map(fn($complement) => $complement['_id'], $request->complements);
            }

            $existingImages = json_decode($request->existingImages, true) ?? [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = Storage::disk('s3')->put($request->branch, $image);
                    $existingImages[] =  env('AWS_URL') . "/" . $path;
                }

                $product->sliderHeader = [
                    'slideImageEnabled' => true,
                    'image' => array_map(fn($url) => [
                        'photo' => $url,
                        'preferredType' => "photo",
                        '_id' => (string) new ObjectId(),
                        'active' => true,
                    ], $existingImages)
                ];

                $product->staticImage = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $existingImages);
            }

            $product->locationTypes = [
                1,
                2,
                4,
                8
            ];
            $product->preparationTime = (float) $request->preparationTime;
            $product->stock = [
                "lastStockReposition" => 0,
                "dateLastReposition" => Carbon::now('America/Fortaleza')->format('Y-m-d\TH:i:s.u') . "Z",
                "minimalQuantity" => 0,
                "currentQuantity" => 0,
                "originalQuantity" => 0,
                "active" => true,
                "totemSoldOut" => false
            ];
            $product->costPrice = (float) $request->price;
            $product->indoorPrices = [];
            $product->price = (float) $request->price;
            $product->__v = 0;
            $product->flags = [];
            $product->deleted = false;

            $product->save();

            if ($request->has('complement')) {
                $this->add_complement($request->complement, $product->_id);
            }

            return response()->json([
                'message' => 'Produto Criado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function products(Request $request) {

        try {
            $branch = $request->query('branch');
            $active = filter_var($request->query('active', null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $limit = $request->query('$limit', null);

            $query = Product::query();

            if ($branch) {
                try {
                    $branchId = new ObjectId($branch);
                    $query->where('branch', $branchId);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Branch ID inválido'], 400);
                }
            }

            if (!is_null($active)) {
                $query->where('active', $active);
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

            $products = $query->get()->map(function ($product) {
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
                        'video' => $product->sliderHeader['video']
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

            return response()->json([
                'total' => count($products),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $products
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Produtos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {
        Log::info('request', [$request->all()]);

        $validator = Validator::make($request->all(), [
            'id'              => 'required|string',
            'active'          => 'required',
            'name'            => 'required|string',
            'description'     => 'nullable|string',
            'slug'            => 'nullable|string',
            'price'           => 'required|numeric',
            'preparationTime' => 'required|numeric',
            'code'            => 'required|string',
            'barCode'         => 'nullable|string',
            'images'          => 'nullable|array',
            'images.*'        => 'file|mimes:jpeg,png,jpg',
            'existingImages'  => 'nullable|string',
            'period'          => 'nullable|string',
            'complements'     => 'nullable|array',
            'branch'          => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $productID = new ObjectId($request->id);
            $product = Product::where('_id', $productID)->first();

            if (!$product) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            $product->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $product->name = $request->name;
            $product->description = $request->description;
            $product->slug = $request->slug;
            $product->price = (float) $request->price;
            $product->preparationTime = (float) $request->preparationTime;
            $product->code = $request->code;
            $product->barCode = $request->barCode ?? "";

            if ($request->has('complements')) {
                $product->complementsGroups = array_map(fn($complement) => $complement['_id'], $request->complements);
            }

            $existingImages = json_decode($request->existingImages, true) ?? [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    try {
                        $path = Storage::disk('s3')->put($request->branch, $image);
                        $existingImages[] =  env('AWS_URL') . "/" . $path;
                    } catch (\Exception $e) {
                        Log::error("Erro ao salvar imagem em $image: " . $e->getMessage());
                    }
                }

                $product->sliderHeader = [
                    'slideImageEnabled' => true,
                    'image' => array_map(fn($url) => [
                        'photo' => $url,
                        'preferredType' => "photo",
                        '_id' => (string) new ObjectId(),
                        'active' => true,
                    ], $existingImages)
                ];
            }

            $product->save();

            return response()->json([
                'message' => 'Produto Atualizado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sold_out(Request $request) {

        $validator = Validator::make($request->all(), [
            'id'        => 'required|string',
            'status'   => 'required' 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $productID = new ObjectId($request->id);

            $product = Product::where('_id', $productID)->first();

            if(!$product) {
                return response()->json(['error' => 'Produto não encontrado!'], 404);
            }

            $stock = $product->stock ?? [];
            $stock['totemSoldOut'] = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);
            $product->stock = $stock;

            $product->save();

            return response()->json(['message' => 'Status de esgotado atualizado com sucesso!']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Marcar Produto como Esgotado!',
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
            $productID = new ObjectId($request->id);

            $product = Product::where('_id', $productID)->first();

            if (!$product) {
                return response()->json(['error' => 'Produto não encontrado!'], 404);
            }

            $product->active = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);

            $product->save();

            return response()->json($product, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function active_by_name(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string',
            'branch'   => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $branchID = new ObjectId($request->branch);

            $product = Product::where('name', $request->name)
                ->where('branch', $branchID)
                ->first();

            if (!$product) {
                return response()->json(['error' => 'Produto não encontrado!'], 404);
            }

            $product->active = true;

            $product->save();

            return response()->json($product, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sort(Request $request) {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array',
            'products.*.seq' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            foreach ($request->products as $productData) {
                $productId = $productData['_id'] ?? $productData['id'] ?? null;

                if (!$productId) {
                    continue;
                }

                Product::where('_id', $productId)
                    ->update(['seq' => $productData['seq']]);
            }

            return response()->json([
                'message' => 'Produtos atualizados com sucesso!',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar os produtos',
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
            $productID = new ObjectId($request->id);
            $product = Product::where('_id', $productID)->first();

            if (!$product) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            $product->deleted = true;

            $product->save();

            return response()->json([
                'message' => 'Produto Deletado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Deletar Produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function add_complement(string $complementID, string $productID) {
        $complementGroupID = new ObjectId($complementID);
        $productObjectID = new ObjectId($productID);
    
        Complementsgroup::where('_id', $complementGroupID)->push('items', $productObjectID);
    }    
}
