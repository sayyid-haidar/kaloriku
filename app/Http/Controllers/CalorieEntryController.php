<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManageFavoriteRequest;
use App\Http\Requests\StoreCalorieEntryRequest;
use App\Models\CalorieEntry;
use App\Models\Food;
use App\Models\UserFavoriteFood;
use App\Models\UserProfile;
use App\Services\CalorieCalculatorService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CalorieEntryController extends Controller
{    /**
     * Show the simple add food form.
     */
    public function create(): Response
    {
        $user = Auth::user();

        try {
            // Get user profile for calorie target
            $userProfile = UserProfile::where('user_id', $user->id)->first();
            $calorieTarget = $userProfile ? $userProfile->daily_calorie_target : 2000;

            // Get today's consumed calories
            $todayTotal = CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', now()->toDateString())
                ->sum('calories');

            // Get recent foods for suggestions
            $recentFoods = CalorieEntry::where('user_id', $user->id)
                ->select('food_name', 'calories', 'notes')
                ->whereNotNull('food_name')
                ->groupBy('food_name', 'calories', 'notes')
                ->orderByRaw('MAX(created_at) DESC')
                ->limit(5)
                ->get()
                ->map(function ($entry) {
                    return [
                        'name' => $entry->food_name,
                        'calories' => $entry->calories,
                        'notes' => $entry->notes,
                    ];
                });

            // Get verified foods from database (optional)
            $verifiedFoods = Food::verified()
                ->select('id', 'name', 'calories_per_100g', 'brand', 'tags')
                ->orderBy('name')
                ->limit(20)
                ->get()
                ->map(function ($food) {
                    return [
                        'id' => $food->id,
                        'name' => $food->name,
                        'calories_per_100g' => $food->calories_per_100g,
                        'brand' => $food->brand,
                        'tags' => $food->tags,
                    ];
                });

            // Get user's favorite foods
            $favoriteFoods = UserFavoriteFood::with('food:id,name,calories_per_100g,brand')
                ->where('user_id', $user->id)
                ->get()
                ->map(function ($favorite) {
                    return [
                        'id' => $favorite->food->id,
                        'name' => $favorite->food->name,
                        'calories_per_100g' => $favorite->food->calories_per_100g,
                        'brand' => $favorite->food->brand,
                    ];
                });

            return Inertia::render('CalorieEntry/SimpleAddPage', [
                'recentFoods' => $recentFoods,
                'verifiedFoods' => $verifiedFoods,
                'favoriteFoods' => $favoriteFoods,
                'todayTotal' => (float) $todayTotal,
                'calorieTarget' => $calorieTarget,
                'userProfile' => $userProfile,
                'maxDate' => now()->toDateString(),
                'minDate' => now()->subYears(1)->toDateString(),
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading simple add page: ' . $e->getMessage());

            return Inertia::render('CalorieEntry/SimpleAddPage', [
                'recentFoods' => collect([]),
                'verifiedFoods' => collect([]),
                'favoriteFoods' => collect([]),
                'todayTotal' => 0,
                'calorieTarget' => 2000,
                'userProfile' => null,
                'maxDate' => now()->toDateString(),
                'minDate' => now()->subYears(1)->toDateString(),
                'error' => 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
            ]);
        }
    }

    /**
     * Store a new calorie entry.
     */
    public function store(StoreCalorieEntryRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            $food = Food::findOrFail($validated['food_id']);

            // Calculate calories using the service
            $calories = CalorieCalculatorService::calculateCalories($food, $validated['portion']);

            $calorieEntry = CalorieEntry::create([
                'user_id' => Auth::id(),
                'food_id' => $validated['food_id'],
                'food_name' => $food->name,
                'calories' => round($calories, 2),
                'entry_date' => $validated['entry_date'],
            ]);

            DB::commit();

            return redirect()->route('home')->with('success', 'Makanan berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error storing calorie entry: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->validated()
            ]);

            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'])
                        ->withInput();
        }
    }

    /**
     * Add food to favorites.
     */
    public function addToFavorites(ManageFavoriteRequest $request)
    {
        try {
            $validated = $request->validated();

            // Check if food exists
            $food = Food::findOrFail($validated['food_id']);

            // Use firstOrCreate to avoid duplicates
            $favorite = UserFavoriteFood::firstOrCreate([
                'user_id' => Auth::id(),
                'food_id' => $validated['food_id'],
            ]);

            $wasRecentlyCreated = $favorite->wasRecentlyCreated;

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $wasRecentlyCreated
                        ? 'Makanan ditambahkan ke favorit!'
                        : 'Makanan sudah ada di favorit!',
                    'data' => [
                        'food_id' => $food->id,
                        'food_name' => $food->name,
                        'is_favorite' => true,
                        'was_recently_created' => $wasRecentlyCreated
                    ]
                ]);
            }

            return back()->with('success', $wasRecentlyCreated
                ? 'Makanan ditambahkan ke favorit!'
                : 'Makanan sudah ada di favorit!');

        } catch (\Exception $e) {
            Log::error('Error adding food to favorites: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'food_id' => $request->input('food_id')
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan saat menambahkan ke favorit.',
                    'error' => app()->environment('local') ? $e->getMessage() : null
                ], 500);
            }

            return back()->withErrors(['error' => 'Terjadi kesalahan saat menambahkan ke favorit.']);
        }
    }

    /**
     * Remove food from favorites.
     */
    public function removeFromFavorites(ManageFavoriteRequest $request)
    {
        try {
            $validated = $request->validated();

            // Check if food exists
            $food = Food::findOrFail($validated['food_id']);

            $deleted = UserFavoriteFood::where('user_id', Auth::id())
                ->where('food_id', $validated['food_id'])
                ->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $deleted > 0
                        ? 'Makanan dihapus dari favorit!'
                        : 'Makanan tidak ada di favorit!',
                    'data' => [
                        'food_id' => $food->id,
                        'food_name' => $food->name,
                        'is_favorite' => false,
                        'was_deleted' => $deleted > 0
                    ]
                ]);
            }

            return back()->with('success', $deleted > 0
                ? 'Makanan dihapus dari favorit!'
                : 'Makanan tidak ada di favorit!');

        } catch (\Exception $e) {
            Log::error('Error removing food from favorites: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'food_id' => $request->input('food_id')
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan saat menghapus dari favorit.',
                    'error' => app()->environment('local') ? $e->getMessage() : null
                ], 500);
            }

            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus dari favorit.']);
        }
    }

    /**
     * Quick add food with free text entry.
     */
    public function quickAdd(Request $request)
    {
        Log::info('QuickAdd request received', [
            'user_id' => Auth::id(),
            'request_data' => $request->all()
        ]);

        $request->validate([
            'food_name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:1|max:99999',
            'notes' => 'nullable|string|max:500',
            'meal_type' => 'nullable|in:breakfast,lunch,dinner,snack',
            'entry_date' => 'nullable|date|before_or_equal:today'
        ], [
            'food_name.required' => 'Nama makanan harus diisi',
            'food_name.max' => 'Nama makanan maksimal 255 karakter',
            'calories.required' => 'Kalori harus diisi',
            'calories.numeric' => 'Kalori harus berupa angka',
            'calories.min' => 'Kalori minimal 1',
            'calories.max' => 'Kalori maksimal 99,999',
            'notes.max' => 'Catatan maksimal 500 karakter',
            'meal_type.in' => 'Jenis makanan tidak valid',
            'entry_date.date' => 'Format tanggal tidak valid',
            'entry_date.before_or_equal' => 'Tanggal tidak boleh di masa depan'
        ]);

        try {
            DB::beginTransaction();

            // Try to find existing food by name (case insensitive)
            $food = Food::where('name', 'like', trim($request->food_name))->first();

            // Create calorie entry
            $entry = CalorieEntry::create([
                'user_id' => Auth::id(),
                'food_name' => trim($request->food_name),
                'food_id' => $food?->id, // Link to food if exists
                'calories' => (float) $request->calories,
                'notes' => $request->notes,
                'entry_date' => $request->entry_date ?? now()->toDateString(),
                'entry_time' => now()->format('H:i'),
                'meal_type' => $request->meal_type,
            ]);

            // If food doesn't exist and calories seem reasonable, create a food record
            if (!$food && $request->calories <= 1000) { // Reasonable single food item
                $food = Food::create([
                    'name' => trim($request->food_name),
                    'calories_per_100g' => min($request->calories * 2, 900), // Estimate per 100g
                    'is_verified' => false,
                    'created_by_user_id' => Auth::id(),
                ]);

                // Update entry with food_id
                $entry->update(['food_id' => $food->id]);
            }

            DB::commit();

            // Get today's total calories
            $entryDate = $request->entry_date ?? now()->toDateString();
            $todayTotal = CalorieEntry::where('user_id', Auth::id())
                ->whereDate('entry_date', $entryDate)
                ->sum('calories');

            // Return success response
            return redirect()->back()->with('success', "✅ {$entry->food_name} ({$request->calories} kal) berhasil ditambahkan!");

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error in quick add: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan makanan. Silakan coba lagi.']);
        }
    }

    /**
     * Get recent foods for quick suggestions.
     */
    public function getRecentFoods(): JsonResponse
    {
        try {
            $recentFoods = CalorieEntry::where('user_id', Auth::id())
                ->select('food_name', 'calories', 'notes')
                ->whereNotNull('food_name')
                ->groupBy('food_name', 'calories', 'notes')
                ->orderByRaw('MAX(created_at) DESC')
                ->limit(10)
                ->get()
                ->map(function ($entry) {
                    return [
                        'name' => $entry->food_name,
                        'calories' => $entry->calories,
                        'notes' => $entry->notes,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentFoods
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting recent foods: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'data' => []
            ]);
        }
    }
}
