<?php

namespace App\Http\Controllers;

use App\Mentor;
use App\Student;
use App\Teacher;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function getAll() {
        $students = Student::all();
        return json_encode($students);
    }
    public function getAllWithAttendances($date) {
        $students = Student::all();
        foreach ($students as $student) {
            $student->attendance=DB::table('attendances')->where('student_id',$student->id)->where('date',$date)->first();
        }
        return json_encode($students);
    }

    public function changeType(Request $request)
    {
        $user = Student::findOrFail($request['id']);
        $newUser = null;
        if ($request['type'] == 'teacher') {
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
            'subject' => 'Your user type has changed to '.$request['type'],
            'type' => 'user_type_change'
        ];

        EmailController::send($result_mail);
    }
}
