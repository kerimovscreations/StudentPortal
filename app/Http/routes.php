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

    Route::get('/getUser',function(){
        $result=Auth::guard(session('userType'))->user()->toArray();
        $result['type']=session('userType');
        return json_encode($result);
    });

    Route::get('/getAnnouncements',function(){
        $announcements=App\Announcement::all();
        $groups=array();
        $owner=array();
        foreach ($announcements as $announcement) {
            array_push($groups,$announcement->groups);
            array_push($owner,$announcement->owner);
        }
        $results=array();
        array_push($results,$announcements,$groups,$owner);
        return json_encode($results);
    });

    Route::get('/getPlaces',function(){
        $places= \App\Place::all();
        return json_encode($places);
    });

    Route::get('/getGroups',function(){
        $groups= \App\Group::all();
        return json_encode($groups);
    });

    Route::get('/getStudents',function(){
        $students=\App\Student::all();
        return json_encode($students);
    });

    Route::get('/getTeachers',function(){
        $teachers=\App\Teacher::all();
        return json_encode($teachers);
    });

    Route::get('/getMentors',function(){
        $mentors=\App\Mentor::all();
        return json_encode($mentors);
    });

    Route::get('/getNotifications/{table}/{id}',function($table,$id){
        $notifications=DB::table('notifications')->where([
            ['receiver_id',intval($id)],
            ['receiver_table',$table],
        ])->get();
        return json_encode($notifications);
    });

    Route::get('/getDataNotification/{table}/{id}',function($table,$id){
        if($table=='announcements'){
            $data=App\Announcement::all()->find($id);
            $data->owner;
        }
        else{

        }
        return json_encode($data);
    });

    Route::get('/getEvents',function(){
        $events=App\Event::all();
        return json_encode($events);
    });

    Route::get('/getEvent/{id}',function($id){
        $event=App\Event::all()->find($id);
        $event->group=App\Group::where('id',$event->group_id)->value('name');
        $event->place=App\Place::where('id',$event->place_id)->value('name');
        $event->owner=DB::table($event->owner_table)->where('id',$event->owner_id)->value('name');
        $event->responsible_first=DB::table($event->responsible_first_table)->where('id',$event->responsible_first_id)->value('name');
        if(!is_null($event->responsible_second_id)){
            $event->responsible_second=DB::table($event->responsible_second_table)->where('id',$event->responsible_second_id)->value('name');
        }
        return json_encode($event);
    });

    Route::post('/postEvent','EventController@store');
    Route::post('/updateEvent','EventController@update');
    Route::post('/deleteEvent','EventController@delete');
    Route::post('/changeStatusEvent','EventController@statusChange');

    Route::group(['middleware' => 'teacher'], function () {
        Route::post('/postAnnouncement','AnnouncementController@store');
        Route::post('/deleteAnnouncement','AnnouncementController@delete');
    });
});


