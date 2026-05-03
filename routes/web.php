<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.index');
        }

        $sellerStats = null;
        if ($user->role === 'seller') {
            $seller = App\Models\Seller::where('user_id', $user->id)->first();
            if ($seller) {
                $sellerStats = [
                    'total_orders' => $seller->orders()->count(),
                    'stocks_available' => $seller->products()->sum('sellerproduct.stock'),
                    'orders_scheduled' => $seller->orders()->where('status', 'scheduled_for_ship_out')->count(),
                ];
            }
        }

        return Inertia::render('User/Dashboard', [
            'sellerStats' => $sellerStats
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Seller Registration Routes
    Route::get('/seller/create', [SellerController::class, 'create'])->name('seller.create');
    Route::post('/seller', [SellerController::class, 'store'])->name('seller.store');

    // Admin Routes
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.index');

        // Admin user management - points to AdminController
        Route::get('/admin/users/create', [AdminController::class, 'create'])->name('users.create');
        Route::post('/admin/users', [AdminController::class, 'store'])->name('users.store');
        Route::delete('/admin/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');

        Route::resource('/admin/sellers', SellerController::class);
    });
});

require __DIR__ . '/auth.php';
