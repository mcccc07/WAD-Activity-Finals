<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index()
    {
        $cart = session()->get('cart', []);
        $cartItems = [];

        foreach ($cart as $productId => $item) {
            $cartItems[] = $item;
        }

        return Inertia::render('User/Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:product,id',
            'quantity'   => 'sometimes|integer|min:1',
        ]);

        $productId = $request->product_id;
        $quantity  = $request->quantity ?? 1;

        // Load product + first seller price/stock
        $product = Product::with('sellers')->findOrFail($productId);
        $seller  = $product->sellers->first();
        $price   = $seller?->pivot?->price ?? $product->price;
        $stock   = $seller?->pivot?->stock ?? 0;
        $sellerId = $seller?->id;

        if ($stock <= 0) {
            return back()->with('error', 'This product is out of stock.');
        }

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            $newQty = $cart[$productId]['quantity'] + $quantity;
            $cart[$productId]['quantity'] = min($newQty, $stock);
        } else {
            $cart[$productId] = [
                'product_id'  => $productId,
                'seller_id'   => $sellerId,
                'name'        => $product->name,
                'price'       => (float) $price,
                'quantity'    => min($quantity, $stock),
                'max_stock'   => $stock,
            ];
        }

        session()->put('cart', $cart);

        return back()->with('success', '"' . $product->name . '" added to cart!');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = min((int) $request->quantity, $cart[$productId]['max_stock']);
            session()->put('cart', $cart);
        }

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove a product from the cart.
     */
    public function destroy($productId)
    {
        $cart = session()->get('cart', []);
        unset($cart[$productId]);
        session()->put('cart', $cart);

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear the entire cart.
     */
    public function clear()
    {
        session()->forget('cart');
        return back()->with('success', 'Cart cleared.');
    }
}
