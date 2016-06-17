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


use App\User;

Route::group(['middleware' => ['web'], ['api']], function () {

    Route::group(['middleware' => 'verify'], function () {

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
        Route::get('/getUser', 'UserController@getInfo');

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
            Route::get('/getPending', function (){
                $users = User::all();
                return $users;
            });
            Route::post('/changeUserType', 'UserController@changeType');
            Route::post('/deleteUser', 'UserController@delete');
        });
    });

    /**
     * choosing the default view for site visitor
     */
    Route::get('/', function () {
        if (Auth::user()) {
            return view('successRegister');
        } else if (Auth::guard('teacher')->user() || Auth::guard('student')->user() || Auth::guard('mentor')->user()) {
            return redirect('/home');
        } else
            return view('welcome');
    });

    Route::get('sendRegistered','UserController@email');

    Route::get('/check1', ['middleware' => 'user', function () {
        return 'user';
    }]);

    Route::get('/check2', ['middleware' => 'verify', function () {
        //return view('/home');
        return 'verified';
    }]);

    /**
     * Login/Register routes generation
     */
    Route::group(['middleware' => ['guest:teacher','guest:student','guest:mentor']], function () {
        Route::get('login', 'Auth\AuthController@showLoginForm');
        Route::get('register', 'Auth\AuthController@showRegistrationForm');
        Route::post('login', 'Auth\AuthController@login');
        Route::post('register', 'Auth\AuthController@register');
//
//    Route::post('password/email','Auth\PasswordController@sendResetLinkEmail');
//    Route::post('password/reset','Auth\PasswordController@reset');
//    Route::post('password/reset/{token?}','Auth\PasswordController@showResetForm');

    });
    Route::get('logout', 'Auth\AuthController@logout');

    if (Auth::guest() && Auth::guard('teacher')->guest() && Auth::guard('student')->guest() && Auth::guard('mentor')->guest()){

    }


});