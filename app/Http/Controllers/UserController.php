<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\User;

class UserController extends Controller {

    public function create(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'name'           => 'required|string',
                'email'          => 'required|string',
                'password'       => 'required|string',
                'role'           => 'required|string',
                'companies'      => 'nullable',
                'branches'       => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            Log::info('request', [$request->all()]);

            $user = new User();

            $user->name = $request->name;
            $user->password = Hash::make($request->password);
            $user->email = $request->email;
            $user->roles = [
                $request->role
            ];
            $user->branches = array_map(fn($branch) => new ObjectId($branch), $request->branches ?? []);
            $user->companies = array_map(fn($company) => new ObjectId($company), $request->companies ?? []);

            $user->save();
            
            event(new Registered($user));

            return response()->json($user, 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function users(Request $request) {
        try {
            $id = $request->query('_id');
            $limit = $request->query('$limit', null);

            $query = User::query();

            if ($id) {
                try {
                    $query->where('_id', $id);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'ID inválido'], 400);
                }
            }

            if ($limit === "false" || is_null($limit)) {
                $limitValue = null;
            } elseif (is_numeric($limit)) {
                $limitValue = (int) $limit;
            } else {
                $limitValue = null;
            }

            if (!is_null($limitValue)) {
                $query->limit($limitValue);
            }

            $users = $query->get()->map(function ($user) {
                return [
                    '_id' => (string) $user->_id,
                    'updatedAt' => $user->updatedAt,
                    'createdAt' => $user->createdAt,
                    'name' => $user->name,
                    'password' => $user->password,
                    'cpf' => $user->cpf,
                    'phone' => $user->phone,
                    'birthDate' => $user->birthDate,
                    'gender' => $user->gender,
                    'email' => $user->email,
                    'customerOf' => $user->customerOf,
                    'noAuthUser' => $user->noAuthUser,
                    'isVerified' => $user->isVerified,
                    'branches' => $user->branches,
                    'roles' => $user->roles,
                    '__v' => $user->__v,
                    'cnpj' => $user->cnpj,
                    'externalId' => $user->externalId,
                    'pushToken' => $user->pushToken,
                    'superuser' => $user->superuser
                ];
            });

            return response()->json([
                'total' => count($users),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $users
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
