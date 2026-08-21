<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        return Inertia::render('Dashboard', [
            'products' => $products
        ]);
    }

    public function show(Product $product)
    {
        // Fetch related products (e.g., from the same subcategory or category)
        $relatedProducts = Product::where('id', '!=', $product->id)
            ->where(function($query) use ($product) {
                $query->where('subcategory', $product->subcategory)
                      ->orWhere('category', $product->category);
            })
            ->inRandomOrder()
            ->take(5)
            ->get();

        return Inertia::render('Product/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }
}
