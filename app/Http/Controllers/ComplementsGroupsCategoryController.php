<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Complementsgroupscategory;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class ComplementsGroupsCategoryController extends Controller {
    
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'          => 'required',
            'description'   => 'nullable',
            'branch'        => 'required',
            'company'       => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maxSeq = Complementsgroupscategory::max('seq') ?? 0;

            $ComplementsGroupsCategory = new Complementsgroupscategory();

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

    }

    public function edit(Request $request) {

    }

    public function delete(Request $request) {

    }
}
