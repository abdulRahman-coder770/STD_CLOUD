<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'university_id',
        'major_id',
        'course_name',
        'short_course_name',
    ];
    public function major(){
        return $this->belongsTo('App\Models\Major');
    }
    public function uploads(){
        return $this->hasMany('App\Models\Upload');
    }
}
