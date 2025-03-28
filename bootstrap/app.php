<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(prepend: [
            \Illuminate\Foundation\Http\Middleware\TrimStrings::class, // ✅ Remove espaços extras nos inputs
            \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class, // ✅ Converte "" para null
            \Illuminate\Cookie\Middleware\EncryptCookies::class, // ✅ Garante que os cookies sejam criptografados
            \Illuminate\Session\Middleware\StartSession::class, // ✅ Necessário para CSRF funcionar
            \Illuminate\View\Middleware\ShareErrorsFromSession::class, // ✅ Compartilha erros na sessão
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
