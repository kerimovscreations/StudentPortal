<?php

namespace App\Http\Controllers;

use App\Group;
use Illuminate\Http\Request;

use App\Http\Requests;

class GroupController extends Controller
{
    public function getAll() {
        $groups = Group::with('place')->orderBy('created_at', 'desc')->get();
        return json_encode($groups);
    }
    
    public function create(Request $request){
        Group::create($request->all());
    }
    
    public function delete(Request $request){
        $group=Group::findOrFail($request->id);
        $group->delete();
    }
}
