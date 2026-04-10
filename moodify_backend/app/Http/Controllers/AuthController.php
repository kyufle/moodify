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
            'password' => 'required'
        ]);

        $field = filter_var($request->emailUsername, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $request->emailUsername)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'message.incorrectCredentials',
                'success' => false,
            ], 401);
        }
        if (is_null($user->email_verified_at)) {
            return response()->json([
                'success' => false,
                'message' => 'message.notVerified',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'access_token' => $token,
            'user' => $user,
            'token_type' => 'Bearer',
        ]);
    }
    public function register(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8'
        ], [
            'email.unique' => 'message.register.accountAlreadyExistEmail',
            'username.unique' => 'message.register.accountAlreadyExistUsername',
            'email.email' => 'message.register.emailFormatInvalid',
            'required' => 'message.fieldRequired'
        ]);

        $register = User::create([
            'name' => $request->fullName,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'message.register.createUserSuccess',
            'user' => $register
        ], 201);

    }
}
