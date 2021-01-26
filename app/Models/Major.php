<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;
    protected $fillable = [
        'university_id',
        'major_name',
        'short_major_name',
    ];
    public function courses(){
        return $this->hasMany('App\Models\Course');
    }
    public function users(){
        return $this->hasMany('App\Models\User');
    }
    public function university(){
        return $this->belongsTo('App\Models\University');
    }
}
