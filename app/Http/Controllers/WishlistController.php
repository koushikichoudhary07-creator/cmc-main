<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist page.
     */
    public function index(Request $request)
    {
        return Inertia::render('Wishlist', [
            // Fetch all products attached to the current user's wishlist
            'wishlistItems' => $request->user()->wishlistItems()->get()
        ]);
    }

    /**
     * Toggle a product inside the authenticated user's wishlist.
     */
    public function toggle(Request $request, Product $product)
    {
        $request->user()->wishlistItems()->toggle($product->id);
        return back();
    }
}