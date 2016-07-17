<?php

namespace App\Http\Controllers;

use App\File;
use Illuminate\Http\Request;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension(); // getting image extension
        $fileName = 'file-1000' . date('m-d-Y_hia') . '.' . $extension; // renaming image
        Storage::disk('local')->put(
            'files/' . $fileName,
            file_get_contents($request->file('file')->getRealPath())
        );

        $file_db_item = new File(['name' => $file->getClientOriginalName(),
            'path' => 'files/' . $fileName,
            'content_type' => $file->getMimeType()]);
        $file_db_item->save();

        return json_encode(['href' => '/getFile/' . $file_db_item->id]);
    }

    public function get($id, Request $request)
    {
        $file_element = File::findOrFail($id);
        $file = Storage::disk('local')->get($file_element->path);
        return (new Response($file, 200))
            ->withHeaders([
                'Content-Type' => $file_element->content_type,
                'Content-Disposition' => "attachment; filename=\"".$file_element->name."\""
            ]);
    }
}
