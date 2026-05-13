<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HabitLog extends Model
{
    protected $fillable = ['habit_id', 'user_id', 'date'];

    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }
}
?>