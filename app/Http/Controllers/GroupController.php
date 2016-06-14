<?php

namespace App\Http\Controllers;

use App\Group;
use Illuminate\Http\Request;

use App\Http\Requests;

class GroupController extends Controller
{
    public function getAll() {
        $groups = Group::all();
        return json_encode($groups);
    }
}
