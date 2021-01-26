<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function addFiles(Request $request)
    {

        $file=$request->file('file');

        $name = time().'.'.$file->extension();
        $path= $file->move(public_path().'/uploads/', $name);
        $type=$file->getClientMimeType();

            if ($path) {
                $file = new File();
                $file->upload_id = $request->upload_id;
                $file->file_path = $name;
                $file->file_type = $type;
                if($file->save()){
                    return response()->json([
                        'status' => 1,
                        'file_name'=>$name
                    ]);
                }

            }


        return response()->json([
            'status' => 0,
            'upload'=>$request->upload_id,

        ]);

    }
}
