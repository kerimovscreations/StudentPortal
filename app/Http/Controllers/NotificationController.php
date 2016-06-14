<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\Event;
use App\Notification;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function changeStatus(Request $request)
    {
        $event = Notification::findOrFail($request['id']);
        $event->status = 1;
        $event->save();
    }

    public function getByTableId($table, $id)
    {
        $notifications = DB::table('notifications')->where([
            ['receiver_id', intval($id)],
            ['receiver_table', $table],
        ])->get();
        return json_encode($notifications);
    }
    
    public function getCountByTableId($table, $id) {
        $count = DB::table('notifications')->where([
            ['receiver_id', intval($id)],
            ['receiver_table', $table],
            ['status', 0],
        ])->count();
        return json_encode($count);
    }
    
    public function getById($id) {
        $notification = Notification::all()->find($id);
        if ($notification->source_table == 'announcements') {
            $data = Announcement::all()->find($notification->source_id);
            $data->owner;
            $data->owner_type = 'teacher';
            $data->type='announcement';
        } else {
            $data = Event::all()->find($notification->source_id);
            $data->owner = DB::table($data->owner_table)->where('id', intval($data->owner_id))->select('id', 'name')->get();
            $data->owner_type = substr($data->owner_table, 0, -1);
            $data->receiver = DB::table($notification->receiver_table)->where('id', intval($notification->receiver_id))->select('id', 'name')->get();
            $data->receiver_type = substr($notification->receiver_table, 0, -1);
            if ($data->type == 'lesson') {
                if ($data->responsible_first_table != null)
                    $data->responsible_another = DB::table($data->responsible_second_table)->where('id', intval($data->responsible_second_id))->value('name');
                else
                    $data->responsible_another = 'Nobody';
            } else {
                if ($notification->receiver_type == 'student')
                    $data->responsible_another = DB::table($data->responsible_second_table)->where('id', intval($data->responsible_second_id))->value('name');
                else if ($notification->receiver_type == 'mentor')
                    $data->responsible_another = DB::table($data->responsible_first_table)->where('id', intval($data->responsible_first_id))->value('name');
            }
        }
        return json_encode($data);
    }
}
