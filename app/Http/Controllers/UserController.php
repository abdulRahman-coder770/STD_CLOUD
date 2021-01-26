<?php

namespace App\Http\Controllers;

use App\Mail\PasswordReset;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\JWTAuth;

class UserController extends Controller
{
    public function index(){
        $users=User::all();
        return response()->json([
            'users'=>$users,

        ]);
    }
    public function getRoles(){
        $roles=Role::all();
        return response()->json([
            'roles'=>$roles,

        ]);
    }
    public function resetPassword(Request $request)
    {
        $user = User::findOrFail($request->id);
        $user->password = bcrypt(12345678);
        $user->save();

//        Mail::to($user->email)->send(new PasswordReset($user->name,12345678));
//        return response()->json(["message" => "Email sent successfully."]);

        return response()->json([
            'status' => 1,
        ]);
    }
        public function updateUserEduInfo(Request $request){
        $user=User::findOrFail($request->id);
        if ($request->university_id!='')
            $user->university_id=$request->university_id;
         if ($request->major_id!='')
            $user->major_id=$request->major_id;
         if ($request->role_id!='')
            $user->role_id=$request->role_id;
        $user->save();
        return response()->json([
            'status'=>1,

        ]);

    }
    public function getUsersByMajor(Request $request){
        $users=User::where('major_id',$request->major_id)->get();
        foreach ($users as $user){
            $user['role_name']=$user->role->role_name;
        }
        return response()->json([
            'users'=>$users,

        ]);
    }
    public function getNotifications(Request $request){
        $header = $request->header('Authorization');
        $user = JWTAuth::toUser($request->header('Authorization'));
        $notifications=DB::table('notifications')
            ->where('notifiable_id',$user->id)
            ->get();
        return response()->json([
            'notifications'=>$notifications,

        ]);
    }
    public function switchActive(Request $request){
        $user_id=$request->user_id;
        $user=User::findOrFail($user_id);
        if($user->is_active==1){
            $user->is_active=0;
        }
        else{
            $user->is_active=1;
        }
        $user->save();
        return response()->json([
            'user'=>$user,
        ]);
    }
    public function updateInfo(Request $request){
        $user=User::findOrFail($request->user_id);

        $name=$request->name;
        $oldPass=$request->oldPass;
        $newPass=$request->newPass;

        if ($name!=''){
            $user->name=$name;
        }
        if ($oldPass!='') {
            if (bcrypt($oldPass) != $user->password) {
                return response()->json([
                    'status' => 0,
                    'message' => 'your old password is not correct please try again',
                ]);
            } elseif ($newPass == '') {
                return response()->json([
                    'status' => 0,
                    'message' => 'please set the new password',
                ]);
            } else {
                $user->password = bcrypt($newPass);
            }
        }
        $user->save();
        return response()->json([
            'user'=>$user,
            'status'=>1,
        ]);
    }

    public function updateProfile(Request $request){
        $user=User::findOrFail($request->user_id);
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $name = time() . '.' . $file->extension();
            $path = $file->move(public_path() . '/photos/', $name);
            if ($path){
                $user->photo_path=$name;
                $user->about=$request->about;
                $user->save();
            }
        }
        else{
            $user->about=$request->about;
            $user->save();
        }
        return response()->json([
            'user'=>$user,
        ]);

    }

}
