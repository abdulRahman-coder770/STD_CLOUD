<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});
Route::group([

    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'auth'

], function ($router) {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/fetchUsers', [UserController::class, 'index']);
    Route::post('/emailVerified', [UserController::class, 'emailVerified']);

//    students auth/ questions and answers
    Route::post('/students/addQuestion', [QuestionController::class, 'addQuestion']);
    Route::post('/students/getQuestions', [QuestionController::class, 'getQuestions']);
    Route::post('/students/getQuestion', [QuestionController::class, 'getQuestion']);
    Route::post('/students/question/getAnswers', [AnswerController::class, 'getAnswers']);
    Route::post('/students/questions/addAnswer', [AnswerController::class, 'addAnswer']);
    Route::post('/students/questions/searchQuestions', [QuestionController::class, 'searchQuestions']);
    Route::post('/students/posts/addPost', [PostController::class, 'addPost']);
    Route::post('/students/posts/getPosts', [PostController::class, 'getPosts']);
    Route::post('/students/posts/getPost', [PostController::class, 'getPost']);
    Route::post('/students/posts/getComments', [PostController::class, 'getPostComments']);
    Route::post('/students/posts/addComment', [PostController::class, 'addComment']);
    Route::post('/students/posts/addReply', [PostController::class, 'addReply']);

    //uploads student
    Route::post('/student/uploads/getCourseUploads', [UploadController::class, 'getCourseUploads']);
//    Route::post('/students/uploads/searchMajorUploads', [UploadController::class, 'searchMajorUploads']);
    Route::post('/student/uploads/downloadZipUpload', [UploadController::class, 'downloadZipUpload']);


    // upload author
    Route::post('/author/uploads/addUpload', [UploadController::class, 'addUpload']);
    Route::post('/author/uploads/getMajorUploads', [UploadController::class, 'getMajorUploads']);
    Route::post('/author/uploads/addFiles', [FileController::class, 'addFiles']);
    Route::post('/author/uploads/updateUpload', [UploadController::class, 'updateUpload']);
    Route::post('/author/uploads/deleteUpload', [UploadController::class, 'deleteUpload']);
    Route::post('/student/uploads/deleteZip', [UploadController::class, 'deleteZip']);

    // questions author
    Route::post('/author/questions/acceptQuestion', [QuestionController::class, 'acceptQuestion']);
    Route::post('/author/questions/rejectQuestion', [QuestionController::class, 'rejectQuestion']);

    // user notes
    Route::post('/user/notes/getNotes', [NoteController::class, 'getNotesUser']);
    Route::post('/user/notes/setAsRead', [NoteController::class, 'setAsRead']);
    Route::post('/user/notes/deleteAll', [NoteController::class, 'deleteAll']);



    //chat
    Route::post('/students/chat/sendMessage', [ChatController::class, 'storeMessage']);
    Route::post('/students/chat/getUsers', [ChatController::class, 'getUsers']);
    Route::patch('/students/chat/setAsRead', [ChatController::class, 'setAsRead']);
    Route::post('/students/chat/getMessagesUser', [ChatController::class, 'getMessagesUser']);
    Route::post('/student/profile/update', [UserController::class, 'updateProfile']);
    Route::post('/student/profile/updateInfo', [UserController::class, 'updateInfo']);



    //universities
    Route::post('/admin/uni/addUni',[UniversityController::class,'addUni']);
    Route::post('/admin/unis/getUni',[UniversityController::class,'getUni']);
    Route::get('/admin/getAllUnis',[UniversityController::class,'getAllUnisTree']);
    Route::get('/admin/getDataChart',[UniversityController::class,'getDataChart']);
    Route::patch('/admin/uni/editUni/{uni_id}',[UniversityController::class,'editUni']);
    Route::patch('/admin/uni/deleteUni/{uni_id}',[UniversityController::class,'deleteUni']);

    // admin majors
    Route::post('/admin/majors/getMajorsByUni',[MajorController::class,'getMajorsByUni']);
    Route::post('/admin/majors/addMajor',[MajorController::class,'addMajor']);
    Route::patch('/admin/majors/editMajor/{major_id}',[MajorController::class,'editMajor']);
    Route::patch('/admin/majors/deleteMajor/{major_id}',[MajorController::class,'deleteMajor']);
    // admin courses
    Route::post('/admin/courses/getCoursesByMajor',[CourseController::class,'getCoursesByMajor']);
    Route::post('/admin/courses/addCourse',[CourseController::class,'addCourse']);
    Route::patch('/admin/courses/editCourse/{course_id}',[CourseController::class,'editCourse']);
    Route::patch('/admin/courses/deleteCourse/{course_id}',[CourseController::class,'deleteCourse']);

    //admin users
    Route::post('/admin/users/getUsersByMajor',[UserController::class,'getUsersByMajor']);
    Route::post('/admin/users/switchActive',[UserController::class,'switchActive']);
    Route::post('/admin/users/getRoles',[UserController::class,'getRoles']);
    Route::post('/admin/users/updateUserEduInfo',[UserController::class,'updateUserEduInfo']);
    Route::post('/admin/users/resetPassword',[UserController::class,'resetPassword']);


    // notifications
    Route::post('/author/users/notifications',[UserController::class,'getNotifications']);

});
Route::get('/getAllUnis',[\App\Http\Controllers\UniversityController::class,'getAllUnis']);
Route::get('/getAllMajors',[\App\Http\Controllers\MajorController::class,'getMajorsByUni']);
Route::post('/getUniMajors',[\App\Http\Controllers\MajorController::class,'getMajorsByUni']);
Route::post('/getMajorCourses',[\App\Http\Controllers\CourseController::class,'getMajorCourses']);
