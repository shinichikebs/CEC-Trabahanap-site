<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Show the chat page with the contact user details.
     */
    public function show($id)
    {
        // Fetch the user you're chatting with
        $contactUser = User::findOrFail($id);

        // Pass the user to the ChatPage component
        return inertia('ChatPage', [
            'contactUser' => $contactUser,
            'currentUserId' => auth()->id(), // Pass authenticated user's ID to the frontend
        ]);
    }

    /**
     * Store a new message in the database.
     */
    public function storeMessage(Request $request)
    {
        // Ensure the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate the incoming request
        $request->validate([
            'recipient_id' => 'required|integer|exists:users,id', // Ensure recipient exists
            'content' => 'required|string|max:1000',             // Validate message content
        ]);

        // Store the new message in the database
        $message = Message::create([
            'sender_id' => auth()->id(),          // Authenticated user as the sender
            'recipient_id' => $request->recipient_id, // Recipient ID
            'content' => $request->content,       // Message content
            'is_read' => false,                   // New message is unread by default
        ]);

        // Now create a notification for the recipient
    $sender = auth()->user(); // Get the authenticated user (sender)
    $recipient = User::find($request->recipient_id); // Get the recipient user

    // Create the notification
    $notification = new Notification();
    $notification->user_id = $recipient->id; // Notify the recipient (contact user)
    $notification->sender_user_id = $sender->id; // Store the sender's ID
    $notification->message = "{$sender->firstName} {$sender->lastName} has sent you a message."; // Customize your message
    $notification->read = 0; // Unread notification
    $notification->save();

        // Return the stored message as a response
        return response()->json([
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'recipient_id' => $message->recipient_id,
            'content' => $message->content,
            'is_read' => $message->is_read,
            'timestamp' => $message->created_at,
            'sender' => 'You', // Always 'You' for messages created by the current user
        ], 201);

    }

    /**
     * Fetch messages between the authenticated user and the contact user.
     */
    public function getMessages($contactId)
    {
        $userId = auth()->id();

        // Log the user and contactId for debugging purposes
        \Log::info("Fetching messages for user: $userId with contact: $contactId");

        // Fetch the messages between the authenticated user and the contact
        $messages = Message::where(function ($query) use ($contactId, $userId) {
            $query->where('sender_id', $userId)
                ->where('recipient_id', $contactId); // Messages sent by the authenticated user to the contact
        })
            ->orWhere(function ($query) use ($contactId, $userId) {
                $query->where('sender_id', $contactId)
                    ->where('recipient_id', $userId); // Messages sent by the contact to the authenticated user
            })
            ->orderBy('created_at', 'asc') // Ensure messages are ordered by creation time
            ->get();

        // Enrich messages with a 'sender' field for alignment on the frontend
        $messages = $messages->map(function ($message) use ($userId) {
            return [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'recipient_id' => $message->recipient_id,
                'content' => $message->content,
                'is_read' => $message->is_read,
                'timestamp' => $message->created_at,
                'sender' => $message->sender_id === $userId ? 'You' : 'Contact', // Identify the sender for alignment
            ];
        });

        // Log the enriched messages returned
        \Log::info("Fetched enriched messages: " . $messages->toJson());

        // Return the enriched messages as JSON response
        return response()->json($messages);
    }

    // In ChatController.php

    public function markMessagesAsRead($contactId)
    {
        $userId = auth()->id();

        // Mark messages as read where the recipient is the authenticated user and the message is not already read
        Message::where('recipient_id', $userId)
            ->where('sender_id', $contactId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marked as read.']);
    }

}
