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

Route::group(['middleware' => 'web', 'api'], function () {

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
    //to check student's logged in status
    Route::get('/student','StudentController@index');

    /**
     * login, logout and registration for teachers
     */
    Route::post('/teacher/login','TeacherAuth\AuthController@login');
    Route::post('/teacher/register', 'TeacherAuth\AuthController@register');
    Route::get('/teacher/logout','TeacherAuth\AuthController@logout');
    //to check teacher's logged in status
    Route::get('/teacher','TeacherController@index');


    /**
     * login, logout and registration for mentor
     */
    Route::post('/mentor/login','MentorAuth\AuthController@login');
    Route::post('/mentor/register', 'MentorAuth\AuthController@register');
    Route::get('/mentor/logout','MentorAuth\AuthController@logout');
    //to check mentor's logged in status
    Route::get('/mentor','MentorController@index');

    Route::auth();

    Route::get('login/{type}', 'LoginController@setType');

    Route::get('register/{type}', 'RegisterController@setType');

    Route::get('/home', 'HomeController@index');

    Route::get('/getSections',function(){
        $sections=\App\Section::all();
        return json_encode($sections);
    });

    Route::get('/getAnnouncements',function(){
        $announcements=App\Announcement::all();
        $groups=array();
        foreach ($announcements as $announcement) {
            array_push($groups,$announcement->groups);
        }
        $results=array();
        array_push($results,$announcements,$groups);
        return json_encode($results);
    });

    Route::get('/getGroups',function(){
       $groups=App\Group::all()->pluck('name');
        return json_encode($groups);
    });

});


