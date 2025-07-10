<?php

namespace App\Http\Controllers;

use App\Models\CalorieEntry;
use App\Models\Food;
use App\Models\UserFavoriteFood;
use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $today = Carbon::today();

        // Get user profile for calorie target
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $calorieTarget = $userProfile ? $userProfile->daily_calorie_target : 2000;

        // Get today's consumed calories
        $todayCalories = CalorieEntry::where('user_id', $user->id)
            ->whereDate('entry_date', $today)
            ->sum('calorie_amount');

        // Get today's food entries
        $todayFoods = CalorieEntry::with('food')
            ->where('user_id', $user->id)
            ->whereDate('entry_date', $today)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'name' => $entry->food->name,
                    'calories' => $entry->calorie_amount,
                    'portion' => $entry->portion,
                    'image' => null, // No image in basic structure
                    'time' => $entry->created_at->format('H:i'),
                ];
            });

        return Inertia::render('Home/HomePage', [
            'user' => [
                'name' => $user->name,
                'greeting' => $this->getGreeting(),
            ],
            'calories' => [
                'consumed' => $todayCalories,
                'target' => $calorieTarget,
                'percentage' => $calorieTarget > 0 ? round(($todayCalories / $calorieTarget) * 100, 1) : 0,
            ],
            'todayFoods' => $todayFoods,
        ]);
    }

    /**
     * Get greeting based on time of day.
     */
    private function getGreeting(): string
    {
        $hour = Carbon::now()->hour;

        if ($hour < 12) {
            return 'Selamat Pagi';
        } elseif ($hour < 15) {
            return 'Selamat Siang';
        } elseif ($hour < 18) {
            return 'Selamat Sore';
        } else {
            return 'Selamat Malam';
        }
    }
}
