<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'sales_price',
        'images',         
        'search_tags',    
        'vibe_keywords',
        'category',
        'subcategory'   
    ];

    protected $casts = [
        'images' => 'array',
        'search_tags' => 'array',
        'vibe_keywords' => 'array',
    ];
}