<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gender',
        'age',
        'weight',
        'height',
        'activity_level_id',
        'bmi',
        'daily_calorie_target',
        'goal_id',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activityLevel()
    {
        return $this->belongsTo(ActivityLevel::class);
    }

    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }
}
