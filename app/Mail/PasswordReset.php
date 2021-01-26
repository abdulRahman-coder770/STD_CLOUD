<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordReset extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $user_name;
    public $password;
    public function __construct($user_name,$password)
    {
        $this->user_name=$user_name;
        $this->password=$password;
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user_name=$this->user_name;
        $password=$this->password;
        return $this->view('passwordMail',compact('user_name','password'));
    }
}
