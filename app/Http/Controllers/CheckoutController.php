<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page.
     */
    public function index()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cartItems = array_values($cart);
        $total = collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);

        return Inertia::render('User/Checkout', [
            'cartItems' => $cartItems,
            'total'     => round($total, 2),
        ]);
    }

    /**
     * Place the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'address'        => 'required|string|max:500',
            'payment_method' => 'required|string|in:cod,gcash,bank',
        ]);

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cartItems = array_values($cart);
        $total = collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);

        DB::transaction(function () use ($cartItems, $total, $request) {
            // Group by seller; create one order per seller (or one order total)
            // Using first seller for simplicity
            $sellerId = $cartItems[0]['seller_id'] ?? null;

            $order = Order::create([
                'user_id'      => Auth::id(),
                'seller_id'    => $sellerId,
                'product_name' => collect($cartItems)->pluck('name')->implode(', '),
                'total_price'  => round($total, 2),
                'status'       => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);

                // Reduce stock
                $itemSellerId = $item['seller_id'] ?? $sellerId;
                if ($itemSellerId) {
                    DB::table('sellerproduct')
                        ->where('seller_id', $itemSellerId)
                        ->where('product_id', $item['product_id'])
                        ->decrement('stock', $item['quantity']);
                }
            }
        });

        session()->forget('cart');

        return redirect()->route('order.success')->with('success', 'Order placed successfully!');
    }
}
