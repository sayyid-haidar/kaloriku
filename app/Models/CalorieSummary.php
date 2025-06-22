<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalorieSummary extends Model
{
    protected $fillable = [
        'user_id',
        'summary_date',
        'total_calories',
        'calorie_target',
        'deviation',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
