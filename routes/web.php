<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\BagController; 
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\GeminiController; 
use App\Models\Product; 
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Artisan;


//mixed content error
Route::get('/clear-cache', function () {
    Artisan::call('optimize:clear');
    return 'Cache cleared successfully!';
});

// STOREFRONT 
Route::get('/', function () {
    return Inertia::render('Storefront', [
        'saleProducts' => Product::whereNotNull('sales_price')->latest()->take(10)->get(),
        'newProducts' => Product::latest()->take(10)->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');
Route::post('/ask-gemini', [GeminiController::class, 'ask']);

// TRADITIONAL
Route::prefix('traditional')->group(function () {
    Route::get('/festive', function () {
        return Inertia::render('Traditional/Festive', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'festive')->latest()->get()
        ]);
    })->name('festive');

    Route::get('/classics', function () {
        return Inertia::render('Traditional/Classics', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'classics')->latest()->get()
        ]);
    })->name('classics');

    Route::get('/fusion', function () {
        return Inertia::render('Traditional/Fusion', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'fusion')->latest()->get()
        ]);
    })->name('fusion');
});


// WESTERN
Route::prefix('western')->group(function () {
    Route::get('/tops', function () {
        return Inertia::render('Western/Tops', [
            'products' => Product::where('category', 'western')->where('subcategory', 'tops')->latest()->get()
        ]);
    })->name('tops');

    Route::get('/dresses', function () {
        return Inertia::render('Western/Dresses', [
            'products' => Product::where('category', 'western')->where('subcategory', 'dresses')->latest()->get()
        ]);
    })->name('dresses');

    Route::get('/bottoms', function () {
        return Inertia::render('Western/Bottoms', [
            'products' => Product::where('category', 'western')->where('subcategory', 'bottoms')->latest()->get()
        ]);
    })->name('bottoms');
});


// ACCESSORIES
Route::prefix('accessories')->group(function () {
    Route::get('/purses', function () {
        return Inertia::render('Accessories/Purses', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'purses')->latest()->get()
        ]);
    })->name('purses');

    Route::get('/footwear', function () {
        return Inertia::render('Accessories/Footwear', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'footwear')->latest()->get()
        ]);
    })->name('footwear');

    Route::get('/scarves', function () {
        return Inertia::render('Accessories/Scarves', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'scarves')->latest()->get()
        ]);
    })->name('scarves');
});


// BONUS 
Route::get('/bonus', function () {
    return Inertia::render('Bonus', [
        'products' => Product::where('category', 'bonus')->latest()->get()
    ]);
})->name('bonus');


//WISHLIST 
Route::middleware('auth')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');

    //wishlist action
    Route::post('/wishlist/add/{product}', [WishlistController::class, 'toggle'])->name('wishlist.add');
});

//BAG 
Route::middleware('auth')->group(function () {
    Route::get('/bag', [BagController::class, 'index'])->name('bag.index');
    
    // bag actions
    Route::post('/bag/add/{product}', [BagController::class, 'add'])->name('bag.add');
    Route::patch('/bag/update/{product}', [BagController::class, 'updateQuantity'])->name('bag.update');
    Route::delete('/bag/remove/{product}', [BagController::class, 'remove'])->name('bag.remove');
});

//CHECKOUT 
Route::middleware('auth')->group(function () {
    
    // Checkout Route
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

    //Razorpay Route
    Route::post('/checkout/create-order', [CheckoutController::class, 'createRazorpayOrder'])->name('checkout.create');
    Route::post('/checkout/verify', [CheckoutController::class, 'verifyPayment'])->name('checkout.verify');
});

//SEARCHBAR
Route::get('/search', [SearchController::class, 'index'])->name('search.index');



// AUTHENTICATED USER ROUTES
Route::middleware(['auth', 'verified'])->group(function () {
    
    //Dashboard
    Route::get('/dashboard', function (Request $request) {
        return Inertia::render('Dashboard', [
            'addresses' => $request->user()->addresses()->get(),
            'orders' => $request->user()->orders()->latest()->get(), 
        ]);
    })->name('dashboard');

    //Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__.'/auth.php';