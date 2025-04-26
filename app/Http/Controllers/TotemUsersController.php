<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Totemuser;

class TotemUsersController extends Controller {

    public function create(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'active'                => 'required',
                'branch'                => 'required|string',
                'company'               => 'required|string',
                'email'                 => 'required|string|email|unique:totemusers,email',
                'name'                  => 'required|string',
                'maxConcurrentLogins'   => 'required|string',
                'password'              => 'required|string',
                'tefCNPJ'               => 'required|string',
                'tefCompany'            => 'required|string',
                'tefComunication'       => 'required|string',
                'tefIpAddress'          => 'required|string',
                'tefOtp'                => 'required|string',
                'tefTerminal'           => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $totemUser = new Totemuser();

            $totemUser->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $totemUser->customerOf = "";
            $totemUser->branch = new ObjectId($request->branch);
            $totemUser->company = new ObjectId($request->company);
            $totemUser->email = $request->email;
            $totemUser->name = $request->name;
            $totemUser->maxConcurrentLogins = (integer) $request->maxConcurrentLogins;
            $totemUser->password = Hash::make($request->password);
            $totemUser->isVerified = true;
            $totemUser->iatVerify = [];
            $totemUser->__v = 0;
            $totemUser->deleted = false;
            $totemUser->fixedUserToken = "";
            $totemUser->tefCNPJ = $request->tefCNPJ;
            $totemUser->tefCompany = $request->tefCompany;
            $totemUser->tefComunicacao = $request->tefComunication;
            $totemUser->tefIpAddress = $request->tefIpAddress;
            $totemUser->tefOtp = $request->tefOtp;
            $totemUser->tefTerminal = $request->tefTerminal;
            $totemUser->testFlag = true;

            $totemUser->save();

            return response()->json($totemUser, 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Usuário do Totem',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function totem_users(Request $request) {
        try {
            $id = $request->query('_id');
            $limit = $request->query('$limit', null);

            $query = Totemuser::query();

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

            $totemUsers = $query->get()->map(function ($totemUser) {
                return [
                    '_id' => (string) $totemUser->_id,
                    'updatedAt' => $totemUser->updatedAt,
                    'createdAt' => $totemUser->createdAt,
                    'active' => $totemUser->active,
                    'customerOf' => $totemUser->customerOf ?? "",
                    'branch' => (string) $totemUser->branch,
                    'company' => (string) $totemUser->company ?? "",
                    'email' => $totemUser->email,
                    'name' => $totemUser->name,
                    'maxConcurrentLogins' => $totemUser->maxConcurrentLogins,
                    'isVerified' => $totemUser->isVerified,
                    '__v' => $totemUser->__v,
                    'deleted' => $totemUser->deleted,
                    'fixedUserToken' => $totemUser->fixedUserToken ?? "",
                    'tefCNPJ' => $totemUser->tefCNPJ ?? "",
                    'tefCompany' => $totemUser->tefCompany ?? "",
                    'tefComunicacao' => $totemUser->tefComunicacao ?? "",
                    'tefIpAddress' => $totemUser->tefIpAddress ?? "",
                    'tefOtp' => $totemUser->tefOtp ?? "",
                    'tefTerminal' => $totemUser->tefTerminal ?? "",
                    'testFlag' => $totemUser->testFlag ?? false
                ];
            });

            return response()->json([
                'total' => count($totemUsers),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $totemUsers
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Usuários do Totem',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
