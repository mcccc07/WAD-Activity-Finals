<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
   
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }

        return null;
    }

    
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }

   
    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }
}