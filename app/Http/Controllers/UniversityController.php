<?php

namespace App\Http\Controllers;

use App\Models\Major;
use App\Models\University;
use Illuminate\Http\Request;

class UniversityController extends Controller
{

    public function getAllUnisTree(){
        $unis=University::all();
        foreach ($unis as $uni){
            $uni['majors']=$uni->majors;
            foreach ($uni['majors'] as $major){
                $major['courses']=$major->courses;
            }
        }
        return response()->json([
            'unis' => $unis,
        ]);
    }
    public function getDataChart(){
        $unis=University::all();

        $data[0]=['University','Users Count'];
        $count=1;
        foreach ($unis as $uni){
            $data[$count]=[$uni->uni_name,$uni->users->count()];
            $count++;
        }
        return response()->json([
           'data'=>$data
        ]);
    }

    public function getUni(Request $request){
        $uni=University::findOrFail($request->id);
        $uni['majors']=$uni->majors;

        $data[0]=['Major','Users Count'];
        $count=1;
        foreach ($uni->majors as $major){
            $data[$count]=[$major->major_name,$major->users->count()];
            $count++;
        }
        return response()->json([
            'uni'=>$uni,
            'chart_data'=>$data
        ]);
    }
    public function getAllUnis()
    {
        $unis=University::all();
        return response()->json([
            'unis' => $unis,
        ]);
    }
    public function addUni(Request $request){
        $checkUniName=University::where('uni_name',$request->uni_name)->get();
        $checkUniShortName=University::where('uni_short_name',$request->uni_short_name)->get();
        if (count($checkUniName) >0 || count($checkUniShortName)>0){
            return response()->json([
                'status'=>2,
            ]);
        }

        $uni=University::create($request->all());
        if ($uni){
            return response()->json([
                'status'=>1,
                'uni' => $uni,
            ]);
        }
        else
            return response()->json([
                'status'=>0,
                'error'=>'something wrong occurs while adding'
            ]);
    }
    public function editUni(Request $request,$uni_id){
        $checkUniName=University::where('uni_name',$request->uni_name)->get();
        $checkUniShortName=University::where('uni_short_name',$request->uni_short_name)->get();
        if (count($checkUniName) >1 || count($checkUniShortName)>1){
            return response()->json([
                'status'=>2,
            ]);
        }

        $uni_idArr=explode("_",$uni_id);
        $uni_id=$uni_idArr[1];

        $uni=University::findOrFail($uni_id);
        $uni->uni_name=$request->uni_name;
        $uni->uni_short_name=$request->uni_short_name;

        if ($uni->save()){
            return response()->json([
                'status'=>1,
                'uni' => $uni,
            ]);
        }
        else
            return response()->json([
                'status'=>0,
                'id'=>$uni_id,
                'error'=>'something wrong occurs while updating'
            ]);
    }
    public function deleteUni($uni_id){
        $uni_idArr=explode("_",$uni_id);
        $uni_id=$uni_idArr[1];

        $uni=University::findOrFail($uni_id);
        if ($uni->delete()){
            return response()->json([
                'status'=>1,
                'id' => $uni_id,
            ]);
        }
        else
            return response()->json([
                'status'=>0,
                'id'=>$uni_id,
                'error'=>'something wrong occurs while deleting'
            ]);
    }

}
