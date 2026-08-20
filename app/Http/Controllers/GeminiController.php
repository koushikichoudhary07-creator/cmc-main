<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\Product; 
use Gemini\Data\Content;
use Gemini\Enums\Role;
class GeminiController extends Controller
{
   public function ask(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'history' => 'present|array', 
        ]);

        try {
            // Compact catalog cached for 1 hour — only first image, short keys
            // Guard: never cache an empty result (e.g. DB not ready yet)
            $products = Cache::remember('gemini_catalog', now()->addHours(1), function () {
                $rows = Product::select('name', 'price', 'sales_price', 'images', 'category', 'subcategory')
                    ->get();

                if ($rows->isEmpty()) {
                    // Returning null prevents Cache::remember from storing the value
                    return null;
                }

                return $rows->map(fn($p) => [
                    'name'  => $p->name,
                    'price' => $p->price,
                    'sale'  => $p->sales_price,
                    'cat'   => $p->category . '/' . $p->subcategory,
                    'img'   => $p->images[0] ?? null,
                ]);
            });

            // Grab the history — keep last 3 back and forth as context
            $history = $request->input('history', []); 
            $recentHistory = array_slice($history, -6);

            $systemInstruction = "You are Rachel, Cutie McPretty's shopping assistant (named after Rachel Green).
            Help customers find products, compare items, and answer questions.

            RULES:
            1. When recommending a product, use exactly this format for each product:
            - A brief description (10-15 words)
            - Then on a new line: [[EXACT PRODUCT NAME FROM CATALOG]]
            - Then the price details
            The product name inside [[ ]] must match exactly with a 'name' from the catalog.
            2. Never generate image URLs or markdown image syntax yourself.
            3. Never generate product links or show product IDs.
            4. Cannot add items to wishlist/checkout — say so if asked.
            5. Don't use terms of affection (sweetie, honey, etc).
            6. 'Bonus' section is now 'Gift Shop' — same products, new name.

            CATALOG:
            " . json_encode($products);

            $chatHistory = [];
            foreach ($recentHistory as $message) {
                $role = $message['role'] === 'user' ? Role::USER : Role::MODEL;
                $chatHistory[] = Content::parse($message['text'], $role);
            }

            $chat = Gemini::generativeModel('gemini-2.5-flash')
                ->withSystemInstruction(Content::parse($systemInstruction))
                ->startChat($chatHistory);

            $result = $chat->sendMessage($request->input('prompt'));
            $responseText = $result->text();

            // Post-process: replace [[Product Name]] markers with actual markdown images
            if ($products) {
                // Build a lookup map: lowercase product name => image path
                $imageMap = [];
                foreach ($products as $p) {
                    if (!empty($p['img'])) {
                        $imageMap[mb_strtolower($p['name'])] = $p['img'];
                    }
                }

                // Replace [[Product Name]] with ![Product Name](image_path)
                $responseText = preg_replace_callback(
                    '/\[\[(.+?)\]\]/',
                    function ($matches) use ($imageMap) {
                        $productName = trim($matches[1]);
                        $lookupKey = mb_strtolower($productName);

                        if (isset($imageMap[$lookupKey])) {
                            return '![' . $productName . '](' . $imageMap[$lookupKey] . ')';
                        }

                        // Fuzzy fallback: try partial match
                        foreach ($imageMap as $name => $img) {
                            if (str_contains($name, $lookupKey) || str_contains($lookupKey, $name)) {
                                return '![' . $productName . '](' . $img . ')';
                            }
                        }

                        // No match found — just return the name without brackets
                        return $productName;
                    },
                    $responseText
                );
            }

            return response()->json([
                'success' => true,
                'data' => $responseText
            ]);

        }  catch (\Exception $e) {
            //429 token exceeded error
            return response()->json([
                'success' => true, 
                'data' => "Oops, we have a lot of customers right now, I will be right back with you, feel free to browse the store in the meantime."
            ]);
        }
    }
}