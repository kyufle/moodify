<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'emailUsername' => 'required',
            'password' => 'required',
        ]);

        if (filter_var($request->emailUsername, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $request->emailUsername)->first();
        }
        else {
            $user = User::where('username', $request->emailUsername)->first();
        }

        // Comparamos la contraseña usando el hash que vimos antes
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
                'success' => false,
                ], 401);
        }

        // Creamos el token. El nombre 'auth_token' puede ser cualquier cosa.
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
