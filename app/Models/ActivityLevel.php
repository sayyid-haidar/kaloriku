<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'multiplier',
    ];

    // Relationships
    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }
}
