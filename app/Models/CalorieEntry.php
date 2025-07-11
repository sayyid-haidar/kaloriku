<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalorieEntry extends Model
{
    protected $fillable = [
        'user_id',
        'food_name',
        'food_id',
        'calories',
        'notes',
        'entry_date',
        'entry_time',
        'meal_type',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'entry_time' => 'datetime:H:i',
        'calories' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('entry_date', $date);
    }

    public function scopeForMeal($query, $mealType)
    {
        return $query->where('meal_type', $mealType);
    }

    // Accessors & Mutators
    public function getFoodDisplayNameAttribute()
    {
        return $this->food_name ?? $this->food?->name ?? 'Unknown Food';
    }

    public function getCaloriesFormattedAttribute()
    {
        return number_format((float) $this->calories, 0) . ' kal';
    }
}
