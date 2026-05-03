<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $seller = Seller::where('user_id', Auth::id())->firstOrFail();
        
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

        $seller = Seller::where('user_id', Auth::id())->firstOrFail();

        // Create the base product
        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
        ]);

        // Attach to seller with pivot data
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
        $seller = Seller::where('user_id', Auth::id())->firstOrFail();
        
        // Ensure the product belongs to this seller
        if (!$seller->products()->where('product_id', $product->id)->exists()) {
            abort(403, 'Unauthorized access');
        }

        // Get pivot data
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $seller = Seller::where('user_id', Auth::id())->firstOrFail();

        // Ensure the product belongs to this seller
        if (!$seller->products()->where('product_id', $product->id)->exists()) {
            abort(403, 'Unauthorized access');
        }

        // Update base product
        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
        ]);

        // Update pivot table
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
        $seller = Seller::where('user_id', Auth::id())->firstOrFail();

        // Ensure the product belongs to this seller
        if (!$seller->products()->where('product_id', $product->id)->exists()) {
            abort(403, 'Unauthorized access');
        }

        // The product delete will cascade and delete the sellerproduct relation automatically
        $product->delete();

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
