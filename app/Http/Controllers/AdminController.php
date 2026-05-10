<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Seller;
use App\Models\Product; // Idinagdag ito
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'users' => User::orderBy('id', 'asc')->paginate(10)->onEachSide(1),
            
            'allProducts' => Product::with('sellers')->latest()->get() 
        ]);
    }

    
    public function create()
    {
        return Inertia::render('Admin/Create');
    }
    public function show(User $user)
    {
        return Inertia::render('Admin/Show', [
            'user' => $user
        ]);
    }
    public function edit(User $user)
    {
        return Inertia::render('Admin/Edit', [
            'user' => $user
        ]);
    }
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:1|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:user,seller,admin',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('admin.index')->with('success', 'User updated successfully.');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:1|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,seller,admin',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.index')->with('success', 'User created successfully.');
    }
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();
        return redirect()->route('admin.index')->with('success', 'User deleted successfully.');
    }

    public function sellerRequests()
    {
        $requests = Seller::with('user')
            ->where('is_approved', false)
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Admin/SellerRequests', [
            'requests' => $requests
        ]);
    }

    public function approveSeller(Request $request, Seller $seller)
    {
        $seller->update(['is_approved' => true]);
        $seller->user->update(['role' => 'seller']);
        return redirect()->back()->with('success', 'Seller request approved successfully.');
    }
}