<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    
    protected $table = 'product';

    protected $fillable = [
        'name',
        'price',
        'user_id',
    ];

    public function sellers()
    {
        
        return $this->belongsToMany(Seller::class, 'sellerproduct')
                    ->withPivot('price', 'stock')
                    ->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}