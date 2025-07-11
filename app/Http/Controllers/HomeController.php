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
            ->sum('calories');

        // Calculate percentage and status
        $caloriePercentage = $calorieTarget > 0 ? round(($todayCalories / $calorieTarget) * 100, 1) : 0;
        $remainingCalories = max(0, $calorieTarget - $todayCalories);
        $isOverTarget = $caloriePercentage > 100;

        // Get today's food entries grouped by meal type
        $todayFoods = CalorieEntry::with('food')
            ->where('user_id', $user->id)
            ->whereDate('entry_date', $today)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'name' => $entry->food_display_name, // Use accessor from model
                    'calories' => $entry->calories,
                    'notes' => $entry->notes,
                    'time' => $entry->created_at->format('H:i'),
                    'meal_type' => $entry->meal_type,
                ];
            });

        // Calculate calories by meal type
        $mealCalories = [
            'breakfast' => CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $today)
                ->where('meal_type', 'breakfast')
                ->sum('calories'),
            'lunch' => CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $today)
                ->where('meal_type', 'lunch')
                ->sum('calories'),
            'dinner' => CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $today)
                ->where('meal_type', 'dinner')
                ->sum('calories'),
            'snack' => CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $today)
                ->where('meal_type', 'snack')
                ->sum('calories'),
        ];

        // Get user's favorite foods for quick add
        $favoriteFoods = UserFavoriteFood::with('food:id,name,calories,brand')
            ->where('user_id', $user->id)
            ->limit(6)
            ->get()
            ->map(function ($favorite) {
                return [
                    'id' => $favorite->food->id,
                    'name' => $favorite->food->name,
                    'calories' => $favorite->food->calories,
                    'brand' => $favorite->food->brand,
                ];
            });

        // Get weekly streak
        $weeklyStreak = $this->calculateWeeklyStreak($user->id);

        // Get last 7 days for mini chart
        $weeklyData = $this->getWeeklyMiniData($user->id, $calorieTarget);

        // Check if user needs calorie warning
        $showCalorieWarning = false;
        $warningMessage = '';

        if ($isOverTarget) {
            $showCalorieWarning = true;
            $warningMessage = "Kamu sudah melebihi target kalori harian sebesar " .
                number_format($todayCalories - $calorieTarget) . " kalori.";
        } elseif ($caloriePercentage >= 90) {
            $showCalorieWarning = true;
            $warningMessage = "Kamu sudah mencapai {$caloriePercentage}% dari target kalori harian.";
        }

        return Inertia::render('Home/HomePage', [
            'user' => [
                'name' => $user->name,
                'greeting' => $this->getGreeting(),
            ],
            'calories' => [
                'consumed' => $todayCalories,
                'target' => $calorieTarget,
                'percentage' => $caloriePercentage,
                'remaining' => $remainingCalories,
                'is_over_target' => $isOverTarget,
            ],
            'mealCalories' => $mealCalories,
            'todayFoods' => $todayFoods,
            'favoriteFoods' => $favoriteFoods,
            'weeklyStreak' => $weeklyStreak,
            'weeklyData' => $weeklyData,
            'userProfile' => $userProfile,
            'showCalorieWarning' => $showCalorieWarning,
            'warningMessage' => $warningMessage,
        ]);
    }

    /**
     * Calculate weekly streak.
     */
    private function calculateWeeklyStreak($userId): int
    {
        $streak = 0;
        $date = Carbon::today();

        // Check backwards from today
        for ($i = 0; $i < 30; $i++) { // Check up to 30 days
            $hasEntry = CalorieEntry::where('user_id', $userId)
                ->whereDate('entry_date', $date)
                ->exists();

            if ($hasEntry) {
                $streak++;
                $date->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Get mini weekly data for chart.
     */
    private function getWeeklyMiniData($userId, $calorieTarget): array
    {
        $weekData = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $calories = CalorieEntry::where('user_id', $userId)
                ->whereDate('entry_date', $date)
                ->sum('calories');

            $percentage = $calorieTarget > 0 ? ($calories / $calorieTarget) * 100 : 0;

            $weekData[] = [
                'date' => $date->toDateString(),
                'day' => $date->format('D'),
                'calories' => (float) $calories,
                'percentage' => round($percentage, 1),
                'is_today' => $date->isToday(),
            ];
        }

        return $weekData;
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
