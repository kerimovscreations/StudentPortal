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

Route::group(['middleware' => ['web'], ['api']], function () {

    Route::group(['middleware' => 'auth'], function () {

        Route::get('/home', 'HomeController@index');
        /**
         * Get the list of places
         */
        Route::get('/getPlaces', 'PlaceController@getAll');

        /**
         * Get the sections' names for navigation drawer
         */
        Route::get('/getSections', 'SectionController@getAll');

        /**
         * Get the user's data to save on cookie on angular js $cookies part
         */
        Route::get('/getUser','UserController@getInfo');

        /**
         * Get the announcements
         */
        Route::get('/getAnnouncements', 'AnnouncementController@getAll');

        /**
         * Get the announcement by id
         */
        Route::get('/getAnnouncement/{id}', 'AnnouncementController@getById');

        /**
         * Get the list of groups
         */
        Route::get('/getGroups', 'GroupController@getAll');

        /**
         * Get the list of students
         */
        Route::get('/getStudents', 'StudentController@getAll');

        /**
         * Get the data of user
         */
        Route::get('/getDataUser/{table}/{id}', 'UserController@getDataUser');

        /**
         * Update the data of user
         */
        Route::post('/updateUser', 'UserController@update');

        /**
         * Get the list of teachers
         */
        Route::get('/getTeachers', 'TeacherController@getAll');

        /**
         * Get the list of mentors
         */
        Route::get('/getMentors', 'MentorController@getAll');

        /**
         * Get the list of notification due to tables(group or personal notification)
         */
        Route::get('/getNotifications/{table}/{id}', 'NotificationController@getByTableId');

        /**
         * Get the count of the notifications due to tables(group or personal notification)
         */
        Route::get('/getNotificationsCount/{table}/{id}', 'NotificationController@getCountByTableId');

        /**
         * Get data of selected notification
         */
        Route::get('/getNotification/{id}', 'NotificationController@getById');

        /**
         * Change the status notification when it is read
         */
        Route::post('/changeStatusNotification', 'NotificationController@changeStatus');

        /**
         * Get weekly list of events
         */
        Route::get('/getWeekEvents/{data1}', 'EventController@getWeekly');

        /**
         * Get the selected event data
         */
        Route::get('/getEvent/{id}', 'EventController@getById');

        /**
         * Post methods about events
         */
        Route::post('/postEvent', 'EventController@store');
        Route::post('/updateEvent', 'EventController@update');
        Route::post('/deleteEvent', 'EventController@delete');
        Route::post('/changeStatusEvent', 'EventController@changeStatus');
        Route::post('/changeTimeEvent', 'EventController@changeTime');


        /**
         * Set the access to post announcement only for teachers
         */
        Route::group(['middleware' => 'teacher'], function () {
            Route::post('/postAnnouncement', 'AnnouncementController@store');
            Route::post('/updateAnnouncement', 'AnnouncementController@update');
            Route::post('/deleteAnnouncement', 'AnnouncementController@delete');
        });
    });

    /**
     * choosing the default view for site visitor
     */
    Route::get('/', function () {
        if (Auth::guard('teacher')->user() || Auth::guard('student')->user() || Auth::guard('mentor')->user())
            return view('/home');
        else
            return view('welcome');
    });

    /**
     * login, logout and registration for students
     */
    Route::post('/student/login', 'StudentAuth\AuthController@login');
    Route::post('/student/register', 'StudentAuth\AuthController@register');
    Route::get('/student/logout', 'StudentAuth\AuthController@logout');

    /**
     * login, logout and registration for teachers
     */
    Route::post('/teacher/login', 'TeacherAuth\AuthController@login');
    Route::post('/teacher/register', 'TeacherAuth\AuthController@register');
    Route::get('/teacher/logout', 'TeacherAuth\AuthController@logout');


    /**
     * login, logout and registration for mentor
     */
    Route::post('/mentor/login', 'MentorAuth\AuthController@login');
    Route::post('/mentor/register', 'MentorAuth\AuthController@register');
    Route::get('/mentor/logout', 'MentorAuth\AuthController@logout');
    /**
     * Login/Register routes generation
     */
    Route::auth();
    
});