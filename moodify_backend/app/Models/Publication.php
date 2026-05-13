<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $table = 'publications'; // Forzamos el nombre de la tabla
    public $timestamps = false; // Como usas 'date' manualmente, quita los timestamps de Laravel

    protected $fillable = [
        'title',
        'text_publications',
        'date',
        'user_id'
    ];
}
?>