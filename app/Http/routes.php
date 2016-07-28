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
         * Delete the selected list of notifications
         */
        Route::post('/deleteNotifications','NotificationController@delete');
        
        /**
         * Get weekly list of events
         */
        Route::get('/getWeekEvents/{data1}-{data2}', 'EventController@getWeekly');

        /**
         * Image upload
         */
        Route::post('/uploadImage', 'ImageUploadController@store');

        /**
         * File upload
         */
        Route::post('/uploadFile', 'FileController@store');

        /**
         * Download the file
         */
        Route::get('/getFile/{id}', 'FileController@get');

        /**
         * Operations with reservations
         */
        Route::post('/addReservation', 'ReservationController@store');
        Route::get('/getReservation/{reservation}', 'ReservationController@get');
        Route::post('/changeStatusReservation', 'ReservationController@changeStatus');
        Route::post('/changeTimeReservation', 'ReservationController@changeTime');
        Route::post('/updateReservation', 'ReservationController@update');
        Route::post('/deleteReservation', 'ReservationController@delete');


        /**
         * Set the restrict for students
         */
        Route::group(['middleware' => 'notStudent'], function () {

            /**
             * Get the list of students
             */
            Route::get('/getStudents', 'StudentController@getAll');

        });

        /**
         * Set the access only for teachers
         */
        Route::group(['middleware' => 'teacher'], function () {
            /**
             * Operations with announcement
             */
            Route::post('/postAnnouncement', 'AnnouncementController@store');
            Route::post('/updateAnnouncement', 'AnnouncementController@update');
            Route::post('/deleteAnnouncement', 'AnnouncementController@delete');

            /**
             * Operations with lessons
             */
            Route::post('/postLesson', 'LessonController@create');
            Route::get('/getLesson/{lesson}', 'LessonController@get');
            Route::post('/updateLesson', 'LessonController@update');
            Route::post('/deleteLesson', 'LessonController@delete');

            /**
             * Operations with attendance
             */
            Route::post('/postAttendance', 'AttendanceController@store');
            Route::post('/updateAttendance','AttendanceController@update');
            Route::get('/getAttendances', 'AttendanceController@getAll');
            Route::get('/getStudentsWithAttendances/{date}', 'StudentController@getAllWithAttendances');

            /**
             * Get the registered but pending users list
             */
            Route::get('/getPending', 'UserController@pending');

            /**
             * Change the type of user or confirm the pending users
             */
            Route::post('/changeUserType', 'UserController@changeType');

            /**
             * Delete the user
             */
            Route::post('/deleteUser', 'UserController@delete');

            /**
             * Change user type of student
             */
            Route::post('/changeTypeStudent', 'StudentController@changeType');

            /**
             * Change user type of mentor
             */
            Route::post('/changeTypeMentor', 'MentorController@changeType');

            /**
             * Create new group and place
             */
            Route::post('/createGroup','GroupController@create');
            Route::post('/updateGroup','GroupController@update');
            Route::post('/deleteGroup','GroupController@delete');
            Route::post('/createPlace','PlaceController@create');
            Route::post('/updatePlace','PlaceController@update');
            Route::post('/deletePlace','PlaceController@delete');
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

    Route::get('sendRegistered', 'UserController@email');

    /**
     * Login/Register routes generation
     */
    Route::group(['middleware' => ['guest:teacher', 'guest:student', 'guest:mentor']], function () {
        Route::get('login', 'Auth\AuthController@showLoginForm');
        Route::get('register', 'Auth\AuthController@showRegistrationForm');
        Route::post('login', 'Auth\AuthController@login');
        Route::post('register', 'Auth\AuthController@register');

//    Route::post('password/email','Auth\PasswordController@sendResetLinkEmail');
//    Route::post('password/reset','Auth\PasswordController@reset');
//    Route::post('password/reset/{token?}','Auth\PasswordController@showResetForm');

    });
    Route::get('logout', 'Auth\AuthController@logout');

    if (Auth::guest() && Auth::guard('teacher')->guest() && Auth::guard('student')->guest() && Auth::guard('mentor')->guest()) {

    }
});