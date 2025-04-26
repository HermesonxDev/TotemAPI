<?php

use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComplementsGroupsController;
use App\Http\Controllers\OperationalStatusController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\OperatingPeriodController;
use App\Http\Controllers\MenuCloningController;
use App\Http\Controllers\TotemUsersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\IntegrationsController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\UserController;

use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rotas de debug:
Route::get('/debug-headers', function (Request $request) {
    return $request->headers->all();
});

Route::get('/debug-env', function () {
    dd(config('app.env'));
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/branch-select/{company}', [ItemsController::class, 'listBranches']);


    /* ############################################################################# */
    /* ########################### Rotas de Criação ################################ */
    /* ############################################################################# */
    Route::prefix('/create')->group(function () {
        Route::post('/product', [ProductController::class, 'create']);
        Route::post('/branch', [BranchController::class, 'create']);
        Route::post('/company', [CompanyController::class, 'create']);
        Route::post('/user', [UserController::class, 'create']);
        Route::post('/category', [ProductCategoryController::class, 'create']);
        Route::post('/period', [PeriodController::class, 'create']);
        Route::post('/complement-group', [ComplementsGroupsController::class, 'create']);
        Route::post('/totem-user', [TotemUsersController::class, 'create']);
    });


    /* ############################################################################# */
    /* ########################## Rotas de Listagem ################################ */
    /* ############################################################################# */
    Route::prefix('/list')->group(function () {
        Route::get('/companies', [CompanyController::class, 'companies']);
        Route::get('/branches', [BranchController::class, 'branches']);
    });


    /* ############################################################################# */
    /* ########################### Rotas de Edição ################################# */
    /* ############################################################################# */
    Route::prefix('/edit')->group(function () {
        Route::post('/branch', [BranchController::class, 'edit']);
        Route::post('/product', [ProductController::class, 'edit']);
        Route::post('/category', [ProductCategoryController::class, 'edit']);
        Route::post('/complements-groups', [ComplementsGroupsController::class, 'edit']);
        Route::post('/period', [PeriodController::class, 'edit']);
    });


    /* ############################################################################# */
    /* ######################### Rotas de Organização ############################## */
    /* ############################################################################# */
    Route::prefix('/sort')->group(function () {
        Route::post('/products', [ProductController::class, 'sort']);
        Route::post('/categories', [ProductCategoryController::class, 'sort']);
        Route::post('/complements-groups', [ComplementsGroupsController::class, 'sort']);
    });


    /* ############################################################################# */
    /* ########################## Rotas de Exclusão ################################ */
    /* ############################################################################# */
    Route::prefix('/delete')->group(function () {
        Route::post('/product', [ProductController::class, 'delete']);
        Route::post('/category', [ProductCategoryController::class, 'delete']);
        Route::post('/complement-group', [ComplementsGroupsController::class, 'delete']);
        Route::post('/period', [PeriodController::class, 'delete']);
    });


    /* ############################################################################# */
    /* ########################### Rotas de Status ################################# */
    /* ############################################################################# */
    Route::prefix('/status')->group(function () {
        Route::post('/category', [ProductCategoryController::class, 'status']);
        Route::post('/complement-group', [ComplementsGroupsController::class, 'status']);
        Route::post('/product', [ProductController::class, 'status']);
        Route::post('/active', [ProductController::class, 'active_by_name']);
    });

    /* ############################################################################# */
    /* ########################### Rotas de Status ################################# */
    /* ############################################################################# */
    Route::prefix('/sold-out')->group(function () {
        Route::post('/product', [ProductController::class, 'sold_out']);
    });

    /* ############################################################################# */
    /* #################### Rotas de Companies e Branches ########################## */
    /* ############################################################################# */
    Route::prefix('/company/{company}/branch/{branch}')->group(function () {

        Route::get('/', [ItemsController::class, 'index']);

        Route::get('/operating-period', [OperatingPeriodController::class, 'index']);
        Route::get('/menu-cloning', [MenuCloningController::class, 'index']);
        Route::get('/integrations', [IntegrationsController::class, 'index']);

        Route::prefix('operational-status')->group(function () {
            Route::get('/stores', [OperationalStatusController::class, 'index']);
            Route::get('/menu', [OperationalStatusController::class, 'menu']);
            Route::get('/totem', [OperationalStatusController::class, 'totem']);
        });


        Route::prefix('products-categories')->group(function () {
            Route::get('/', [ItemsController::class, 'categories']);
            Route::get('/{category}', [ItemsController::class, 'category_products']);
            Route::get('/sort-items/{category}', [ItemsController::class, 'sort_category_products']);
        });

        Route::prefix('complements-categories')->group(function () {
            Route::get('/', [ItemsController::class, 'complements']);
            Route::get('/{complement}', [ItemsController::class, 'complement_products']);
            Route::get('/sort-items/{complement}', [ItemsController::class, 'sort_complement_products']);
        });

        Route::get('/order-panel', [ItemsController::class, 'order_panel']);
    });
});

require __DIR__.'/auth.php';
