<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Upload extends Model
{
    use HasFactory;

    protected $fillable=[
      'course_id',
      'description'
    ];

    public function files(){
        return $this->hasMany('App\Models\File');
    }
       public function course(){
        return $this->belongsTo('App\Models\Course');
    }

}
