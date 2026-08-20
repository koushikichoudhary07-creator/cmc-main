<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BagController extends Controller
{
    // Display the bag page
    public function index(Request $request)
    {
        return Inertia::render('Bag', [
            'bagItems' => $request->user()->bagItems()->get()
        ]);
    }

    //Add product to bag
    public function add(Request $request, Product $product)
    {
        $user = $request->user();
        $existingItem = $user->bagItems()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $newQuantity = $existingItem->pivot->quantity + 1;
            $user->bagItems()->updateExistingPivot($product->id, ['quantity' => $newQuantity]);
        } else {
            $user->bagItems()->attach($product->id, ['quantity' => 1]);
        }

        return back();
    }

    //Update quantity of bag
    public function updateQuantity(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        if ($validated['quantity'] <= 0) {
            $user->bagItems()->detach($product->id);
        } else {
            $user->bagItems()->updateExistingPivot($product->id, [
                'quantity' => $validated['quantity']
            ]);
        }

        return back();
    }

    //Delete product from bag
    public function remove(Request $request, Product $product)
    {
        $request->user()->bagItems()->detach($product->id);

        return back();
    }
}