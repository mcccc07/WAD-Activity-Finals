<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'users' => User::orderBy('id', 'asc')->paginate(10)
        ]);
    }
    public function create()
    {
        return Inertia::render('Admin/Create');
    }
    public function edit()
    {
        return Inertia::render('Admin/Edit');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:1|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,admin',
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
}
