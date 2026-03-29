<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Muestra una lista de todos los usuarios.
     */
    public function index()
    {
        // Recuperamos todos los registros de la tabla 'users'
        $users = User::all();

        // Opción A: Retornar una vista (Para aplicaciones web)
        // return view('users.index', compact('users'));

        // Opción B: Retornar JSON (Para APIs)
        return response()->json($users);
    }
}