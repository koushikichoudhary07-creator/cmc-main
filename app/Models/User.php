<?php

namespace App\Models;

//use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    /**
     * Get the products in the user's wishlist.
     */
    public function wishlistItems(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'wishlists', 'user_id', 'product_id');
    }

    /**
     * Get the products in the user's shopping bag/cart.
     */
    public function bagItems(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'bag_items', 'user_id', 'product_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
    // Get the saved user address
    public function addresses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}

