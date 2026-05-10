<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate; // Idinagdag ito
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index()
    {
        // Check Gate: Admin lang ang pwedeng makakita ng listahan ng lahat ng sellers
        Gate::authorize('isAdmin');

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
        
        return redirect()->route('dashboard')->with('success', 'Your request to become a seller has been submitted and is pending admin approval.');
    }

    public function show(Seller $seller)
    {
        // Gagamit na tayo ng Policy rito imbes na manual na 'if'
        Gate::authorize('view', $seller);

        $seller->load(['products', 'orders.items']);

        return Inertia::render('Seller/Show', [
            'seller' => $seller,
            'products' => $seller->products,
            'orders' => $seller->orders,
        ]);
    }
}