<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;
    protected $fillable = [
        'uni_name',
        'uni_short_name',

    ];

    public function users(){
        return $this->hasMany('App\Models\User');
    }

    public function majors(){
        return $this->hasMany('App\Models\Major');
    }
}
