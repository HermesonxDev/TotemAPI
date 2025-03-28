<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ComplementsGroupsController;
use App\Http\Controllers\TotemCheckInController;

Route::post('/authentication', [AuthController::class, 'login']);
Route::post('/orders', [OrderController::class, 'create']);
Route::get('/offers', [OfferController::class, 'offers']);
Route::get('/periods', [PeriodController::class, 'periods']);
Route::get('/products', [ProductController::class, 'products']);
Route::get('/users', [UserController::class, 'users']);
Route::get('/product-categories', [ProductCategoryController::class, 'product_categories']);
Route::get('/complements-groups', [ComplementsGroupsController::class, 'complements_groups']);
Route::get('/branches', [BranchController::class, 'branches']);
Route::get('/company', [CompanyController::class, 'companies']);
Route::post('/checkIn', [TotemCheckInController::class, 'check_in']);

Route::prefix('/pdv')->group(function () {
    Route::prefix('events')->group(function () {
        Route::get('/orders', [OrderController::class, 'getDetails']);
        Route::get('/polling', [EventController::class, 'polling']);
        Route::post('/acknowledgment', [EventController::class, 'acknowledgment']);
        Route::post('/orders/{id}/statuses/{status}', [OrderController::class, 'statuses']);
    });
});

// Rota de Teste
Route::post('/test', [TotemCheckInController::class, 'check_in']);
