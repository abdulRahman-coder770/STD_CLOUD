<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NoteController extends Controller
{

    public function getNotesUser(Request $request){
        $notes=Note::where('user_id',$request->user_id)->orderBy('created_at','desc')->get();
        $count_notes=Note::where('user_id',$request->user_id)->where('read_at',null)->count();
        return response()->json([
            'notes'=>$notes,
            'count_notes' => $count_notes,
            'status'=>1,
        ]);
    }
    public function setAsRead(Request $request){
        $notes=Note::where('user_id',$request->user_id)->where('read_at',null)->get();
        foreach ($notes as $note){
            $note->read_at=Carbon::now()->toDateTime();
            $note->save();
        }
        return response()->json([
            'message' => 'notes are set read successfully',
            'status'=>1,
        ]);
    }

    public function deleteAll(Request $request){
        $notes=Note::where('user_id',$request->user_id)->get();
        foreach ($notes as $note){
            $note->delete();
        }
        return response()->json([
            'message' => 'notes are deleted successfully',
            'status'=>1,
        ]);
    }

}
