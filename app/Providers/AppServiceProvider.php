<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        date_default_timezone_set('America/Fortaleza');
        Vite::prefetch(concurrency: 3);
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }

        Factory::guessFactoryNamesUsing(function ($modelName) {
            return 'Database\Factories\\' . class_basename($modelName) . 'Factory';
        });
    }
}
