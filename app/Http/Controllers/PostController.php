<?php

namespace App\Http\Controllers;

use App\Events\QuestionCreated;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Question;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{

    public function addPost(Request $request)
    {
        $user=User::findOrFail($request->user_id);
        if ($user->is_active==0){
            return response()->json(['user'=>$user,'message' => 'answers gotten','status'=>-1]);
        }
        $post = new Post();
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $name = time() . '.' . $file->extension();
            $path = $file->move(public_path() . '/post_headers/', $name);
            if ($path) {
                $post->header_path = $name;
                $post->user_id = $request->user_id;
                $post->title = $request->title;
                $post->body = $request->body;
                $post->save();
            }
        } else {
            $post = Post::create($request->all());

        }
        $user = $post->user;

        if ($post) {
            $post['user'] = $post->user;
            $post['comments'] = $post->comments;
            foreach ($post['comments'] as $comment) {
                $comment['replies'] = $comment->replies;
            }
            return response()->json(['post' => $post, 'message' => 'post added', 'status' => 1]);
        } else
            return response()->json(['error' => 'not added', 'status' => 0]);
    }


    public function getPosts()
    {
        $posts = Post::orderBy('created_at', 'desc')->get();
        foreach ($posts as $post) {
            $post['user'] = $post->user;
            $post['comments'] = $post->comments;
            foreach ($post['comments'] as $comment) {
                $comment['replies'] = $comment->replies;
            }
        }
        $recent_posts = Post::orderBy('created_at', 'desc')->take(3)->get();
        $recent_questions = Question::orderBy('created_at', 'desc')->take(3)->get();
        return response()->json(['posts' => $posts,
            'recents'=>$recent_posts ,
            'message' => 'posts gotten',
            'recent_questions'=>$recent_questions,
            'status' => 1]);


    }

    public function getPost(Request $request)
    {
        $post = Post::findOrFail($request->id);

        $post['user'] = User::where('id', $post->user_id)->first();
        $post['uni'] = $post->user->university->uni_name;
        $post['major'] = $post->user->major->major_name;

        $post['comments'] = $post->comments;
        $post['count_comments'] = $post->comments->count();
        foreach ($post['comments'] as $comment) {
            $comment['replies'] = $comment->replies;
            $comment['user_name'] = $comment->user->name;
            $comment['photo_path'] = $comment->user->photo_path;
            foreach ($comment['replies'] as $reply) {
                $reply['user_name'] = $reply->user->name;
                $reply['photo_path'] = $reply->user->photo_path;
            }
        }


        return response()->json(['post' => $post, 'message' => 'post gotten', 'status' => 1]);

    }

    public function getPostComments(Request $request)
    {

        $comments = Comment::where('post_id', $request->id)->get();

        foreach ($comments as $comment) {
            $comment['replies'] = $comment->replies;
            $comment['user'] = $comment->user;
        }

        return response()->json(['comments' => $comments, 'message' => 'comments gotten', 'status' => 1]);

    }

    public function addComment(Request $request)
    {
        $user=User::findOrFail($request->user_id);
        if ($user->is_active==0){
            return response()->json(['user'=>$user,'message' => 'answers gotten','status'=>-1]);
        }
        $comment = Comment::create($request->all());
        $comment['replies'] = $comment->replies;
        $comment['user_name'] = $comment->user->name;
        $comment['photo_path'] = $comment->user->photo_path;
        return response()->json(['comment' => $comment, 'message' => 'comments gotten', 'status' => 1]);
    }
    public function addReply(Request $request)
    {
        $reply = Reply::create($request->all());
        $comment = Comment::findOrFail($request->comment_id);
        $comment['replies'] = $comment->replies;
        $comment['user_name'] = $comment->user->name;
        $comment['user'] = $comment->user;
        $comment['photo_path'] = $comment->user->photo_path;
        foreach ($comment['replies'] as $reply) {
            $reply['user_name'] = $reply->user->name;
            $reply['photo_path'] = $reply->user->photo_path;
        }

        $reply['user_name'] = $reply->user->name;
        $reply['photo_path'] = $reply->user->photo_path;
        return response()->json(['reply' => $reply,'comment'=>$comment ,'message' => 'replies gotten', 'status' => 1]);
    }


}
