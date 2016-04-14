<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


use Illuminate\Support\Facades\Auth;

Route::group(['middleware' => 'web'], function () {

    /**
     * set the validation for default page
     * don't allow to view home page unless user are not logged in
     */
    Route::get('/', function () {
        if(Auth::guard('student')->user() || Auth::guard('teacher')->user() || Auth::guard('mentor')->user() || !Auth::guest())
            return redirect('/home');
        else
            return view('welcome');
    });

    /**
     * login, logout and registration for students
     */
    Route::post('/student/login','StudentAuth\AuthController@login');
    Route::post('/student/register', 'StudentAuth\AuthController@register');
    Route::get('/student/logout','StudentAuth\AuthController@logout');

    Route::get('/student','StudentController@index');

    /**
     * login, logout and registration for teachers
     */
    Route::post('/teacher/login','TeacherAuth\AuthController@login');
    Route::post('/teacher/register', 'TeacherAuth\AuthController@register');
    Route::get('/teacher/logout','TeacherAuth\AuthController@logout');

    Route::get('/teacher','TeacherController@index');

    /**
     * login, logout and registration for mentor
     */
    Route::post('/mentor/login','MentorAuth\AuthController@login');
    Route::post('/mentor/register', 'MentorAuth\AuthController@register');
    Route::get('/mentor/logout','MentorAuth\AuthController@logout');

    Route::get('/mentor','MentorController@index');

    Route::auth();

    Route::get('login/{type}', 'LoginController@setType');

    Route::get('register/{type}', 'RegisterController@setType');

    Route::get('/home', 'HomeController@index');

});


