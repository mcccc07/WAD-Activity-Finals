<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'order';

    public function seller(){
        return $this->belongsTo(Seller::class);
    }
    public function items(){
        return $this->hasMany(OrderItem::class);
    }
}
