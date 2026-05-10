<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $fillable = [
        'user_id',
        'shop_name',
        'shop_description',
        'shop_logo',
        'status',
        'is_approved',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'sellerproduct')
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
