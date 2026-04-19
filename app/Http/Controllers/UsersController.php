<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Dashboard', [
            'products' => Product::latest()->paginate(5)
        ]);
    }

    public function createProfile(Request $request)
    {
        return Inertia::render('User/Profile', [
            'seller' => $request->user()->seller
        ]);
    }

    public function browse()
    {
        $product = Product::with('sellers')->latest()->paginate(10);

        return Inertia::render('User/Products', [
            'product' => $product
        ]);
    }
}
