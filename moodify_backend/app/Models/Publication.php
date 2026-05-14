<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $table = 'publications';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'text_publications',
        'date',
        'user_id'
    ];
}
?>