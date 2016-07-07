<?php

namespace App\Http\Controllers;

use Faker\Provider\Image;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::guard($request['user_type'])->user();
        if($user->id==$request['user_id']){
            $file = Input::file('file');
            $size = $file->getSize();
            if($size<=2000000){
                $destinationPath = 'uploads'; // upload path
                $extension = $file->getClientOriginalExtension(); // getting image extension
                $fileName = 'pic-1000' . str_random(8) . '.' . $extension; // renaming image
                $file->move($destinationPath, $fileName); // uploading file to given path
                $user->profile_image_path = '/'.$destinationPath . '/' . $fileName;
                $user->save();
            }else{
                abort(602,'Size of file exceeds limit.');
            }
        }
    }
}
