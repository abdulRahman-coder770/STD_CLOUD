<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable=[
      'user_id','topic','body','major_id','status','rejected_reason'
    ];
    public function answers(){
        return $this->hasMany('App\Models\Answer');
    }
    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    public function major(){
        return $this->belongsTo('App\Models\Major');
    }
}
