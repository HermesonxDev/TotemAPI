<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\User;

class UserController extends Controller {

    public function create(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'active'         => 'required',
                'name'           => 'required|string',
                'phone'          => 'required|string',
                'email'          => 'required|string',
                'password'       => 'required|string',
                'birthDate'      => 'required|string',
                'cpf'            => 'required|string',
                'cnpj'           => 'required|string',
                'gender'         => 'required|string',
                'externalId'     => 'required|string',
                'role'           => 'required|string',
                'superuser'      => 'required',
                'noAuthUser'     => 'required',
                'photo'          => 'nullable|array',
                'photo.*'        => 'file|mimes:jpeg,png,jpg',
                'latitude'       => 'nullable|string',
                'longitude'      => 'nullable|string',
                'postalCode'     => 'nullable|string',
                'reference'      => 'nullable|string',
                'complement'     => 'nullable|string',
                'street'         => 'nullable|string',
                'number'         => 'nullable|string',
                'neighborhood'   => 'nullable|string',
                'city'           => 'nullable|string',
                'state'          => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = new User();

            $user->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $user->name = $request->name;
            $user->password = Hash::make($request->password);
            $user->cpf = $request->cpf;
            $user->phone = $request->phone;
            $user->birthDate = $request->birthDate;
            $user->gender = $request->gender;
            $user->email = $request->email;
            $user->noAuthUser = filter_var($request->noAuthUser, FILTER_VALIDATE_BOOLEAN);
            $user->children = [];
            $user->grouping = [
                "subgroup" => [
                    "default" => ""
                ],
                "group" => [
                    "default" => ""
                ],
                "id" => [
                    "default" => ""
                ],
                "role" => [
                    "default" => $request->role
                ]
            ];
            $user->credit = [
                "history" => [],
                "available" => 0
            ];
            $user->isVerified = true;
            $user->branches = [];
            $user->roles = [];
            $user->addresses = [
                "coordinates" => [
                    "latitude" => $request->latitude,
                    "longitude" => $request->longitude
                ],
                "_id" => (string) new ObjectId(),
                "postalCode" => $request->postalCode,
                "reference" => $request->reference,
                "complement" => $request->complement,
                "state" => $request->state,
                "city" => $request->city,
                "neighborhood" => $request->neighborhood,
                "street" => $request->street,
                "number" => $request->number
            ];
            $user->mp = [
                "cards" => []
            ];
            $user->payment_method = [];
            $user->loyalty = [
                "history" => [

                ],
                "points" => 0
            ];
            $user->__v = 0;
            $user->cnpj = $request->cnpj;
            $user->user = "";
            $user->externalId = $request->externalId;
            $user->pushToken = "";
            $user->pagarme = [
                "customer" => [],
                "cards" => []
            ];
            $user->azureFacePersonId = "";
            $user->azurePhotoSent = false;
            $user->superuser = $request->superuser;
            $user->deleted = false;
            $user->resetExpires = null;
            $user->resetShortToken = null;
            $user->resetToken = null;

            $photo = json_decode(json_encode($user->photo), true);

            if ($request->hasFile('photo')) {
                $newImages = [];

                foreach ($request->file('photo') as $image) {
                    $path = Storage::disk('s3')->put("photo", $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $photo = $newImages[0] ?? null;
            }

            $user->photo = $photo;

            $user->save();

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
