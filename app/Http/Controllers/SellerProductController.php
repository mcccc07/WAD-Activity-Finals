<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate; 
use Inertia\Inertia;

class SellerProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $seller = Seller::where('user_id', Auth::id())->first();
        
        if (!$seller) {
            return redirect()->route('seller.create')->with('error', 'Please create your seller profile first to start adding products.');
        }

        $products = $seller->products()->latest()->paginate(10);
        
        return Inertia::render('Seller/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Seller/Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $seller = Seller::where('user_id', Auth::id())->first();
        if (!$seller) {
            return redirect()->route('seller.create')->with('error', 'Please create your seller profile first.');
        }

        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'user_id' => Auth::id(), 
        ]);

        $seller->products()->attach($product->id, [
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
       
        Gate::authorize('update', $product);

        $seller = Seller::where('user_id', Auth::id())->first();
        if (!$seller) {
            return redirect()->route('seller.create');
        }

        $productWithPivot = $seller->products()->where('product_id', $product->id)->first();

        return Inertia::render('Seller/Products/Edit', [
            'product' => $productWithPivot
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        
        Gate::authorize('update', $product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $seller = Seller::where('user_id', Auth::id())->first();
        
        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
        ]);

        $seller->products()->updateExistingPivot($product->id, [
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        
        Gate::authorize('delete', $product);

        $product->delete();

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}