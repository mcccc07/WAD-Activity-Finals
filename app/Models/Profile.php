<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
