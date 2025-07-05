<?php

namespace App\Http\Controllers;

use App\Models\ActivityLevel;
use App\Models\Goal;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function showProfileForm()
    {
        return Inertia::render('Onboarding/Profile');
    }

    public function storeProfile(Request $request)
    {
        $request->validate([
            'gender' => 'required|in:male,female,other',
            'age' => 'required|integer|min:1|max:120',
            'weight' => 'required|numeric|min:1|max:500',
            'height' => 'required|numeric|min:50|max:300',
        ]);

        $user = Auth::user();

        // Create or update user profile
        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'gender' => $request->gender,
                'age' => $request->age,
                'weight' => $request->weight,
                'height' => $request->height,
            ]
        );

        return redirect()->route('onboarding.activity');
    }

    public function showActivityForm()
    {
        $activityLevels = ActivityLevel::all();

        return Inertia::render('Onboarding/Activity', [
            'activityLevels' => $activityLevels
        ]);
    }

    public function storeActivityAndCalculate(Request $request)
    {
        $request->validate([
            'activity_level_id' => 'required|exists:activity_levels,id',
        ]);

        $user = Auth::user();
        $profile = $user->userProfile;
        $activityLevel = ActivityLevel::find($request->activity_level_id);

        // Calculate BMR using Mifflin-St Jeor Equation
        if ($profile->gender === 'male') {
            $bmr = (10 * $profile->weight) + (6.25 * $profile->height) - (5 * $profile->age) + 5;
        } else {
            $bmr = (10 * $profile->weight) + (6.25 * $profile->height) - (5 * $profile->age) - 161;
        }

        // Calculate TDEE (Total Daily Energy Expenditure)
        $tdee = $bmr * $activityLevel->multiplier;

        // Calculate BMI
        $heightInMeters = $profile->height / 100;
        $bmi = $profile->weight / ($heightInMeters * $heightInMeters);

        // Update profile with calculated values
        $profile->update([
            'activity_level_id' => $request->activity_level_id,
            'bmi' => round($bmi, 1),
            'daily_calorie_target' => round($tdee),
        ]);

        return redirect()->route('onboarding.result');
    }

    public function showResult()
    {
        $user = Auth::user();
        $profile = $user->userProfile()->with(['activityLevel'])->first();

        return Inertia::render('Onboarding/Result', [
            'profile' => $profile
        ]);
    }
}
