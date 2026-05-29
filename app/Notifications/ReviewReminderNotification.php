<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Order $order) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function viaMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Review Your Recent Purchase at Tech Komputer Hub')
            ->greeting('Hello, '.$notifiable->name.'!')
            ->line('Your order #'.$this->order->order_number.' has been delivered.')
            ->line('We would love to hear your thoughts on the products you purchased.')
            ->action('Write a Review', config('app.frontend_url').'/orders')
            ->line('Thank you for shopping with us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'message' => 'Silakan berikan review untuk pesanan #'.$this->order->order_number,
            'type' => 'review_reminder',
        ];
    }
}
