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

        $products = collect();

        if ($query) {
            $words = array_filter(explode(' ', strtolower(trim($query))));

            // Fetch all candidate products that loosely match any word
            // (broad net first, then score and filter in PHP for accuracy)
            $candidates = Product::query()
                ->where(function ($queryBuilder) use ($words) {
                    foreach ($words as $word) {
                        $queryBuilder->where(function ($q) use ($word) {
                            $q->where('name', 'like', '%' . $word . '%')
                              ->orWhere('description', 'like', '%' . $word . '%')
                              ->orWhere('search_tags', 'like', '%' . $word . '%');
                        });
                    }
                })
                ->get();

            $fullQuery = strtolower(trim($query));

            // Score each product for relevance with word-boundary awareness
            $products = $candidates->map(function ($product) use ($words, $fullQuery) {
                $score = 0;
                $name = strtolower($product->name);
                $description = strtolower($product->description ?? '');
                $tags = is_array($product->search_tags)
                    ? array_map('strtolower', $product->search_tags)
                    : [];

                // --- Exact full-query matches (highest priority) ---
                if (str_contains($name, $fullQuery)) {
                    $score += 100;
                }
                if (in_array($fullQuery, $tags)) {
                    $score += 80;
                }

                // --- Per-word scoring ---
                foreach ($words as $word) {
                    $wordRegex = '/\b' . preg_quote($word, '/') . '\b/i';

                    // Whole-word match in name (strong signal)
                    if (preg_match($wordRegex, $name)) {
                        $score += 30;
                    }
                    // Substring-only match in name (weak signal)
                    elseif (str_contains($name, $word)) {
                        $score += 5;
                    }

                    // Exact tag match (strong signal — tags are curated)
                    if (in_array($word, $tags)) {
                        $score += 25;
                    } else {
                        // Check if word appears as whole word in any tag
                        $tagMatch = false;
                        foreach ($tags as $tag) {
                            if (preg_match($wordRegex, $tag)) {
                                $score += 15;
                                $tagMatch = true;
                                break;
                            }
                        }
                        // Substring in tags (very weak — "red" in "tired")
                        if (!$tagMatch) {
                            foreach ($tags as $tag) {
                                if (str_contains($tag, $word)) {
                                    $score += 1;
                                    break;
                                }
                            }
                        }
                    }

                    // Whole-word match in description
                    if (preg_match($wordRegex, $description)) {
                        $score += 10;
                    }
                }

                $product->relevance_score = $score;
                return $product;
            })
            // Filter out low-relevance noise (substring-only matches)
            ->filter(fn ($p) => $p->relevance_score >= 20)
            ->sortByDesc('relevance_score')
            ->values();
        }

        return Inertia::render('Search', [
            'products' => $products,
            'searchQuery' => $query
        ]);
    }
}