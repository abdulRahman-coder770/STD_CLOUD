<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;
    protected $fillable=[
      'data','type','user_id','read_at','notifiable_id'
    ];
    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    public function question(){
        return $this->belongsTo('App\Models\Question','notifiable_id');
    }
}
