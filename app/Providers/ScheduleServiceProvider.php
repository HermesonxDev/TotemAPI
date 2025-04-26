<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class ScheduleServiceProvider extends ServiceProvider
{
    public function boot(Schedule $schedule): void
    {
        $schedule->command('app:create-check-in')->dailyAt('00:05')->timezone('America/Fortaleza');

        $schedule->command('app:create-resume')->cron('*/20 * * * *')->timezone('America/Fortaleza');
    }
}
