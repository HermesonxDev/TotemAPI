<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Period;

class PeriodController extends Controller {

    public function create(Request $request) {

        $validator = Validator::make($request->all(), [
            'branch'     => 'required',
            'company'    => 'required',
            'monday'     => 'nullable|array',
            'tuesday'    => 'nullable|array',
            'wednesday'  => 'nullable|array',
            'thursday'   => 'nullable|array',
            'friday'     => 'nullable|array',
            'saturday'   => 'nullable|array',
            'sunday'     => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $period = new Period();

            $period->title = "Horário de Funcionamento";
            $period->branch = new ObjectId($request->branch);
            $period->company = new ObjectId($request->company);
            $period->period = [
                "monday" => $request->monday,
                "tuesday" => $request->tuesday,
                "wednesday" => $request->wednesday,
                "thursday" => $request->thursday,
                "friday" => $request->friday,
                "saturday" => $request->saturday,
                "sunday" => $request->sunday
            ];
            $period->__v = 0;

            $period->save();

            return response()->json($period, 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Período',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function periods(Request $request) {
        try {
            $branch = $request->query('branch');
            $limit = $request->query('$limit', null);

            $query = Period::query();

            $query->where('deleted', '<>', true);
            
            if ($branch) {
                try {
                    $branchId = new ObjectId($branch);
                    $query->where('branch', $branchId);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Branch ID inválido'], 400);
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

            $periods = $query->get()->map(function ($period) {
                return [
                    '_id' => (string) $period->_id,
                    'updatedAt' => $period->updatedAt,
                    'createdAt' => $period->createdAt,
                    'title' => $period->title,
                    'branch' => (string) $period->branch,
                    'company' => (string) $period->company,
                    'period' => collect((array) $period->period)->mapWithKeys(function ($days, $dayName) {
                        return [
                            $dayName => array_map(function ($period) {
                                return [
                                    'from' => $period['from'],
                                    'to' => $period['to'],
                                    'disabled' => $period['disabled'],
                                    '_id' => (string) $period['id'],
                                ];
                            }, is_array($days) ? $days : [])
                        ];
                    })->toArray(),
                    '__v' => $period->__v
                ];
            });

            return response()->json([
                'total' => count($periods),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $periods
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Períodos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {

        $validator = Validator::make($request->all(), [
            'id'         => 'required',
            'branch'     => 'required',
            'company'    => 'required',
            'monday'     => 'nullable|array',
            'tuesday'    => 'nullable|array',
            'wednesday'  => 'nullable|array',
            'thursday'   => 'nullable|array',
            'friday'     => 'nullable|array',
            'saturday'   => 'nullable|array',
            'sunday'     => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {

            $periodID = new ObjectId($request->id);

            $period = Period::where('_id', $periodID)->first();

            $period->title = "Horário de Funcionamento";
            $period->branch = new ObjectId($request->branch);
            $period->company = new ObjectId($request->company);
            $period->period = [
                "monday" => $request->monday,
                "tuesday" => $request->tuesday,
                "wednesday" => $request->wednesday,
                "thursday" => $request->thursday,
                "friday" => $request->friday,
                "saturday" => $request->saturday,
                "sunday" => $request->sunday
            ];
            $period->__v = 0;

            $period->save();

            return response()->json($period, 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Editar Período',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request) {
        $validator = Validator::make($request->all(), [
            'id'         => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {

            $periodID = new ObjectId($request->id);

            $period = Period::where('_id', $periodID)->first();

            $period->deleted = true;

            $period->save();

            return response()->json($period, 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Deletar Período',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
