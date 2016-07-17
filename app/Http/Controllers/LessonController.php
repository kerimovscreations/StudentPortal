<?php

namespace App\Http\Controllers;

use App\Event;
use App\Lesson;
use Illuminate\Http\Request;


class LessonController extends Controller
{
    public function create(Request $request)
    {
        Lesson::create($request->all());
    }

    public function get(Lesson $lesson)
    {
        return json_encode($lesson);
    }

    public function update(Request $request)
    {
        $lesson = Lesson::findOrFail($request['id']);
        $lesson->update($request->all());
    }

    public function delete(Request $request)
    {
        $lesson = Lesson::findOrFail($request['id']);
        $lesson->delete();

    }
}
