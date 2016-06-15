<?php

namespace App\Http\Controllers;

use App\Group;
use App\Mentor;
use App\Student;
use App\Teacher;
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

    public function getDataUser($table, $id)
    {
        if ($table == 'students') {
            $user = DB::table($table)->where('id', intval($id))->select('name', 'email', 'group_id', 'phone', 'birthDate', 'bio')->get();
            $user[0]->group = Group::find($user[0]->group_id)->name;
        } else {
            $user = DB::table($table)->where('id', intval($id))->select('name', 'email', 'bio', 'work_days', 'work_start_time', 'work_end_time')->get();
        }
        return json_encode($user[0]);
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
        }

        if ($owner->id === $user->id && ($user_type . 's' == $table || $user_type == 'teacher'))
            $user->update($request->all());
        else
            abort(403, 'Unauthorized action.');
    }
}
