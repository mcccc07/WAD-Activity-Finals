<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';

    protected $fillable = ['name', 'price', 'category_id'];

    public function sellers()
    {
        return $this->belongsToMany(Seller::class, 'sellerproduct')
            ->withPivot('stock', 'price')
            ->withTimestamps();
    }
    public function orders()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
