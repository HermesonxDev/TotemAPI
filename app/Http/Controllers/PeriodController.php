<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Period;

class PeriodController extends Controller
{
    public function periods(Request $request) {
        $branch = $request->query('branch');
        $limit = $request->query('$limit', null);

        $query = Period::query();

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
    }
}
