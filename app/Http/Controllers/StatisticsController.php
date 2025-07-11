<?php

namespace App\Http\Controllers;

use App\Models\CalorieEntry;
use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    /**
     * Display weekly statistics dashboard.
     */
    public function weekly(): Response
    {
        $user = Auth::user();
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $calorieTarget = $userProfile ? $userProfile->daily_calorie_target : 2000;

        // Get last 7 days data
        $weekData = $this->getWeeklyData($user->id, $calorieTarget);

        // Get weekly summary
        $weeklySummary = $this->getWeeklySummary($user->id, $calorieTarget);

        // Get favorite foods this week
        $weeklyFavorites = $this->getWeeklyFavorites($user->id);

        // Get meal type distribution
        $mealDistribution = $this->getMealDistribution($user->id);

        // Get recent history data
        $recentHistory = $this->getRecentHistory($user->id);

        // Get advanced analytics data
        $insights = $this->getInsights($user->id, $calorieTarget);
        $patterns = $this->getPatterns($user->id);
        $comparison = $this->getComparison($user->id, $calorieTarget);

        return Inertia::render('Statistics/WeeklyStats', [
            'weekData' => $weekData,
            'weeklySummary' => $weeklySummary,
            'weeklyFavorites' => $weeklyFavorites,
            'mealDistribution' => $mealDistribution,
            'recentHistory' => $recentHistory,
            'insights' => $insights,
            'patterns' => $patterns,
            'comparison' => $comparison,
            'calorieTarget' => $calorieTarget,
            'userProfile' => $userProfile,
        ]);
    }

    /**
     * Get daily data for the last 7 days.
     */
    private function getWeeklyData($userId, $calorieTarget)
    {
        $weekData = [];
        $weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayData = CalorieEntry::where('user_id', $userId)
                ->whereDate('entry_date', $date)
                ->selectRaw('
                    SUM(calories) as total_calories,
                    COUNT(*) as total_entries,
                    SUM(CASE WHEN meal_type = "breakfast" THEN calories ELSE 0 END) as breakfast_calories,
                    SUM(CASE WHEN meal_type = "lunch" THEN calories ELSE 0 END) as lunch_calories,
                    SUM(CASE WHEN meal_type = "dinner" THEN calories ELSE 0 END) as dinner_calories,
                    SUM(CASE WHEN meal_type = "snack" THEN calories ELSE 0 END) as snack_calories
                ')
                ->first();

            $totalCalories = $dayData->total_calories ?? 0;
            $percentage = $calorieTarget > 0 ? round(($totalCalories / $calorieTarget) * 100, 1) : 0;

            $weekData[] = [
                'date' => $date->toDateString(),
                'day_name' => $weekDays[$date->dayOfWeek === 0 ? 6 : $date->dayOfWeek - 1], // Adjust for Sunday = 0
                'day_short' => $date->format('D'),
                'total_calories' => (float) $totalCalories,
                'total_entries' => (int) ($dayData->total_entries ?? 0),
                'percentage' => $percentage,
                'is_today' => $date->isToday(),
                'breakfast_calories' => (float) ($dayData->breakfast_calories ?? 0),
                'lunch_calories' => (float) ($dayData->lunch_calories ?? 0),
                'dinner_calories' => (float) ($dayData->dinner_calories ?? 0),
                'snack_calories' => (float) ($dayData->snack_calories ?? 0),
                'status' => $this->getCalorieStatus($percentage),
            ];
        }

        return $weekData;
    }

    /**
     * Get weekly summary statistics.
     */
    private function getWeeklySummary($userId, $calorieTarget)
    {
        $startDate = Carbon::today()->subDays(6);
        $endDate = Carbon::today();

        $weekStats = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->selectRaw('
                SUM(calories) as total_calories,
                COUNT(*) as total_entries,
                COUNT(DISTINCT entry_date) as active_days,
                AVG(calories) as avg_calories_per_entry,
                MAX(calories) as highest_entry,
                MIN(calories) as lowest_entry
            ')
            ->first();

        $totalCalories = $weekStats->total_calories ?? 0;
        $activeDays = $weekStats->active_days ?? 0;
        $avgDaily = $activeDays > 0 ? $totalCalories / $activeDays : 0;
        $weeklyTarget = $calorieTarget * 7;
        $weeklyPercentage = $weeklyTarget > 0 ? round(($totalCalories / $weeklyTarget) * 100, 1) : 0;

        // Get daily averages by meal type
        $mealAverages = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->whereNotNull('meal_type')
            ->selectRaw('
                meal_type,
                AVG(calories) as avg_calories,
                COUNT(*) as count
            ')
            ->groupBy('meal_type')
            ->get()
            ->keyBy('meal_type');

        return [
            'total_calories' => (float) $totalCalories,
            'total_entries' => (int) ($weekStats->total_entries ?? 0),
            'active_days' => $activeDays,
            'avg_daily' => round($avgDaily, 0),
            'avg_per_entry' => round($weekStats->avg_calories_per_entry ?? 0, 0),
            'highest_entry' => (float) ($weekStats->highest_entry ?? 0),
            'lowest_entry' => (float) ($weekStats->lowest_entry ?? 0),
            'weekly_target' => $weeklyTarget,
            'weekly_percentage' => $weeklyPercentage,
            'consistency_score' => round(($activeDays / 7) * 100, 0),
            'meal_averages' => [
                'breakfast' => round($mealAverages->get('breakfast')->avg_calories ?? 0, 0),
                'lunch' => round($mealAverages->get('lunch')->avg_calories ?? 0, 0),
                'dinner' => round($mealAverages->get('dinner')->avg_calories ?? 0, 0),
                'snack' => round($mealAverages->get('snack')->avg_calories ?? 0, 0),
            ],
        ];
    }

    /**
     * Get most consumed foods this week.
     */
    private function getWeeklyFavorites($userId)
    {
        $startDate = Carbon::today()->subDays(6);
        $endDate = Carbon::today();

        return CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->whereNotNull('food_name')
            ->selectRaw('
                food_name,
                COUNT(*) as frequency,
                SUM(calories) as total_calories,
                AVG(calories) as avg_calories
            ')
            ->groupBy('food_name')
            ->orderByDesc('frequency')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->food_name,
                    'frequency' => (int) $item->frequency,
                    'total_calories' => (float) $item->total_calories,
                    'avg_calories' => round($item->avg_calories, 0),
                ];
            });
    }

    /**
     * Get meal type distribution for this week.
     */
    private function getMealDistribution($userId)
    {
        $startDate = Carbon::today()->subDays(6);
        $endDate = Carbon::today();

        $distribution = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->whereNotNull('meal_type')
            ->selectRaw('
                meal_type,
                COUNT(*) as count,
                SUM(calories) as total_calories,
                AVG(calories) as avg_calories
            ')
            ->groupBy('meal_type')
            ->get()
            ->keyBy('meal_type');

        $totalEntries = $distribution->sum('count');
        $totalCalories = $distribution->sum('total_calories');

        $mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        $result = [];

        foreach ($mealTypes as $mealType) {
            $data = $distribution->get($mealType);
            $count = $data ? $data->count : 0;
            $calories = $data ? $data->total_calories : 0;

            $result[] = [
                'meal_type' => $mealType,
                'label' => $this->getMealTypeLabel($mealType),
                'count' => (int) $count,
                'total_calories' => (float) $calories,
                'avg_calories' => $data ? round($data->avg_calories, 0) : 0,
                'percentage_by_count' => $totalEntries > 0 ? round(($count / $totalEntries) * 100, 1) : 0,
                'percentage_by_calories' => $totalCalories > 0 ? round(($calories / $totalCalories) * 100, 1) : 0,
                'icon' => $this->getMealTypeIcon($mealType),
                'color' => $this->getMealTypeColor($mealType),
            ];
        }

        return $result;
    }

    /**
     * Get calorie status based on percentage.
     */
    private function getCalorieStatus($percentage)
    {
        if ($percentage < 70) return 'under';
        if ($percentage > 110) return 'over';
        return 'good';
    }

    /**
     * Get meal type label.
     */
    private function getMealTypeLabel($mealType)
    {
        $labels = [
            'breakfast' => 'Sarapan',
            'lunch' => 'Makan Siang',
            'dinner' => 'Makan Malam',
            'snack' => 'Snack',
        ];

        return $labels[$mealType] ?? $mealType;
    }

    /**
     * Get meal type icon.
     */
    private function getMealTypeIcon($mealType)
    {
        $icons = [
            'breakfast' => '🌅',
            'lunch' => '☀️',
            'dinner' => '🌙',
            'snack' => '🍪',
        ];

        return $icons[$mealType] ?? '🍽️';
    }

    /**
     * Get meal type color.
     */
    private function getMealTypeColor($mealType)
    {
        $colors = [
            'breakfast' => '#FFA726', // Orange
            'lunch' => '#42A5F5',     // Blue
            'dinner' => '#7E57C2',    // Purple
            'snack' => '#66BB6A',     // Green
        ];

        return $colors[$mealType] ?? '#9E9E9E';
    }

    /**
     * Get monthly statistics.
     */
    public function monthly(): Response
    {
        $user = Auth::user();
        $userProfile = UserProfile::where('user_id', $user->id)->first();
        $calorieTarget = $userProfile ? $userProfile->daily_calorie_target : 2000;

        // Get last 30 days data
        $monthData = $this->getMonthlyData($user->id, $calorieTarget);

        // Get monthly summary
        $monthlySummary = $this->getMonthlySummary($user->id, $calorieTarget);

        return Inertia::render('Statistics/MonthlyStats', [
            'monthData' => $monthData,
            'monthlySummary' => $monthlySummary,
            'calorieTarget' => $calorieTarget,
            'userProfile' => $userProfile,
        ]);
    }

    /**
     * Get monthly data.
     */
    private function getMonthlyData($userId, $calorieTarget)
    {
        $startDate = Carbon::today()->subDays(29);
        $endDate = Carbon::today();

        $monthData = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dayData = CalorieEntry::where('user_id', $userId)
                ->whereDate('entry_date', $date)
                ->sum('calories');

            $percentage = $calorieTarget > 0 ? round(($dayData / $calorieTarget) * 100, 1) : 0;

            $monthData[] = [
                'date' => $date->toDateString(),
                'day' => $date->day,
                'calories' => (float) $dayData,
                'percentage' => $percentage,
                'status' => $this->getCalorieStatus($percentage),
                'is_today' => $date->isToday(),
            ];
        }

        return $monthData;
    }

    /**
     * Get monthly summary.
     */
    private function getMonthlySummary($userId, $calorieTarget)
    {
        $startDate = Carbon::today()->subDays(29);
        $endDate = Carbon::today();

        $monthStats = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->selectRaw('
                SUM(calories) as total_calories,
                COUNT(*) as total_entries,
                COUNT(DISTINCT entry_date) as active_days,
                AVG(calories) as avg_calories_per_entry
            ')
            ->first();

        $totalCalories = $monthStats->total_calories ?? 0;
        $activeDays = $monthStats->active_days ?? 0;
        $avgDaily = $activeDays > 0 ? $totalCalories / $activeDays : 0;
        $monthlyTarget = $calorieTarget * 30;
        $monthlyPercentage = $monthlyTarget > 0 ? round(($totalCalories / $monthlyTarget) * 100, 1) : 0;

        return [
            'total_calories' => (float) $totalCalories,
            'total_entries' => (int) ($monthStats->total_entries ?? 0),
            'active_days' => $activeDays,
            'avg_daily' => round($avgDaily, 0),
            'avg_per_entry' => round($monthStats->avg_calories_per_entry ?? 0, 0),
            'monthly_target' => $monthlyTarget,
            'monthly_percentage' => $monthlyPercentage,
            'consistency_score' => round(($activeDays / 30) * 100, 0),
        ];
    }

    /**
     * Get recent history data for the last 30 days.
     */
    private function getRecentHistory($userId)
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        return CalorieEntry::where('user_id', $userId)
            ->where('entry_date', '>=', $thirtyDaysAgo)
            ->with('food')
            ->orderBy('entry_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(50) // Limit to last 50 entries for performance
            ->get()
            ->map(function ($entry) {
                $entryDate = Carbon::parse($entry->entry_date);
                return [
                    'id' => $entry->id,
                    'food_name' => $entry->food->name ?? 'Unknown Food',
                    'calories' => (float) $entry->calories,
                    'quantity' => (float) $entry->quantity,
                    'unit' => $entry->unit ?? 'gram',
                    'meal_type' => $entry->meal_type,
                    'entry_date' => $entryDate->format('Y-m-d'),
                    'entry_time' => $entry->created_at->format('H:i'),
                    'formatted_date' => $entryDate->format('d M Y'),
                    'formatted_time' => $entry->created_at->format('H:i'),
                    'is_today' => $entryDate->isToday(),
                    'days_ago' => Carbon::now()->diffInDays($entryDate),
                ];
            });
    }

    /**
     * Get user insights and recommendations.
     */
    private function getInsights($userId, $calorieTarget)
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        // Get 30 days stats
        $monthlyStats = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->selectRaw('
                AVG(calories) as avg_calories,
                COUNT(DISTINCT entry_date) as active_days,
                COUNT(*) as total_entries,
                SUM(calories) as total_calories
            ')
            ->first();

        $avgDaily = $monthlyStats->avg_calories ? $monthlyStats->total_calories / max($monthlyStats->active_days, 1) : 0;
        $consistency = round(($monthlyStats->active_days / 30) * 100, 1);

        // Peak eating times
        $peakHours = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count, AVG(calories) as avg_cal')
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->limit(3)
            ->get();

        // Most active day of week
        $activeDays = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$startDate, $endDate])
            ->selectRaw('DAYNAME(entry_date) as day_name, COUNT(DISTINCT entry_date) as count')
            ->groupBy('day_name')
            ->orderBy('count', 'desc')
            ->first();

        return [
            'avg_daily' => round($avgDaily, 0),
            'consistency' => $consistency,
            'active_days' => $monthlyStats->active_days ?? 0,
            'total_entries' => $monthlyStats->total_entries ?? 0,
            'peak_hour' => $peakHours->isNotEmpty() ? $peakHours->first()->hour : null,
            'most_active_day' => $activeDays->day_name ?? null,
            'target_achievement' => $calorieTarget > 0 ? round(($avgDaily / $calorieTarget) * 100, 1) : 0,
        ];
    }

    /**
     * Get eating patterns analysis.
     */
    private function getPatterns($userId)
    {
        $startDate = Carbon::now()->subDays(14); // Last 2 weeks

        // Meal timing patterns
        $mealTimings = CalorieEntry::where('user_id', $userId)
            ->where('entry_date', '>=', $startDate)
            ->selectRaw('
                meal_type,
                AVG(HOUR(created_at)) as avg_hour,
                COUNT(*) as frequency
            ')
            ->whereNotNull('meal_type')
            ->groupBy('meal_type')
            ->get();

        // Weekly vs Weekend pattern
        $weekdayAvg = CalorieEntry::where('user_id', $userId)
            ->where('entry_date', '>=', $startDate)
            ->whereRaw('DAYOFWEEK(entry_date) BETWEEN 2 AND 6') // Mon-Fri
            ->selectRaw('AVG(calories) as avg_cal, COUNT(DISTINCT entry_date) as days')
            ->first();

        $weekendAvg = CalorieEntry::where('user_id', $userId)
            ->where('entry_date', '>=', $startDate)
            ->whereRaw('DAYOFWEEK(entry_date) IN (1, 7)') // Sat-Sun
            ->selectRaw('AVG(calories) as avg_cal, COUNT(DISTINCT entry_date) as days')
            ->first();

        return [
            'meal_timings' => $mealTimings->map(function ($timing) {
                return [
                    'meal_type' => $timing->meal_type,
                    'avg_hour' => round($timing->avg_hour, 1),
                    'frequency' => $timing->frequency,
                ];
            }),
            'weekday_avg' => round(($weekdayAvg->avg_cal ?? 0) * ($weekdayAvg->days ?? 0) / max($weekdayAvg->days ?? 1, 1), 0),
            'weekend_avg' => round(($weekendAvg->avg_cal ?? 0) * ($weekendAvg->days ?? 0) / max($weekendAvg->days ?? 1, 1), 0),
        ];
    }

    /**
     * Get comparison with previous periods.
     */
    private function getComparison($userId, $calorieTarget)
    {
        // This week vs last week
        $thisWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd = Carbon::now()->subWeek()->endOfWeek();

        $thisWeekTotal = CalorieEntry::where('user_id', $userId)
            ->where('entry_date', '>=', $thisWeekStart)
            ->sum('calories');

        $lastWeekTotal = CalorieEntry::where('user_id', $userId)
            ->whereBetween('entry_date', [$lastWeekStart, $lastWeekEnd])
            ->sum('calories');

        $weeklyChange = $lastWeekTotal > 0 ? (($thisWeekTotal - $lastWeekTotal) / $lastWeekTotal) * 100 : 0;

        // This month vs last month
        $thisMonthTotal = CalorieEntry::where('user_id', $userId)
            ->whereYear('entry_date', Carbon::now()->year)
            ->whereMonth('entry_date', Carbon::now()->month)
            ->sum('calories');

        $lastMonthTotal = CalorieEntry::where('user_id', $userId)
            ->whereYear('entry_date', Carbon::now()->subMonth()->year)
            ->whereMonth('entry_date', Carbon::now()->subMonth()->month)
            ->sum('calories');

        $monthlyChange = $lastMonthTotal > 0 ? (($thisMonthTotal - $lastMonthTotal) / $lastMonthTotal) * 100 : 0;

        return [
            'this_week_total' => (float) $thisWeekTotal,
            'last_week_total' => (float) $lastWeekTotal,
            'weekly_change' => round($weeklyChange, 1),
            'this_month_total' => (float) $thisMonthTotal,
            'last_month_total' => (float) $lastMonthTotal,
            'monthly_change' => round($monthlyChange, 1),
        ];
    }
}
