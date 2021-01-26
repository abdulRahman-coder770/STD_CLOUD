<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function getMajorCourses(Request $request){
        $courses=Course::where('major_id',$request->major_id)->withCount('uploads')->get();
        foreach ($courses as $course){
            $course['uploads_num']=$course->uploads_count;
        }
        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function getCoursesByMajor(Request $request){
        $courses=Course::where('major_id',$request->major_id)->get();
        foreach ($courses as $course){
            $course['major_name']=$course->major->major_name;
        }
        return response()->json([
            'courses' => $courses,
        ]);
    }
    public function addCourse(Request $request){
        if (count(Course::where('major_id',$request->major_id)
                ->where('course_name',$request->course_name)
                ->get()) >0
            ||
            count(Course::where('major_id',$request->major_id)
                ->where('short_course_name',$request->course_short_name)->get()) >0
        ){
            return response()->json([
                'status'=>2
            ]);
        }
        $course=Course::create($request->all());
        $course['major_name']=$course->major->major_name;
        return response()->json([
            'course' => $course,
            'status'=>1
        ]);
    }

    public function deleteCourse($course_id){
        $major_idArr=explode("_",$course_id);
        $course_id=$major_idArr[1];

        $course=Course::findOrFail($course_id);
        if ($course->delete()){
            return response()->json([
                'status'=>1,
                'id' => $course_id,
            ]);
        }
        else
            return response()->json([
                'status'=>0,
                'id'=>$course_id,
                'error'=>'something wrong occurs while deleting'
            ]);
    }

    public function editCourse(Request $request,$course_id)
    {
        $major_idArr = explode("_", $course_id);
        $course_id = $major_idArr[1];
//        $major = Major::findOrFail($course_id);
        if (count(DB::table('courses')
                ->where('major_id', $request->major_id)
                ->where('course_name', $request->course_name)
                ->where('id', '!=', $course_id)
                ->get()) > 0
            ||
            count(DB::table('courses')
                ->where('major_id', $request->major_id)
                ->where('short_course_name', $request->short_course_name)
                ->where('id', '!=', $course_id)
                ->get()) > 0
        ) {
            return response()->json([
                'status' => 2,
            ]);
        } else {

            $course = Course::findOrFail($course_id);
            $course->major_id = $request->major_id;
            $course->course_name = $request->course_name;
            $course->short_course_name = $request->short_course_name;

            if ($course->update()) {
                $course['major_name']=$course->major->short_major_name;
                return response()->json([
                    'status' => 1,
                    'course' => $course,
                ]);
            } else
                return response()->json([
                    'status' => 0,
                    'id' => $course_id,
                    'error' => 'something wrong occurs while updating'
                ]);
        }
    }


}
