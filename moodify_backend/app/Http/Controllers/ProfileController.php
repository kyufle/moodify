<?php

namespace App\Http\Controllers; // Namespace simple

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            $request->validate([
                'name'             => 'sometimes|string|max:255',
                'email'            => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
                'username'         => ['sometimes', 'string', Rule::unique('users')->ignore($user->id)],
                'language'         => 'sometimes|string|nullable|in:es,en,ca',
                'image_id'         => 'sometimes|string|nullable',
                'password'         => 'sometimes|nullable|min:8',
                'current_password' => 'required_with:password', 
            ]);

            // Cambio de Password
            if ($request->filled('password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json(['message' => 'La contraseña actual es incorrecta'], 422);
                }
                $user->password = Hash::make($request->password);
            }

            // Actualización de campos
            if ($request->has('name')) $user->name = $request->name;
            if ($request->has('email')) $user->email = $request->email;
            if ($request->has('username')) $user->username = $request->username;
            if ($request->has('language')) $user->language = $request->language;
            if ($request->has('image_id')) $user->image_id = $request->image_id;

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado con éxito',
                'user'    => $user->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}