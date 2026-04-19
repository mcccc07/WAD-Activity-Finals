<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use App\Models\Seller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/Index', [
            'sellers' => Seller::latest()->paginate(10)
        ]);
    }
    public function create()
    {
        return Inertia::render('Seller/Create');
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);
        Seller::create($validate);
        return redirect()->route('seller.index');
    }

    public function show(Seller $seller)
    {
        if (Auth::id() !== $seller->user_id) {
            abort(403, 'Unauthorized access');
        }
        $seller->load(['products', 'orders.items']);

        return Inertia::render('Seller/Show', [
            'seller' => $seller,
            'products' => $seller->products,
            'orders' => $seller->orders,
        ]);
    }
}
