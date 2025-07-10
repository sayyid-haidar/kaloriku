<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalorieEntry extends Model
{
    protected $fillable = [
        'user_id',
        'food_id',
        'portion',
        'calorie_amount',
        'entry_date',
    ];

    protected $casts = [
        'entry_date' => 'date',
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
}
