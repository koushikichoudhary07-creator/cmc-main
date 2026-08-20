<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Razorpay\Api\Api;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $bagItems = $request->user()->bagItems()->get();

        // Prevent checkout if the bag is empty
        if ($bagItems->isEmpty()) {
            return redirect()->route('bag.index');
        }

        return Inertia::render('Checkout/Index', [
            'bagItems' => $bagItems,
            'addresses' => $request->user()->addresses()->latest()->get(),
        ]);
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    public function createRazorpayOrder(Request $request)
    {
        $bagItems = $request->user()->bagItems()->get();

        // Calculate order total
        $subtotal = $bagItems->sum(function ($item) {
            return ($item->sales_price ?: $item->price) * $item->pivot->quantity;
        });

        $shipping = 50;
        $total = $subtotal + $shipping;

        // Create Razorpay order
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        $orderData = [
            'receipt' => 'rcptid_' . time(),
            'amount' => $total * 100, // Amount in paise
            'currency' => 'INR',
        ];

        $razorpayOrder = $api->order->create($orderData);

        return response()->json([
            'order_id' => $razorpayOrder['id'],
            'amount' => $orderData['amount'],
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            // Verify Razorpay payment signature
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
            ]);

            $user = $request->user();

            // Save or update the delivery address
            $user->addresses()->updateOrCreate(
                ['phone' => $request->phone],
                [
                    'full_name' => $request->full_name,
                    'address' => $request->address,
                    'city' => $request->city,
                    'postal_code' => $request->postal_code,
                ]
            );

            // Calculate final order amount
            $bagItems = $user->bagItems;

            $subtotal = $bagItems->sum(function ($item) {
                return ($item->sales_price ?: $item->price) * $item->pivot->quantity;
            });

            $totalAmount = $subtotal + 50;

            // Store order details
            $user->orders()->create([
                'order_id' => $request->razorpay_order_id,
                'payment_id' => $request->razorpay_payment_id,
                'total_amount' => $totalAmount,
                'status' => 'Paid',
            ]);

            // Empty the user's bag
            $user->bagItems()->detach();

            return redirect()->route('checkout.success');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Payment verification failed.',
            ]);
        }
    }
}