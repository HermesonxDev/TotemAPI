<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComplementsGroupsController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\TotemCheckInController;
use App\Http\Controllers\TotemChargeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;

Route::prefix('/auth')->group(function () {
    Route::post('/authentication', [AuthController::class, 'login']);
});

Route::prefix('/create')->group(function () {
    Route::post('/apikey', [ApiKeyController::class, 'create']);
    Route::post('/order', [OrderController::class, 'create']);
});

Route::prefix('/list')->group(function () {
    Route::get('/apikey', [ApiKeyController::class, 'api_keys']);
});

Route::prefix('/edit')->group(function () {

});

Route::prefix('delete')->group(function () {

});

Route::prefix('/pdv')->group(function () {
    Route::prefix('events')->group(function () {
        Route::get('/orders', [OrderController::class, 'getDetails']);
        Route::get('/polling', [EventController::class, 'polling']);
        Route::post('/acknowledgment', [EventController::class, 'acknowledgment']);
        Route::post('/orders/{id}/statuses/{status}', [OrderController::class, 'statuses']);
    });
});