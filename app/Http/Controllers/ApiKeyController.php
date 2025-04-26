<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use Firebase\JWT\JWT;
use App\Models\Apikey;

class ApiKeyController extends Controller {
    
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string',
            'branch'    => 'required|string',
            'company'   => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors()
            ], 422);
        }

        try {
            $secretKey = env('JWT_SECRET_KEY');

            if (!$secretKey) {
                return response()->json([
                    'message' => 'Erro ao criar Chave de API',
                    'error' => 'Nenhuma secret key foi encontrada para encriptar a chave de api.'
                ]);
            }

            $payload = [
                'audience' => "https://yourdomain.com",
                'expiresIn' => '100y',
                'subject' => "anonymous",
                'issuer' => 'Laravel'
            ];

            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            $apiKey = new Apikey();

            $apiKey->name = $request->name;
            $apiKey->company = new ObjectId($request->company);
            $apiKey->key = $jwt;
            $apiKey->branches = [
                new ObjectId($request->branch)
            ];
            $apiKey->__v = 0;

            $apiKey->save();

            return response()->json([
                'message' => 'Chave de API criada com Sucesso!'
            ], 201, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao criar Chave de API',
                "error" => $e->getMessage()
            ]);
        }
    }

    public function api_keys(Request $request) {
        try {
            $company = $request->query('company');
            $limit = $request->query('$limit', null);

            $query = Apikey::query();

            if ($company) {

                $companyID = new ObjectId($company);
                $query->where('company', $companyID);
                $result = $query->get();
                
                if ($result->isEmpty()) {
                    return response()->json([
                        'message' => 'Erro ao Listar Api Keys.',
                        'error' => 'Nenhuma API Key encontrada para essa Company.'
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

            $apiKeys = $query->get()->map(function ($apiKey) {
                return [
                    '_id' => (string) $apiKey->_id,
                    'updatedAt' => $apiKey->updatedAt,
                    'createdAt' => $apiKey->createdAt,
                    'name' => $apiKey->name,
                    'company' => (string) $apiKey->company,
                    'key' => $apiKey->key,
                    'branches' => array_map(fn($branch) => (string) $branch, $apiKey->branches),
                    '__v' => $apiKey->__v
                ];
            });

            return response()->json([
                'total' => count($apiKeys),
                'limit' => $limitValue,
                'skip'  => 0,
                'data'  => $apiKeys
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Api Keys',
                'error' => $e->getMessage()
            ]);
        }
    }
}
