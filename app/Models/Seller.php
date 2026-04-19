<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'seller_product')
            ->withPivot('stock', 'price')
            ->withTimestamps();
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Product::class);
    }
}
