<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Complementsgroupscategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class ComplementsGroupsCategoryController extends Controller {
    
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'active'            => 'required',
            'name'              => 'required',
            'description'       => 'nullable',
            'branch'            => 'required',
            'company'           => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maxSeq = Complementsgroupscategory::where('branch', new ObjectId($request->branch))->max('seq') ?? 0;

            $ComplementsGroupsCategory = new Complementsgroupscategory();

            $ComplementsGroupsCategory->active = $request->active;
            $ComplementsGroupsCategory->seq = $maxSeq + 1;
            $ComplementsGroupsCategory->name = $request->name;
            $ComplementsGroupsCategory->description = $request->description ?? "";
            $ComplementsGroupsCategory->branch = new ObjectId($request->branch);
            $ComplementsGroupsCategory->company = new ObjectId($request->company);
            $ComplementsGroupsCategory->__v = 0;
            $ComplementsGroupsCategory->deleted = false;

            $ComplementsGroupsCategory->save();

            return response()->json([
                'message' => 'Categoria de Grupo de Complementos criado com sucesso!'
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao criar Categoria de Grupo de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function complements_groups_categories(Request $request) {
        try {
            $branch = $request->query('branch');
            $limit = $request->query('$limit', null);

            $query = Complementsgroupscategory::query();

            if ($branch) {
                $branchID = new ObjectId($branch);
                $query->where('branch', $branchID);

                $existsQuery = clone $query;

                if (!$existsQuery->exists()) {
                    return response()->json([
                        'message' => 'Erro ao Listar Categorias de Grupos de Complementos',
                        'error' => 'Categorias de Grupos de Complementos não encontradas!'
                    ], 404);
                }
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

            $ComplementsGroupsCategories = $query->get()->map(function ($complementGroupCategory) {
                return [
                    '_id' => (string) $complementGroupCategory->_id,
                    'seq' => $complementGroupCategory->seq,
                    'name' => $complementGroupCategory->name,
                    'description' => $complementGroupCategory->description,
                    'branch' => (string) $complementGroupCategory->branch,
                    'company' => (string) $complementGroupCategory->company,
                    '__v' => 0,
                    'deleted' => $complementGroupCategory->deleted,
                    'createdAt' => $complementGroupCategory->createdAt,
                    'updatedAt' => $complementGroupCategory->updatedAt,
                    'complementGroup' => (string)$complementGroupCategory->complementGroup,
                    'active' => $complementGroupCategory->active
                ];
            });

            return response()->json([
                'total' => count($ComplementsGroupsCategories),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $ComplementsGroupsCategories
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Categorias de Grupos de Complementos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {

    }

    public function delete(Request $request) {

    }
}
