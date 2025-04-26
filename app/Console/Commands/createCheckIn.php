<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Company;
use App\Models\Totemuser;
use App\Models\Period;
use App\Models\Totemcheckin;
use MongoDB\BSON\ObjectId;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class createCheckIn extends Command {
    
    protected $signature = 'app:create-check-in';
    protected $description = 'Cria registros de check-in esperados para as empresas com totemCheckIn ativo';

    public function handle() {
        $companies = Company::where('settings.reports.totemCheckIn', true)->get();

        foreach ($companies as $company) {

            $companyID = new ObjectId($company->id);

            $totems = Totemuser::where('company', $companyID)
                               ->where('deleted', '<>', true)
                               ->get();

            $amountTotems = $totems->count();
            $totemsByBranch = $totems->groupBy('branch');

            $beats = [];
            for ($hour = 0; $hour < 24; $hour++) {
                for ($minute = 0; $minute < 60; $minute += 5) {
                    $formattedTime = sprintf('%02d:%02d', $hour, $minute);
                    $beats[$formattedTime] = [
                        'number_of_totem_checkins' => 0,
                        'checkins' => []
                    ];
                }
            }            

            $today = strtolower(Carbon::now()->format('l'));

            foreach ($totemsByBranch as $branchId => $totemsInBranch) {
                $period = Period::where('branch', new ObjectId($branchId))
                                ->where('deleted', '<>', true)
                                ->first();

                if (!$period || !isset($period->period[$today])) continue;

                foreach ($period->period[$today] as $range) {
                    if ($range['disabled']) continue;

                    $start = $this->roundToFiveMinutes(Carbon::createFromTimeString($range['from']));
                    $end   = $this->roundToFiveMinutes(Carbon::createFromTimeString($range['to']));

                    if ($end->lessThan($start)) {
                        $end->addDay();
                    }

                    $current = $start->copy();

                    while ($current->lessThanOrEqualTo($end)) {
                        $key = $current->format('H:i');

                        if (array_key_exists($key, $beats)) {
                            $beats[$key]['number_of_totem_checkins'] += $totemsInBranch->count();
                        }

                        $current->addMinutes(5);
                    }
                }
            }

            $checkIn = new Totemcheckin();
            $checkIn->name = $company->name;
            $checkIn->company = new ObjectId($company->_id);
            $checkIn->beats = $beats;
            $checkIn->amount_totems = $amountTotems;
            $checkIn->save();
        }
    }

    private function roundToFiveMinutes(Carbon $time): Carbon {
        $minute = (int) $time->format('i');
        $mod = $minute % 5;

        if ($mod !== 0) {
            $minute = $minute - $mod;
            $time->minute($minute);
        }

        return $time->copy()->second(0);
    }
}
