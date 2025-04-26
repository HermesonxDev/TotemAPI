<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Complementsgroup;
use App\Models\Productcategory;
use App\Jobs\TotemChargeJob;
use Illuminate\Http\Request;
use App\Models\Totemcharge;
use MongoDB\BSON\ObjectId;
use App\Models\Product;

class TotemChargeController extends Controller {

    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'originalBranch'     => 'required|string',
            'destinationBranch'  => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            dispatch(new TotemChargeJob(
                new ObjectId($request->originalBranch),
                new ObjectId($request->destinationBranch)
            ));
        
            return response()->json([
                'message' => 'Clonagem iniciada! O cardápio será copiado em segundo plano.'
            ], 202);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Tentar Clonar Cardápio',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
