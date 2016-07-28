<?php

namespace App\Http\Controllers;

use App\Mentor;
use App\Student;
use App\Teacher;
use Illuminate\Http\Request;

use App\Http\Requests;

class MentorController extends Controller
{

    public function getAll()
    {
        $mentors = Mentor::all();
        return json_encode($mentors);
    }

    public function changeType(Request $request)
    {
        $user = Mentor::findOrFail($request['id']);
        $newUser = null;
        if ($request['type'] == 'teacher') {
            $newUser = new Teacher();
        } else if ($request['type'] == 'student') {
            $newUser = new Student();
            $newUser->birthDate='01-01-1996';
            $newUser->phone='+994505000000';
            $newUser->group_id=$request['group_id'];
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
            'subject' => 'Your user type has changed to '.$request['type'],
            'type' => 'user_type_change'
        ];

        EmailController::send($result_mail);
    }
}
