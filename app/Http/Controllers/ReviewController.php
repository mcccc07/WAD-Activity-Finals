<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new review for a product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:product,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        // Check if user already reviewed this product — update if so
        $existing = Review::where('product_id', $request->product_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existing) {
            $existing->update([
                'rating'  => $request->rating,
                'comment' => $request->comment,
            ]);
        } else {
            Review::create([
                'product_id' => $request->product_id,
                'user_id'    => Auth::id(),
                'rating'     => $request->rating,
                'comment'    => $request->comment,
            ]);
        }

        return back()->with('success', 'Review submitted!');
    }
}
