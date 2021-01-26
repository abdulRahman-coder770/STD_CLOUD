<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{path?}', function () {
    return view('root');
})->where('path','.*');
//Route::get('message', function () {
//    $message['user'] = "Juan Perez";
//    $message['message'] =  "Prueba mensaje desde Pusher";
//    $success = event(new App\Events\NewMessage($message));
//    return $success;
//});
//Route::get('react-message', function() {
//    return view('message');
//});
//Auth::routes();
//
//Route::get('/welcome', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
