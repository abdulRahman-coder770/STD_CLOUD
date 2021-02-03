<?php

namespace App\Http\Controllers;
use App\Mail\confirmEmail;
use App\Mail\PasswordReset;
use App\Models\University;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized','status'=>0]);
        }

        return $this->createNewToken($token);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $user_validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'university_id' => 'required',
            'major_id' => 'required',
        ]);

        if($user_validator->fails()){
            return response()->json(['error'=>$user_validator->errors()->toJson(),
            'status'=>0
            ]);
        }

        if($user = User::create(array_merge(
            $user_validator->validated(),
            ['password' => bcrypt($request->password)],
            ['role_id'=>4]
        )) ) {
            Mail::to($request->email)->send(new confirmEmail($request->name));

            return response()->json([
                'message' => 'User successfully registered',
                'status' => 1,
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,

            ]);
        }
        else
            return response()->json([
                'error' => 'some thing went error while registering',
                'status'=>0
            ]);

    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */

    protected function createNewToken($token){
        if ( auth()->user()->major &&
            auth()->user()->university){
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'status'=>1,
                'user' => auth()->user(),
                'major' => auth()->user()->major->major_name,
                'uni' => auth()->user()->university->uni_short_name,
                'role'=>auth()->user()->role->role_name,
            ]);
        }
        else
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'status'=>1,
            'user' => auth()->user(),
            'role'=>auth()->user()->role->role_name,
        ]);
    }

}
