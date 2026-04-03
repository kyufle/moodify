<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request){
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
    public function register(Request $request){
        $request-> validate([
            'userData.fullName' => 'required',
            'userData.username' => 'required',
            'userData.email' => 'required',
            'userData.password' => 'required'
        ]);
        if (filter_var($request->userData.email, FILTER_VALIDATE_EMAIL)) {
            $register = User::where('email', $request->emailUsername)->first();
            if($register){
            return response()->json([
                'success' => false,
                'message' => 'Ya existe una cuenta con este email',
            ]);
            }
        }
        else {
            $register = User::where('username', $request->userData.username)->first();
            if($register){
            return response()->json([
                'success' => false,
                'message' => 'Ya existe una cuenta con este usuario',
            ]);
            }
        }

        $register = User::create([
            'name'     => $request->userData.fullName,
            'email'    => $request->userData.email,
            'username' => $request->userData.username,
            'password' => Hash::make($request->userData.password),
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Usuario creado con éxito',
            'user' => $user
        ], 201);
        
    }
}
