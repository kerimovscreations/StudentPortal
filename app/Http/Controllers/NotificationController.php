<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\Event;
use App\Notification;
use App\Reservation;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Mockery\Matcher\Not;

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

    public function getCountByTableId($table, $id)
    {
        $count = DB::table('notifications')->where([
            ['receiver_id', intval($id)],
            ['receiver_table', $table],
            ['status', 0],
        ])->count();
        return json_encode($count);
    }

    public function getById($id)
    {
        $notification = Notification::findOrFail($id);
        $data=null;
        if ($notification->source_table == 'announcements') {
            $data = Announcement::findOrFail($notification->source_id);
            $data->owner;
            $data->owner_type = 'teacher';
            $data->type = 'announcement';
        } else if ($notification->source_table == 'reservations') {
            $data = Reservation::findOrFail($notification->source_id);
            $data->receiver = DB::table($notification->receiver_table)->where('id', intval($notification->receiver_id))->select('id', 'name')->first();
            $data->receiver_type = substr($notification->receiver_table, 0, -1);
            $data->type = 'reservation';

            if ($data->receiver_type == 'student')
                $data->responsible_another = $data->mentor()->first()->name;
            else if ($data->receiver_type == 'mentor')
                $data->responsible_another = $data->student()->first()->name;
        }
        return json_encode($data);
    }
    
    public function delete(Request $request){
        $list=$request['list'];
        foreach ($list as $id){
            Notification::findOrFail($id)->delete();
        }
    }
}
