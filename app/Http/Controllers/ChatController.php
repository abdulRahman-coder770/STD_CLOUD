<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function storeMessage(Request $request){

        $sender=User::findOrFail($request->sender_id);
        $rec=User::findOrFail($request->rec_id);
        $message=$request->message;
        $rec_id=$request->rec_id;
        $m=new Message();
        $m->sender_id=$request->sender_id;
        $m->rec_id=$rec_id;
        $m->message=$message;
        if ($m->save()){
            event(new NewMessage($m,$sender,$rec));
        }

    }
    public function getUsers(Request $request){
        $users=User::where('major_id',$request->major_id)->get();
        foreach ($users as $user){
            $count_unread_messages=Message::where('sender_id',$user->id)->where('status',0)
                ->where('rec_id',$request->user_id)
                ->count();
            $user['count_unread_messages']=$count_unread_messages;
        }
        return response()->json(['users' => $users,'status'=>1]);
    }
   public function getMessagesUser(Request $request){

       $messages=DB::select('select * from messages where (sender_id = '.$request->sender_id.'
and rec_id='.$request->rec_id.' ) or
  (sender_id = '.$request->rec_id.' and rec_id= '.$request->sender_id.')'

       );


        $rec=User::findOrFail(intval($request->rec_id));
        return response()->json(['messages' => $messages,'rec'=>$rec,'status'=>1]);
    }
    public function setAsRead(Request $request){
        $messages=Message::where('rec_id',$request->rec_id)->where('sender_id',$request->sender_id)->get();
        foreach ($messages as $message){
            $message->status=1;
            $message->save();
        }
        return response()->json(['status'=>1]);

    }

}
