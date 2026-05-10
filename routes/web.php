<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\SellerProductController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Settings\ProfileController as SettingsProfileController;
use App\Http\Controllers\Settings\PasswordController as SettingsPasswordController;
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

// Public products listing (no auth required)
Route::get('/products', function () {
    $products = App\Models\Product::with('sellers')
        ->whereHas('sellers')
        ->latest()
        ->get()
        ->map(function ($product) {
            $seller = $product->sellers->first();
            return [
                'id'       => $product->id,
                'name'     => $product->name,
                'price'    => $seller?->pivot->price ?? $product->price,
                'stock'    => $seller?->pivot->stock ?? 0,
                'seller'   => $seller?->shop_name ?? 'Unknown Seller',
                'category' => $product->category_id,
            ];
        });
    return response()->json($products);
})->name('products.public');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.index');
        }

        $sellerStats = null;
        $sellerProducts = null;
        $sellerOrders = null;
        $availableProducts = null;

        if ($user->role === 'seller') {
            $seller = App\Models\Seller::where('user_id', $user->id)->first();
            if ($seller) {
                $sellerStats = [
                    'total_orders' => $seller->orders()->count(),
                    'stocks_available' => $seller->products()->sum('sellerproduct.stock'),
                    'orders_scheduled' => $seller->orders()->where('status', 'scheduled_for_ship_out')->count(),
                ];
                $sellerProducts = $seller->products()->take(5)->get();
                $sellerOrders = $seller->orders()->with('user')->latest()->take(10)->get();
            }
        } else if ($user->role === 'user') {
            $availableProducts = App\Models\Product::with(['sellers', 'reviews'])
                ->whereHas('sellers')
                ->latest()
                ->get()
                ->map(function ($product) use ($user) {
                    $seller = $product->sellers->first();
                    $userReview = $product->reviews->firstWhere('user_id', $user->id);
                    return [
                        'id'          => $product->id,
                        'name'        => $product->name,
                        'sellers'     => $product->sellers,
                        'avg_rating'  => $product->reviews->avg('rating'),
                        'review_count'=> $product->reviews->count(),
                        'user_review' => $userReview ? ['rating' => $userReview->rating, 'comment' => $userReview->comment] : null,
                    ];
                });
        }

        return Inertia::render('User/Dashboard', [
            'sellerStats' => $sellerStats,
            'sellerProducts' => $sellerProducts,
            'sellerOrders' => $sellerOrders,
            'availableProducts' => $availableProducts
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Settings Routes
    Route::get('/settings/profile', [SettingsProfileController::class, 'edit'])->name('settings.profile.edit');
    Route::patch('/settings/profile', [SettingsProfileController::class, 'update'])->name('settings.profile.update');
    Route::delete('/settings/profile', [SettingsProfileController::class, 'destroy'])->name('settings.profile.destroy');

    Route::get('/settings/password', [SettingsPasswordController::class, 'edit'])->name('settings.password.edit');
    Route::put('/settings/password', [SettingsPasswordController::class, 'update'])->name('settings.password.update');

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{productId}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{productId}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

    // Checkout Routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/order/success', function () {
        return Inertia::render('User/OrderSuccess');
    })->name('order.success');

    // Review Route
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Order Routes
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{order}/confirm-delivery', [App\Http\Controllers\OrderController::class, 'confirmDelivery'])->name('orders.confirm_delivery');
    Route::patch('/orders/{order}/status', [App\Http\Controllers\OrderController::class, 'updateStatus'])->name('orders.update_status');

    // Seller Registration Routes
    Route::get('/seller/create', [SellerController::class, 'create'])->name('seller.create');
    Route::post('/seller', [SellerController::class, 'store'])->name('seller.store');

    // Seller Products Routes
    Route::resource('/seller/products', SellerProductController::class)->names([
        'index' => 'seller.products.index',
        'create' => 'seller.products.create',
        'store' => 'seller.products.store',
        'edit' => 'seller.products.edit',
        'update' => 'seller.products.update',
        'destroy' => 'seller.products.destroy',
    ]);

    // Admin Routes
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.index');
        Route::get('/admin/seller-requests', [AdminController::class, 'sellerRequests'])->name('admin.seller_requests');
        Route::patch('/admin/seller-requests/{seller}/approve', [AdminController::class, 'approveSeller'])->name('admin.approve_seller');

        // Admin user management - points to AdminController
        Route::get('/admin/users/create', [AdminController::class, 'create'])->name('users.create');
        Route::post('/admin/users', [AdminController::class, 'store'])->name('users.store');
        Route::get('/admin/users/{user}', [AdminController::class, 'show'])->name('users.show');
        Route::get('/admin/users/{user}/edit', [AdminController::class, 'edit'])->name('users.edit');
        Route::put('/admin/users/{user}', [AdminController::class, 'update'])->name('users.update');
        Route::delete('/admin/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');

        Route::resource('/admin/sellers', SellerController::class);
    });
});

require __DIR__ . '/auth.php';
