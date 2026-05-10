<?php

namespace App\Policies;

use App\Models\Seller;
use App\Models\User;

class SellerPolicy
{
    
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

  
    public function view(User $user, Seller $seller): bool
    {
        return $user->id === $seller->user_id;
    }
}


