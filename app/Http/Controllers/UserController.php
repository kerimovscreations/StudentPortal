<?php

namespace App\Http\Controllers;

use App\Group;
use App\Mentor;
use App\Student;
use App\Teacher;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getInfo()
    {
        $result = Auth::guard(session('userType'))->user()->toArray();
        $result['type'] = session('userType');
        return json_encode($result);
    }

    public function getAllNotVerified()
    {
        $users = User::all();
        return $users;
    }

    public function getDataUser($table, $id)
    {
        if ($table == 'students') {
            $user = DB::table($table)->where('id', intval($id))->select('name', 'email', 'group_id', 'phone', 'birthDate', 'bio')->get();
            $user[0]->group = Group::find($user[0]->group_id)->name;
        } else if ($table == 'users') {
            $user = DB::table($table)->where('id', intval($id))->select('name', 'email', 'phone', 'birthDate')->get();
        } else {
            $user = DB::table($table)->where('id', intval($id))->select('name', 'email', 'bio', 'work_days', 'work_start_time', 'work_end_time')->get();
        }
        return json_encode($user[0]);
    }

    public function email()
    {
        $user_type = session()->get('userType');
        if ($user_type == 'web') {
            $user = Auth::guard($user_type)->user();

            $result_mail = array();
            $result_mail[0] = [
                'receiver_id' => $user->id,
                'receiver_table' => 'users',
                'subject' => 'Thanks for registering on Student Portal',
                'type' => 'success_register'
            ];

            EmailController::send($result_mail);
        }

        return redirect('/');
    }

    public function update(Request $request)
    {
        $user = null;
        $table = $request['table'];
        $user_type = session()->get('userType');
        $owner = Auth::guard($user_type)->user();
        if ($table == 'teachers') {
            $user = Teacher::findOrFail($request['id']);
        } else if ($table == 'mentors') {
            $user = Mentor::findOrFail($request['id']);
        } else if ($table == 'students') {
            $user = Student::findOrFail($request['id']);
        } else if ($table == 'users') {
            $user = User::findOrFail($request['id']);
        }

        if (($owner->id === $user->id && $user_type . 's' == $table) || $user_type == 'teacher')
            $user->update($request->all());
        else
            abort(403, 'Unauthorized action.');
    }

    public function changeType(Request $request)
    {
        $user = User::findOrFail($request['id']);
        $user->remember_token=null;
        $userArray = $user->toArray();
        $newUser = null;
        if ($request['type'] == 'student') {
            $newUser = new Student($userArray);
            $newUser->group_id = Group::first()->id;
            $newUser->api_token='0';
        } else if ($request['type'] == 'teacher') {
            $newUser = new Teacher($userArray);
            $newUser->api_token='0';
        } else if ($request['type'] == 'mentor') {
            $newUser = new Mentor($userArray);
            $newUser->api_token='0';
        }
        $newUser->save();
        $user->delete();

        $result_mail = array();
        $result_mail[0] = [
            'receiver_id' => $newUser->id,
            'receiver_type' => $request['type'],
            'subject' => 'You are confirmed on Student Portal',
            'type' => 'confirm'
        ];

        EmailController::send($result_mail);
    }

    public function delete(Request $request)
    {
        $user = User::findOrFail($request['id']);
        $user->delete();
    }
}
