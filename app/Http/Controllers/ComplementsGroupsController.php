<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Complementsgroup;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class ComplementsGroupsController extends Controller {

    public function create(Request $request) {

        $validator = Validator::make($request->all(), [
            'active'        => 'required',
            'title'         => 'required|string',
            'description'   => 'nullable|string',
            'code'          => 'nullable|string',
            'ingredients'   => 'required',
            'minimum'       => 'required|string',
            'maximum'       => 'required|string',
            'mandatory'     => 'required',
            'branch'        => 'required|string',
            'company'       => 'required|string',
            'categories'    => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        try {
            $maxSeq = Complementsgroup::max('seq') ?? 0;

            $complementGroup = new Complementsgroup();

            $complementGroup->seq = $maxSeq + 1;
            $complementGroup->title = $request->title;
            $complementGroup->description = $request->description;
            $complementGroup->branch = new ObjectId($request->branch);
            $complementGroup->company = new ObjectId($request->company);
            $complementGroup->code = $request->code;
            $complementGroup->ingredients = filter_var($request->ingredients, FILTER_VALIDATE_BOOLEAN);
            $complementGroup->rules = [
                "minQuantity" =>  (integer) $request->minimum,
                "maxQuantity" => (integer) $request->maximum,
                "mandatory" => filter_var($request->mandatory, FILTER_VALIDATE_BOOLEAN)
            ];
            $complementGroup->locatioTypes = [
                1,
                2,
                4,
                8
            ];
            $complementGroup->items = [];
            $complementGroup->__v = 0;
            $complementGroup->deleted = false;
            $complementGroup->original_cloned_id = "";
            $complementGroup->settingsTotem = [];
            $complementGroup->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $complementGroup->categories = array_map(fn($category) => new ObjectId($category), $request->categories ?? []);

            $complementGroup->save();

            return response()->json($complementGroup, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Grupo de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function complements_groups(Request $request) {

        try{
            $branch = $request->query('branch');
            $limit = $request->query('$limit', null);
            $locationTypes = $request->query('locationTypes');

            $locationTypesIn = [];
            
            if (isset($locationTypes['$in']) && is_array($locationTypes['$in'])) {
                $locationTypesIn = array_map('intval', $locationTypes['$in']);
            }

            $query = Complementsgroup::query();

            if ($branch) {
                try {
                    $branchId = new ObjectId($branch);
                    $query->where('branch', $branchId);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Branch ID inválido'], 400);
                }
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

            $productComplements = $query->get()->map(function ($productComplement) {
                return [
                    '_id' => (string) $productComplement->_id,
                    'seq' => $productComplement->seq,
                    'updatedAt' => $productComplement->updatedAt,
                    'createdAt' => $productComplement->createdAt,
                    'title' => $productComplement->title,
                    'description' => $productComplement->description,
                    'branch' => (string) $productComplement->branch,
                    'company' => (string) $productComplement->company,
                    'code' => $productComplement->code,
                    '__v' => $productComplement->__v,
                    'original_cloned_id' => (string) $productComplement->original_cloned_id,
                    'settingsTotem' => $productComplement->settingsTotem,
                    'ingredients' => $productComplement->ingredients,
                    'rules' => $productComplement->rules,
                    'locationTypes' => $productComplement->locationTypes,
                    'items' => array_map(fn($product) => (string) $product, $productComplement->items),
                    'categories' => array_map(fn($category) => (string) $category, $productComplement->categories ?? [])
                ];
            });

            return response()->json([
                'total' => count($productComplements),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $productComplements
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Grupo de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {

        $validator = Validator::make($request->all(), [
            'id'            => 'required|string',
            'active'        => 'required',
            'title'         => 'required|string',
            'description'   => 'nullable|string',
            'code'          => 'required|string',
            'ingredients'   => 'required|boolean',
            'minimum'       => 'required|string',
            'maximum'       => 'required|string',
            'mandatory'     => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $complementID = new ObjectId($request->id);
            $complement = Complementsgroup::where('_id', $complementID)->first();

            if (!$complement) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            $complement->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $complement->title = $request->title;
            $complement->description = $request->description;
            $complement->code = $request->code;
            $complement->ingredients = $request->ingredients;
            $complement->rules = [
                'minQuantity' => $request->minimum,
                'maxQuantity' => $request->maximum,
                'mandatory' => $request->mandatory
            ];

            $complement->save();

            return response()->json([
                'message' => 'Grupo de Complementos Atualizado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Editar Grupo de Complementos',
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
            $complementGroupID = new ObjectId($request->id);

            $complementGroup = Complementsgroup::where('_id', $complementGroupID)->first();

            if (!$complementGroup) {
                return response()->json(['error' => 'Grupo de Complemento não encontrado!'], 404);
            }

            $complementGroup->active = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);

            $complementGroup->save();

            return response()->json($complementGroup, 200, [], JSON_UNESCAPED_SLASHES);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar Grupo de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sort(Request $request) {

        $validator = Validator::make($request->all(), [
            'complementsGroups' => 'required|array',
            'complementsGroups.*._id' => 'required|string|exists:complementsgroups,_id',
            'complementsGroups.*.seq' => 'required|integer|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            foreach ($request->complementsGroups as $complementGroup) {
                Complementsgroup::where('_id', $complementGroup['_id'])
                    ->update(['seq' => $complementGroup['seq']]);
            }
    
            return response()->json([
                'message' => 'Grupo de Complementos atualizados com sucesso!',
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar Grupo de Complementos',
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
            $complementID = new ObjectId($request->id);
            $complement = Complementsgroup::where('_id', $complementID)->first();

            if (!$complement) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            $complement->deleted = true;

            $complement->save();

            return response()->json([
                'message' => 'Grupo de Complementos Deletado com Sucesso!',
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Deletar Grupo de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
