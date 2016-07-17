<?php

namespace App\Http\Controllers;

use App\Group;
use App\Mentor;
use App\Student;
use App\Teacher;
use App\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use App\Http\Requests;

class UserController extends Controller
{
    public function getInfo()
    {
        $result = Auth::guard(session('userType'))->user()->toArray();
        $result['type'] = session('userType');
        return json_encode($result);
    }

    public static function pending()
    {
        $users = User::all();
        return $users;
    }
    
    public function getDataUser($table, $id)
    {
        $user=null;
        if ($table == 'students') {
            if(Auth::guard('student')->check()){
                if(Auth::guard('student')->user()->id==$id){
                    $user = Student::findOrFail($id);
                    $user->group = Group::find($user->group_id)->name;
                }else{
                    return redirect('/');
                }
            }else if(Auth::guard('teacher')->check() || Auth::guard('mentor')->check()){
                $user = Student::findOrFail($id);
                $user->group = Group::find($user->group_id)->name;
            }
        } else if ($table == 'users') {
            $user = User::findOrFail($id);
        } else if($table == 'teachers'){
            $user = Teacher::findOrFail($id);
        }else if($table == 'mentors'){
            $user = Mentor::findOrFail($id);
        }
        return json_encode($user);
    }

    public function email()
    {
        $user_type = session()->get('userType');
        if ($user_type == 'web') {
            $user = Auth::guard($user_type)->user();

            $result_mail = array();
            $temp_mail = [
                'receiver_id' => $user->id,
                'receiver_table' => 'users',
                'subject' => 'Thanks for registering on Student Portal',
                'type' => 'success_register'
            ];
            array_push($result_mail, $temp_mail);

            $teachers = DB::table('teachers')->lists('id');

            foreach($teachers as $id) {
                $temp_mail1 = [
                    'receiver_id' => $id,
                    'registered_user' => $user->name,
                    'subject' => 'New registered user on Student Portal: ' . $user->name,
                    'type' => 'teacher_registered'
                ];
                array_push($result_mail, $temp_mail1);
            }

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

        if (($owner->id === $user->id && $user_type . 's' == $table) || $user_type == 'teacher') {
            if ($request['old_pass'] != null) {
                if (password_verify($request['old_pass'], $user->getAuthPassword())) {
                    $user->password = bcrypt($request['new_pass']);
                } else {
                    return 2;
                }
            }
            $user->update($request->all());
        } else
            abort(403, 'Unauthorized action.');
    }

    public function changeType(Request $request)
    {
        $user = User::findOrFail($request['id']);
        $user->remember_token = null;
        $newUser = null;
        if ($request['type'] == 'student') {
            $newUser = new Student();
            $newUser->group_id = $request['group_id'];
            $newUser->phone = $user->phone;
            $newUser->birthDate = $user->birthDate;
        } else if ($request['type'] == 'teacher') {
            $newUser = new Teacher();
        } else if ($request['type'] == 'mentor') {
            $newUser = new Mentor();
        }
        $newUser->api_token = str_random(60);
        $newUser->name = $user->name;
        $newUser->email = $user->email;
        $newUser->password = $user->password;
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
