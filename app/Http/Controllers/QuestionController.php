<?php

namespace App\Http\Controllers;

use App\Events\QuestionCreated;
use App\Events\QuestionStatus;
use App\Models\Note;
use App\Models\Post;
use App\Models\Question;
use App\Models\User;
use App\Notifications\QuestionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{


    public function getQuestions(Request $request){

        $major_id=$request->major_id;
        $questions=Question::where('major_id',$major_id)
            ->where('status',1)
            ->orderBy('created_at','desc')
            ->get();
        foreach ($questions as $question){
            $question['name']=$question->user->name;
            $question['post_date']=$question->created_at;
            $question['edit_date']=$question->updated_at;
            $question['photo_path']=$question->updated_at;
//            $question['edit_date']=$question->updated_at;
            $question['count_answers']=$question->answers->count();
        }

        if ($questions){
            $recent_posts = Post::orderBy('created_at', 'desc')->take(3)->get();
            return response()->json([
                'recent_posts'=>$recent_posts,
                'questions'=>$questions,
                'message' => 'question gotten',
                'status'=>1]);
        }
        else
            return response()->json(['error' => 'not gotten','status'=>0]);
    }

    public function searchQuestions(Request $request){
        $major_id=$request->major_id;
        $se=$request->se;

        $questions=Question::
        where('major_id',$major_id)->select("*")->where('status',1)
            ->where("topic", "LIKE", "\\" . $se . "%")
            ->get();
        foreach ($questions as $question){
            $question['name']=$question->user->name;
            $question['post_date']=$question->created_at;
            $question['edit_date']=$question->updated_at;
            $question['count_answers']=$question->answers->count();
        }

        if ($questions){
            return response()->json([
                'questions'=>$questions,
                'message' => 'question gotten',
                'status'=>1]);
        }
        else
            return response()->json(['error' => 'not gotten','status'=>0]);
    }

    public function addQuestion(Request $request){
        $user=User::findOrFail($request->user_id);
//        $user=Auth::user();
        if ($user->is_active==0){
            return response()->json(['user'=>$user,'message' => 'answers gotten','status'=>-1]);
        }
        $question=Question::create($request->all());
//        $question->user->notify( new QuestionNotification($question));
        $user=$question->user;

        if ($question){
            $question_result=DB::table('questions')
                ->leftJoin('users','questions.user_id','users.id')
                ->leftJoin('answers','answers.question_id','=','questions.id')
                ->where('questions.id',$question->id)
                ->select('questions.id as id',
                    'questions.topic as topic',
                    'questions.major_id as major_id',
                    'questions.status as status',
                    'users.name as name',
                    'users.is_active as is_active',
                    'questions.body as body',
                    'questions.created_at as post_date',
                    'questions.updated_at as edit_date',
                    DB::raw('COUNT(answers.id) AS count_answers')
                )
                ->groupBy('topic','id','body','post_date','edit_date','name','major_id','status')
                ->orderBy('post_date','desc')
                ->get();
            event(new QuestionCreated($question_result,$user));
            return response()->json(['question'=>$question_result,'message' => 'question added','status'=>1]);
        }
        else
            return response()->json(['error' => 'not added','status'=>0]);
    }
    public function getQuestion(Request $request){
        $question=Question::findOrFail($request->id);
        $user=$question->user;
//       event(new QuestionCreated($question,$user));
        if ($question){
            $question_result=DB::table('questions')
                ->leftJoin('users','questions.user_id','users.id')
                ->leftJoin('answers','answers.question_id','=','questions.id')
                ->where('questions.id',$question->id)
                ->select('questions.id as id',
                    'questions.major_id as major_id',
                    'questions.topic as topic',
                    'users.name as name',
                    'questions.status as status',
                    'questions.body as body',
                    'questions.created_at as post_date',
                    'questions.updated_at as edit_date',
                    DB::raw('COUNT(answers.id) AS count_answers')
                )
                ->groupBy('topic','id','body','post_date','edit_date','name','major_id','status')
                ->orderBy('post_date','desc')
                ->get();
//            event(new QuestionCreated($question_result,$user));
            return response()->json([
                'question'=>$question_result,
                'message' => 'question gotten',
                'status'=>1,
            ]);
        }
        else
            return response()->json(['error' => 'not gotten','status'=>0]);
    }

    public function acceptQuestion(Request $request){
        $question=Question::findOrFail($request->id);
        $question->status=1;
        $question->save();
        $user_id=$question->user_id;
        $note=new Note();
        $note->user_id=$user_id;
        $note->type='question';
        $note->notifiable_id=$question->id;
        $note->data='your question with topic: '.$question->topic.' has accepted, click to check it';
        $note->save();

        event(new QuestionStatus($question));

        return response()->json([
            'question'=>$question,
            'message' => 'question accepted',
            'status'=>1,
        ]);
    }
      public function rejectQuestion(Request $request){
          $question=Question::findOrFail($request->id);
          $question->rejected_reason=$request->reason;
          $question->status=0;
          $question->save();
          $user_id=$question->user_id;
          $note=new Note();
          $note->user_id=$user_id;
          $note->type='question';
          $note->notifiable_id=$question->id;
          $note->data='your question with topic: '.$question->topic.' has rejected because '.$question->rejected_reason;
          $note->save();
          event(new QuestionStatus($question));
          return response()->json([
              'question'=>$question,
              'message' => 'question rejected',
              'status'=>1,
          ]);
    }

}
