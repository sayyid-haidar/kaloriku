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
                    'calories' => $favorite->food->default_calorie,
                    'image' => null, // No image in basic structure
                    'favorite_id' => $favorite->id,
                ];
            });

        return Inertia::render('FavoriteFood/FavoritePage', [
            'favoriteFoods' => $favoriteFoods,
        ]);
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
