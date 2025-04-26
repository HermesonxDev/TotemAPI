<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\CentralLogics\Helpers;
use App\Models\Totemuser;
use Firebase\JWT\JWT;

class AuthController extends Controller
{
    public function register(Request $request) {

    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'strategy'      => 'required|string|in:local',
            'userStrategy'  => 'required|string|in:totem',
            'username'      => 'required|string',
            'password'      => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422, [], JSON_UNESCAPED_SLASHES);
        };

        try {
            $user = Totemuser::where('email', $request->username)->first();

            if (!$user || !password_verify($request->password, $user->password)) {
                return response()->json(['errors' => 'Usuário ou Senha Incorretos!'], 422);
            };

            $secretKey = env('JWT_SECRET_KEY');

            $payload = [
                'type' => 'totem',
                'iat' => time() - 3,
                'exp' => time() + 60 * 60 * 24 * 5000,
                'companyId' => (string) $user->customerOf,
                'branch' => (string) $user->branch,
                'email' => $user->email,
                'name' => $user->name,
                'userId' => (string) $user->_id,
                'aud' => "https://yourdomain.com",
                'tefIpAddress' => $user->tefIpAddress,
                'tefOtp' => $user->tefOtp,
                'tefCompany' => $user->tefCompany,
                'tefCNPJ' => $user->tefCNPJ,
                'tefTerminal' => $user->tefTerminal,
                'tefComunicacao' => $user->tefComunicacao,
                'tefInternalPrinter' => $user->tefInternalPrinter,
                'fixedUserToken' => $user->fixedUserToken,
                'iss' => 'Laravel'
            ];

            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            return response()->json([
                'jwt' => $jwt,
                'payload' => $payload
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Tentar Logar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request) {

    }
}
