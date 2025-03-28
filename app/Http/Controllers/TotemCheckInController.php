<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Totemcheckin;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Totemuser;
use App\Models\Company;
use App\Models\Branch;
use Carbon\Carbon;

class TotemCheckInController extends Controller {
    
    public function create(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'company' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $companyID = new ObjectId($request->company);
            $company = Company::where('_id', $companyID)->first();
            $beats = [];

            for ($hour = 0; $hour < 24; $hour++) {
                for ($minute = 5; $minute <= 55; $minute += 5) {
                    $formattedTime = sprintf('%02d:%02d', $hour, $minute);
                    $beats[$formattedTime] = [];
                }
            }
            
            $beats["00:00"] = [];

            $totemCheckIn = new Totemcheckin();

            $totemCheckIn->name = $company->name;
            $totemCheckIn->company = $companyID;
            $totemCheckIn->beats = $beats;

            $totemCheckIn->save();

            return response()->json($totemCheckIn, 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar CheckIn do Totem',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function totem_checkins(Request $request) {
        try {
            $company = $request->query('company');
            $limit = $request->query('$limit', null);

            $query = Totemcheckin::query();

            if ($company) {
                try {
                    $companyId = new ObjectId($company);
                    $query->where('company', $companyId);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'company ID inválido'], 400);
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

            $checkIns = $query->get()->map(function ($checkIn) {
                return [
                    '_id' => (string) $checkIn->_id,
                    'updatedAt' => $checkIn->updatedAt,
                    'createdAt' => $checkIn->createdAt,
                    'company' => (string) $checkIn->company,
                    'beats' => $checkIn->beats,
                ];
            });

            return response()->json([
                'total' => count($checkIns),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $checkIns
            ], 200, [], JSON_UNESCAPED_SLASHES);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar CheckIns',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function check_in(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'email'   => 'required',
                'company' => 'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            $totemUser = Totemuser::where('email', $request->email)->first();

            $companyID = new ObjectId($request->company);
            $company = Company::where('_id', $companyID)->first();

            $branchID = new ObjectId($totemUser->branch);
            $branch = Branch::where('_id', $branchID)->first();

            $timestamp = Carbon::now('America/Fortaleza');

            $newCheckIn = [
                'branch'     => $branch->name,
                'name'       => $totemUser->name,
                'email'      => $totemUser->email,
                'timestamp'  => $timestamp->format('Y-m-d\TH:i:s.u') . "Z"
            ];
    
            $checkIn = Totemcheckin::where('company', $companyID)->orderBy('createdAt', 'desc')->first();
    
            $hour = $timestamp->format('H');
            $minute = (int) $timestamp->format('i');
            $minuteSlot = floor($minute / 5) * 5;
            $slotKey = sprintf('%02d:%02d', $hour, $minuteSlot);
    
            if ($checkIn && Carbon::parse($checkIn->createdAt)->timezone('America/Fortaleza')->isToday()) {

                $beats = $checkIn->beats;
                $beats[$slotKey][] = $newCheckIn;
                $checkIn->beats = $beats;
                $checkIn->save();
    
                return response()->json([
                    'message' => 'CheckIn Registrado com Sucesso!'
                ], 200, [], JSON_UNESCAPED_SLASHES);
    
            } else {
                $beats = [];
    
                for ($hour = 0; $hour < 24; $hour++) {
                    for ($minute = 5; $minute <= 55; $minute += 5) {
                        $formattedTime = sprintf('%02d:%02d', $hour, $minute);
                        $beats[$formattedTime] = [];
                    }
                }

                $beats["00:00"] = [];
                $beats[$slotKey][] = $newCheckIn;
    
                $totemCheckIn = new Totemcheckin();
                $totemCheckIn->name = $company->name;
                $totemCheckIn->company = $companyID;
                $totemCheckIn->beats = $beats;
                $totemCheckIn->save();
    
                return response()->json([
                    'message' => 'Novo CheckIn Diário Criado e Registrado com Sucesso!'
                ], 201, [], JSON_UNESCAPED_SLASHES);
            }
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao processar CheckIn do Totem',
                'error' => $e->getMessage()
            ], 500);
        }
    }    
}
