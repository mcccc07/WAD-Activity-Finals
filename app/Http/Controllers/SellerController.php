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
            'shop_name' => 'required|string|max:255',
            'shop_description' => 'nullable|string',
        ]);
        
        $user = Auth::user();
        $validate['user_id'] = $user->id;
        
        Seller::create($validate);
        
        $user->update(['role' => 'seller']);
        
        return redirect()->route('dashboard')->with('success', 'Seller profile created successfully.');
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
