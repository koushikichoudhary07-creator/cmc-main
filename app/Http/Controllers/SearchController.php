<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q');

        $products = Product::query()
            ->when($query, function ($queryBuilder) use ($query) {
                // Break the search query 
                $words = array_filter(explode(' ', $query));

                // Group OR conditions for search entry
                foreach ($words as $word) {
                    $queryBuilder->where(function ($q) use ($word) {
                        $q->where('search_tags', 'like', '%' . $word . '%')
                          ->orWhere('name', 'like', '%' . $word . '%')
                          ->orWhere('description', 'like', '%' . $word . '%');
                    });
                }
            })
            ->get();

        return Inertia::render('Search', [
            'products' => $products,
            'searchQuery' => $query
        ]);
    }
}