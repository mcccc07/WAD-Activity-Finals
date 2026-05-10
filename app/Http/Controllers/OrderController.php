<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product.reviews' => function($query) {
            $query->where('user_id', Auth::id());
        }, 'seller'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('User/Orders', [
            'orders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:packing,in_delivery,out_for_delivery,delivered',
        ]);

        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function confirmDelivery(Request $request, Order $order)
    {
        // Only the user who owns the order can confirm delivery
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->update(['status' => 'delivered']);

        return redirect()->back()->with('success', 'Order delivery confirmed.');
    }
}
