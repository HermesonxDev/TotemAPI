<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Totemcheckin;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Totemuser;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Period;
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
    
            $totemUser = Totemuser::where('email', $request->email)
                                  ->where('deleted', '!=', true)
                                  ->first();
    
            if (!$totemUser) {
                return response()->json(['message' => 'Totem não encontrado.'], 404);
            }
    
            $companyId = new ObjectId($request->company);
            $company = Company::where('_id', $companyId)
                              ->where('deleted', '!=', true)
                              ->first();
    
            if (!$company) {
                return response()->json(['message' => 'Empresa não encontrada.'], 404);
            }
    
            $branchId = new ObjectId($totemUser->branch);
            $branch = Branch::where('_id', $branchId)
                            ->where('deleted', '!=', true)
                            ->first();
    
            if (!$branch) {
                return response()->json(['message' => 'Filial não encontrada.'], 404);
            }
    
            $periodData = Period::where('branch', $branchId)
                                ->where('deleted', '!=', true)
                                ->first();
    
            if (!$periodData) {
                return response()->json(['message' => 'Horário de funcionamento não encontrado.'], 404);
            }
    
            $timestamp = Carbon::now('America/Fortaleza');
            $dayOfWeek = strtolower($timestamp->englishDayOfWeek);
            $todayPeriods = $periodData->period[$dayOfWeek] ?? [];
    
            $isWithinSchedule = false;
            $currentTime = $timestamp->format('H:i');
    
            foreach ($todayPeriods as $interval) {
                if (!($interval['disabled'] ?? false)) {
                    $from = $interval['from'];
                    $to = $interval['to'];
    
                    if ($from <= $to) {
                        if ($currentTime >= $from && $currentTime <= $to) {
                            $isWithinSchedule = true;
                            break;
                        }
                    } else {
                        if ($currentTime >= $from || $currentTime <= $to) {
                            $isWithinSchedule = true;
                            break;
                        }
                    }
                }
            }
    
            if (!$isWithinSchedule) {
                return response()->json([
                    'message' => 'Fora do horário de funcionamento da loja.'
                ], 403);
            }
    
            $hour = $timestamp->format('H');
            $minute = (int) $timestamp->format('i');
            $minuteSlot = floor($minute / 5) * 5;
            $slotKey = sprintf('%02d:%02d', $hour, $minuteSlot);
    
            $checkInDoc = Totemcheckin::where('company', $companyId)
                                      ->where('deleted', '!=', true)
                                      ->orderBy('createdAt', 'desc')
                                      ->first();
    
            if (!$checkInDoc || !Carbon::parse($checkInDoc->createdAt)->setTimezone('UTC')->isToday()) {
                return response()->json([
                    'message' => 'Nenhum check-in disponível para hoje.'
                ], 404);
            }
    
            if (!isset($checkInDoc->beats[$slotKey])) {
                return response()->json([
                    'message' => "Horário $slotKey não encontrado no documento de check-ins."
                ], 404);
            }
    
            $beats = $checkInDoc->beats;
    
            if (!isset($beats[$slotKey]['checkins'])) {
                $beats[$slotKey]['checkins'] = [];
            }
    
            $alreadyCheckedIn = false;
            foreach ($beats[$slotKey]['checkins'] as &$entry) {
                if ($entry['email'] === $totemUser->email) {
                    $entry['timestamp'] = $timestamp->format('Y-m-d\TH:i:s.u') . "Z";
                    $alreadyCheckedIn = true;
                    break;
                }
            }
    
            if (!$alreadyCheckedIn) {
                $beats[$slotKey]['checkins'][] = [
                    'branch'    => new ObjectId($branch->_id),
                    'totem'     => new ObjectId($totemUser->_id),
                    'name'      => $totemUser->name,
                    'email'     => $totemUser->email,
                    'timestamp' => $timestamp->format('Y-m-d\TH:i:s.u') . "Z"
                ];
            }
    
            $checkInDoc->beats = $beats;
            $checkInDoc->save();
    
            return response()->json([
                'message' => $alreadyCheckedIn 
                    ? 'Check-in atualizado com sucesso.'
                    : 'Check-in registrado com sucesso.'
            ], 200, [], JSON_UNESCAPED_SLASHES);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao processar o check-in do totem.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
