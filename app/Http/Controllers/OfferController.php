<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Offer;

class OfferController extends Controller
{
    public function offers(Request $request)
    {
        $branch = $request->query('branch');
        $disabled = filter_var($request->query('disabled', null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $limit = $request->query('$limit', null);

        $query = Offer::query();

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

        $offers = $query->get()->map(function ($offer) {
            return [
                '_id' => (string) $offer->_id,
                'updatedAt' => $offer->updatedAt,
                'createdAt' => $offer->createdAt,
                'branch' => (string) $offer->branch,
                'title' => $offer->title,
                'description' => $offer->description,
                'imageLink' => $offer->imageLink,
                'company' => (string) $offer->company,
                'uses' => $offer->uses,
                'period' => collect((array) $offer->period)->mapWithKeys(function ($days, $dayName) {
                    return [
                        $dayName => array_map(function ($period) {
                            return [
                                '_id' => (string) $period['id'],
                                'to' => $period['to'],
                                'from' => $period['from']
                            ];
                        }, is_array($days) ? $days : [])
                    ];
                })->toArray(),
                'triggers' => $offer->triggers,
                'rules' => $offer->rules,
                'match' => [
                    'exclude' => $offer->match['exclude'] ?? [],
                    'categories' => array_map(fn($category) => (string) $category, $offer->match['categories'] ?? []),
                    'products' => array_map(fn($product) => (string) $product, $offer->match['products'] ?? []),
                ],
                'rewards' => $offer->rewards,
                'locationTypes' => $offer->locationTypes,
                'disabled' => $offer->disabled,
                '__v' => $offer->__v,
            ];
        });

        return response()->json([
            'total' => count($offers),
            'limit' => $limitValue,
            'skip' => 0,
            'data' => $offers
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }
}
