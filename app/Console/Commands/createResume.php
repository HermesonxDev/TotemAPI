<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\Log;
use Illuminate\Console\Command;
use App\Models\Totemcheckin;
use App\Models\Totemresume;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use App\Models\Period;
use App\Models\Branch;
use App\Models\Totemuser;
use Carbon\Carbon;

class createResume extends Command {

    protected $signature = 'app:create-resume';
    protected $description = 'Gera resumo de eficiência de check-ins dos totens';

    public function handle() {
        $companiesResumeQuantity = Company::where('settings.reports.totemCheckIn', true)->count();

        $now = Carbon::now('America/Fortaleza');
        $startOfDay = $now->copy()->startOfDay()->timezone('UTC');
        $endOfDay = $now->copy()->endOfDay()->timezone('UTC');

        $checkins = Totemcheckin::orderBy('createdAt', 'desc')
                                ->limit($companiesResumeQuantity)
                                ->get();

        foreach ($checkins as $checkinDoc) {
            $companyId = new ObjectId($checkinDoc->company);
            $beats = $checkinDoc->beats ?? [];
            $branches = [];

            $company = Company::where('_id', $companyId)
                              ->where('deleted', '!=', true)
                              ->first();

            foreach ($beats as $hour => $info) {
                if (!isset($info['checkins']) || empty($info['checkins'])) continue;

                foreach ($info['checkins'] as $checkin) {
                    $branch = (string) $checkin['branch'];
                    $totem = (string) $checkin['totem'];

                    $branches[$branch][$totem][] = $hour;
                }
            }

            $efficiencies = [];

            foreach ($branches as $branchId => $totens) {
                $period = Period::where('branch', new ObjectId($branchId))
                                ->where('deleted', '!=', true)
                                ->first();

                if (!$period) continue;

                $branch = Branch::where('_id', new ObjectId($branchId))
                                ->where('deleted', '!=', true)
                                ->first();

                $day = strtolower($now->englishDayOfWeek);
                $todayPeriods = $period->period[$day] ?? [];

                foreach ($todayPeriods as $range) {
                    if ($range['disabled']) continue;

                    $start = Carbon::createFromFormat('H:i', $range['from'], 'America/Fortaleza');
                    $end = Carbon::createFromFormat('H:i', $range['to'], 'America/Fortaleza');

                    if ($end->lessThan($start)) {
                        $end->addDay();
                    }

                    $end = $end->greaterThan($now) ? $now->copy() : $end;

                    $totalBeats = 0;
                    $expectedBeats = [];

                    $current = $start->copy();
                    while ($current->lessThanOrEqualTo($end)) {
                        $expectedBeats[] = $current->format('H:i');
                        $totalBeats++;
                        $current->addMinutes(5);
                    }

                    foreach ($totens as $totemId => $horariosCheckados) {
                        $validBeats = 0;

                        foreach ($expectedBeats as $hora) {
                            if (in_array($hora, $horariosCheckados)) {
                                $validBeats++;
                            }
                        }

                        $percent = $totalBeats > 0 ? round(($validBeats / $totalBeats) * 100) : 0;

                        $totemUser = Totemuser::where('_id', new ObjectId($totemId))
                                              ->where('deleted', '!=', true)
                                              ->first();

                        $efficiencies[] = [
                            'branch_name'   => $branch->name,
                            'totem_name'    => $totemUser->name,
                            'branch'        => new ObjectId($branchId),
                            'totem'         => new ObjectId($totemId),
                            'efficiency'    => "{$percent}%"
                        ];
                    }
                }
            }

            $resume = Totemresume::where('company', $companyId)
                                 ->where('createdAt', '>=', $startOfDay)
                                 ->where('createdAt', '<=', $endOfDay)
                                 ->first();

            if ($resume) {
                $resume->efficiency = $efficiencies;
                $resume->amount_totems = $checkinDoc->amount_totems;
                $resume->updatedAt = Carbon::now('UTC');
                $resume->save();
            } else {
                Totemresume::create([
                    'name'                  => $company->name,
                    'referenceCheckinDoc'   => $checkinDoc->_id,
                    'company'               => $companyId,
                    'efficiency'            => $efficiencies,
                    'amount_totems'         => $checkinDoc->amount_totems
                ]);
            }
        }
    }
}
