<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;
    protected $fillable=[
        'upload_id',
        'file_path',
        'file_type',
        'file_size'
    ];

    public function upload(){
        return $this->belongsTo('App\Models\Upload');
    }
}
