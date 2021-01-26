<?php

namespace App\Http\Controllers;

use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MajorController extends Controller
{
    public function getAllMajors(){
        $majors=Major::all();
        foreach ($majors as $major){
            $major['uni_name']=$major->university->uni_name;
        }
        return response()->json([
            'majors' => $majors,
        ]);
    }

    public function getUniMajors(Request $request){
        $majors=Major::where('university_id',$request->uni_id)->get();
        return response()->json([
            'majors' => $majors,
        ]);
    }
    public function getMajorsByUni(Request $request){

        if ($request->uni_id==0) {
            $majors = Major::all();
            foreach ($majors as $major){
                $major['uni_name']=$major->university->uni_short_name;
            }
        }
        else{
            $majors=Major::where('university_id',$request->uni_id)->get();
            foreach ($majors as $major){
                $major['uni_name']='';
            }
        }
        return response()->json([
            'majors' => $majors,
        ]);
    }

    public function addMajor(Request $request){
        if (count(Major::where('university_id',$request->uni_id)->where('major_name',$request->major_name)
       ->get()) >0
        ||
            count(Major::where('university_id',$request->uni_id)
                ->where('short_major_name',$request->major_short_name)->get()) >0
        ){
            return response()->json([
                'status'=>2
            ]);
        }
        $major=Major::create($request->all());
        $major['uni_name']=$major->university->uni_name;
        return response()->json([
            'major' => $major,
            'status'=>1
        ]);
    }
    public function deleteMajor($major_id){
        $major_idArr=explode("_",$major_id);
        $major_id=$major_idArr[1];

        $uni=Major::findOrFail($major_id);
        if ($uni->delete()){
            return response()->json([
                'status'=>1,
                'id' => $major_id,
            ]);
        }
        else
            return response()->json([
                'status'=>0,
                'id'=>$major_id,
                'error'=>'something wrong occurs while deleting'
            ]);
    }

    public function editMajor(Request $request,$major_id)
    {
        $major_idArr = explode("_", $major_id);
        $major_id = $major_idArr[1];
        $major = Major::findOrFail($major_id);
        if (count(DB::table('majors')
            ->where('university_id', $request->university_id)
                ->where('major_name', $request->major_name)
                ->where('id', '!=', $major_id)
                ->get()) > 0
            ||
            count(DB::table('majors')
                ->where('university_id', $request->university_id)
                ->where('short_major_name', $request->short_major_name)
                ->where('id', '!=', $major_id)
                ->get()) > 0
        ) {
            return response()->json([
                'status' => 2,
            ]);
        } else {

            $major = Major::findOrFail($major_id);
            $major->university_id = $request->university_id;
            $major->major_name = $request->major_name;
            $major->short_major_name = $request->short_major_name;

            if ($major->update()) {
                $major['uni_name']=$major->university->uni_short_name;
                return response()->json([
                    'status' => 1,
                    'major' => $major,
                ]);
            } else
                return response()->json([
                    'status' => 0,
                    'id' => $major_id,
                    'error' => 'something wrong occurs while updating'
                ]);
        }
    }



}
