<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class NotificationController extends Controller
{
    public function changeStatus(Request $request)
    {
        $event = \App\Notification::findOrFail($request['id']);
        $event->status = 1;
        $event->save();
    }
}
