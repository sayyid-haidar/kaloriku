<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodTag extends Model
{
    public $incrementing = false;
    protected $primaryKey = null;
    protected $table = 'food_tags';
    public $timestamps = false;
    protected $fillable = [
        'food_id',
        'tag_id',
    ];

    // Relationships
    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
