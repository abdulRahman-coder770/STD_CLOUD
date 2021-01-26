<?php

namespace App\Notifications;
//namespace App\Events;

use App\Models\Question;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class QuestionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $question;

    /**
     * Create a new notification instance.
     *
     * @param Question $question
     */
    public function __construct($question)
    {
        $this->question = $question;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
//    public function via($notifiable)
//    {
//        return ['mail'];
//    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }


    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
//            'major' => [
//                'id' => $this->question->user->major_id,
//            ],
//            'user' => [
//                'id' => $this->question->user_id,
//                'name' => $this->question->user->name,
//
//            ],
            'question' => [
                'id' => $this->question->id,
                'user_id' => $this->question->user_id,
                'major_id' => $this->question->major_id,
                'body' => $this->question->body,
                'topic' => $this->question->topic,
                'created_at' => $this->question->created_at,
            ],
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage(
            [
                'id' => $this->question->id,
                'user_id' => $this->question->user_id,
                'major_id' => $this->question->major_id,
                'body' => $this->question->body,
                'topic' => $this->question->topic,
                'created_at' => $this->question->created_at,
            ]
        );
    }

    public function broadcastType()
    {
        return 'new-question';
    }
}
