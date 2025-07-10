<?php

namespace App\Http\Controllers;

use App\Models\CalorieEntry;
use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Display calorie history.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Get user profile for calorie target
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $calorieTarget = $userProfile ? $userProfile->daily_calorie_target : 2000;

        // Get last 7 days calorie data
        $last7Days = [];
        $weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $calories = CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $date)
                ->sum('calorie_amount');

            $last7Days[] = [
                'day' => $weekDays[$date->dayOfWeek === 0 ? 6 : $date->dayOfWeek - 1],
                'date' => $date->format('Y-m-d'),
                'calories' => $calories,
                'percentage' => $calorieTarget > 0 ? ($calories / $calorieTarget) * 100 : 0,
            ];
        }

        // Get daily summaries for the last 30 days
        $dailySummaries = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $calories = CalorieEntry::where('user_id', $user->id)
                ->whereDate('entry_date', $date)
                ->sum('calorie_amount');

            if ($calories > 0) {
                $dailySummaries[] = [
                    'date' => $date,
                    'day_name' => $this->getDayName($date),
                    'formatted_date' => $date->format('d M'),
                    'calories' => $calories,
                ];
            }
        }

        // Sort by date descending
        $dailySummaries = collect($dailySummaries)->sortByDesc('date')->values()->all();

        return Inertia::render('History/HistoryPage', [
            'weeklyData' => $last7Days,
            'dailySummaries' => $dailySummaries,
            'totalCalories' => collect($last7Days)->sum('calories'),
        ]);
    }

    /**
     * Get day name in Indonesian.
     */
    private function getDayName(Carbon $date): string
    {
        $days = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        return $days[$date->dayOfWeek];
    }
}
