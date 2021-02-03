<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public function receivesBroadcastNotificationsOn()
    {
        return 'App.Models.User.' . $this->id;
    }
    protected $fillable = [
        'name',
        'email',
        'password',
        'university_id',
        'role_id',
        'major_id',
        'photo_path',
        'email_verified_at',
        'about',
        'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function role(){
        return $this->belongsTo('App\Models\Role');
    }
    public function university(){
        return $this->belongsTo('App\Models\University');
    }
    public function major(){
        return $this->belongsTo('App\Models\Major');
    }
    public function uploads(){
        return $this->hasMany('App\Models\Upload');
    }
    public function answers(){
        return $this->hasMany('App\Models\Answer');
    }
    public function questions(){
        return $this->hasMany('App\Models\Question');
    }
    public function messages(){
        return $this->hasMany('App\Models\Message');
    }
    public function notes(){
        return $this->hasMany('App\Models\Note');
    }
    public function posts(){
        return $this->hasMany('App\Models\Post');
    }
    public function comments(){
        return $this->hasMany('App\Models\Comment');
    }
  public function replies(){
        return $this->hasMany('App\Models\Reply');
    }



}
