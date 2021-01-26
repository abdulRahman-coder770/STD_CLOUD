<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    use HasFactory;
    protected $fillable=[

        'body',
        'comment_id',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    public function comment(){
        return $this->belongsTo('App\Models\Comment');
    }

}
