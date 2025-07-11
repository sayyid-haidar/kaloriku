<?php

namespace App\Http\Controllers;

use App\Models\UserFavoriteFood;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteFoodController extends Controller
{
    /**
     * Display favorite foods.
     */
    public function index(): Response
    {
        $favoriteFoods = UserFavoriteFood::with('food')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($favorite) {
                return [
                    'id' => $favorite->food->id,
                    'name' => $favorite->food->name,
                    'calories' => $favorite->food->calories_per_100g ?? 100,
                    'calories_per_100g' => $favorite->food->calories_per_100g ?? 100,
                    'brand' => $favorite->food->brand ?? null,
                    'image' => null, // No image in basic structure
                    'favorite_id' => $favorite->id,
                ];
            });

        return Inertia::render('FavoriteFood/FavoritePage', [
            'favoriteFoods' => $favoriteFoods,
        ]);
    }

    /**
     * Add food to favorites.
     */
    public function store(Request $request)
    {
        $request->validate([
            'food_id' => 'sometimes|exists:foods,id',
            'food_name' => 'required_without:food_id|string|max:255',
            'calories_per_100g' => 'required_without:food_id|numeric|min:1',
            'brand' => 'nullable|string|max:255'
        ]);

        $userId = Auth::id();

        if ($request->has('food_id')) {
            // Adding existing food to favorites
            UserFavoriteFood::firstOrCreate([
                'user_id' => $userId,
                'food_id' => $request->food_id,
            ]);
        } else {
            // Create new food and add to favorites
            $food = \App\Models\Food::firstOrCreate([
                'name' => $request->food_name,
                'calories_per_100g' => $request->calories_per_100g,
                'brand' => $request->brand ?? null,
            ]);

            UserFavoriteFood::firstOrCreate([
                'user_id' => $userId,
                'food_id' => $food->id,
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Makanan berhasil ditambahkan ke favorit!']);
        }

        return back()->with('success', 'Makanan ditambahkan ke favorit!');
    }

    /**
     * Remove food from favorites.
     */
    public function destroy($id)
    {
        UserFavoriteFood::where('user_id', Auth::id())
            ->where('food_id', $id)
            ->delete();

        return back()->with('success', 'Makanan dihapus dari favorit!');
    }
}
