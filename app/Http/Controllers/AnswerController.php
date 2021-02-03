<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnswerController extends Controller
{
    public function getAnswers(Request $request){

        $answers=DB::table('answers')
            ->join('users','answers.user_id','users.id')
            ->where('answers.question_id',$request->question_id)
            ->select('answers.id as id',
                'users.name as name',
                'users.photo_path as photo_path',
                'answers.body as body',
                'answers.created_at as post_date',
                'answers.updated_at as edit_date',
//                DB::raw('COUNT(answers.id) AS count_answers')
            )
//            ->groupBy('topic','id','body','post_date','edit_date','name')
            ->orderBy('post_date','desc')
            ->get();
        return response()->json(['answers'=>$answers,'message' => 'answers gotten','status'=>1]);
    }
    public function addAnswer(Request $request){
        $user=User::findOrFail($request->user_id);
//        $u=Auth::user();
        if ($user->is_active==0){
            return response()->json(['user'=>$user,'message' => 'answers gotten','status'=>-1]);
        }

        $answer=Answer::create($request->all());

        $answers=DB::table('answers')
            ->join('users','answers.user_id','users.id')
            ->where('answers.id',$answer->id)
            ->select('answers.id as id',
                'users.name as name',
                'users.is_active as is_active',
                'users.photo_path as photo_path',
                'answers.body as body',
                'answers.created_at as post_date',
                'answers.updated_at as edit_date',
//                DB::raw('COUNT(answers.id) AS count_answers')
            )
//            ->groupBy('topic','id','body','post_date','edit_date','name')
            ->orderBy('post_date','desc')
            ->get();
        return response()->json(['answer'=>$answers,'message' => 'answer added','status'=>1]);
    }
}
