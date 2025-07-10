<?php

namespace App\Http\Controllers;

use App\Models\CalorieEntry;
use App\Models\Food;
use App\Models\UserFavoriteFood;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CalorieEntryController extends Controller
{
    /**
     * Show the add food form.
     */
    public function create(): Response
    {
        $user = Auth::user();

        // Get available foods
        $foods = Food::select('id', 'name', 'default_calorie')
            ->orderBy('name')
            ->get()
            ->map(function ($food) {
                return [
                    'id' => $food->id,
                    'name' => $food->name,
                    'calories' => $food->default_calorie,
                    'image' => null, // No image in basic structure
                ];
            });

        // Get favorite foods
        $favoriteFoods = UserFavoriteFood::with('food')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($favorite) {
                return [
                    'id' => $favorite->food->id,
                    'name' => $favorite->food->name,
                    'calories' => $favorite->food->default_calorie,
                    'image' => null, // No image in basic structure
                ];
            });

        return Inertia::render('CalorieEntry/AddFoodPage', [
            'foods' => $foods,
            'favoriteFoods' => $favoriteFoods,
        ]);
    }

    /**
     * Store a new calorie entry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
            'portion' => 'required|numeric|min:0.1',
            'entry_date' => 'nullable|date',
        ]);

        $food = Food::findOrFail($validated['food_id']);

        // Calculate calories based on portion (default_calorie is per serving)
        $calories = $food->default_calorie * $validated['portion'];

        CalorieEntry::create([
            'user_id' => Auth::id(),
            'food_id' => $validated['food_id'],
            'portion' => $validated['portion'],
            'calorie_amount' => round($calories),
            'entry_date' => $validated['entry_date'] ?? now()->toDateString(),
        ]);

        return redirect()->route('home')->with('success', 'Makanan berhasil ditambahkan!');
    }

    /**
     * Add food to favorites.
     */
    public function addToFavorites(Request $request)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
        ]);

        UserFavoriteFood::firstOrCreate([
            'user_id' => Auth::id(),
            'food_id' => $validated['food_id'],
        ]);

        return back()->with('success', 'Makanan ditambahkan ke favorit!');
    }

    /**
     * Remove food from favorites.
     */
    public function removeFromFavorites(Request $request)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
        ]);

        UserFavoriteFood::where('user_id', Auth::id())
            ->where('food_id', $validated['food_id'])
            ->delete();

        return back()->with('success', 'Makanan dihapus dari favorit!');
    }
}
