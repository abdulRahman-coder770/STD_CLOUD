<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\File;
use App\Models\Major;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class UploadController extends Controller
{
    public function addUpload(Request $request)
    {
        $upload = new Upload();
        $upload->course_id = $request->course_id;
        $upload->description = $request->desc;
        $upload->year = $request->year;
        $upload->save();

        return response()->json([
            'upload_id' => $upload->id,
            'status' => 1,
        ]);
    }

    public function getMajorUploads(Request $request)
    {
        $major = Major::findOrFail($request->major_id);
        $courses = $major->courses()->get();
        foreach ($courses as $course) {
            $course['uploads'] = Upload::where('course_id', $course->id)->get();
            foreach ($course['uploads'] as $upload) {
                $upload['files'] = File::where('upload_id', $upload->id)->get();
            }
        }

        return response()->json([
            'uploads' => $courses,
            'status' => 1,
        ]);
    }

    public function getCourseUploads(Request $request)
    {

        $course = Course::findOrFail($request->course_id);
        $course['uploads'] = Upload::where('course_id', $course->id)->get();
        foreach ($course['uploads'] as $upload) {
            $upload['files'] = File::where('upload_id', $upload->id)->get();
        }


        return response()->json([
            'uploads' => [$course],
            'status' => 1,
        ]);
    }
//    public function searchMajorUploads(Request $request)
//    {
//        $major = Major::findOrFail($request->major_id);
//        $courses = $major->courses()->get();
//        foreach ($courses as $course) {
//            $course['uploads'] = Upload::where('course_id', $course->id)->get();
//            foreach ($course['uploads'] as $upload) {
//                $upload['files'] = File::where('upload_id', $upload->id)->get();
//            }
//        }
//
//        return response()->json([
//            'uploads' => $courses,
//            'status' => 1,
//        ]);
//    }

    public function downloadZipUpload(Request $request)
    {
        $headers = ["Content-Type" => "application/zip"];
        $upload_id = $request->upload_id;
        $upload_desc = Upload::findOrFail($upload_id)->description;
        $files = File::where('upload_id', $upload_id)->get();

        $zip_file = 'zips/' . $upload_desc . '.zip'; // Name of our archive to download

// Initializing PHP class
        $zip = new ZipArchive();
        $zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        foreach ($files as $file) {
            $file0 = public_path() . '/uploads/' . $file->file_path;

// Adding file: second parameter is what will the path inside of the archive
// So it will create another folder called "storage/" inside ZIP, and put the file there.
            $zip->addFile($file0, $file->file_path);
        }

        $zip->close();


// We return the file immediately after download
        return response()->json([
            'upload' => $upload_desc . ".zip",
            'status' => 1,
        ]);

    }
    public function deleteZip(Request $request){
        $file_name=$request->desc;
        unlink('zips/'.$file_name);
    }

    public function updateUpload(Request $request){
        $upload=Upload::findOrFail($request->id);
        $upload->description=$request->description;
        $upload->save();
        return response()->json([
            'status' => 1,
        ]);
    }
    public function deleteUpload(Request $request){
        $upload=Upload::findOrFail($request->id);
        foreach ($upload->files as $file){
            unlink('uploads/'. $file->file_path);
        }
        $upload->delete();
        return response()->json([
            'status' => 1,
        ]);
    }

}
