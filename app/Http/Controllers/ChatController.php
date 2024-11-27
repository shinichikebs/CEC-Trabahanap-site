<?php

namespace App\Http\Controllers;

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
        ]);
    }

<<<<<<< HEAD
    /**
     * Fetch chat messages between the authenticated user and the contact user.
     */
    public function fetchMessages(Request $request, $contactUserId)
    {
        $authUserId = auth()->id();

        // Validate the contact user exists
        User::findOrFail($contactUserId);

        // Retrieve messages between the authenticated user and the contact user
        $messages = Message::where(function ($query) use ($authUserId, $contactUserId) {
            $query->where('sender_id', $authUserId)
                  ->where('recipient_id', $contactUserId);
        })->orWhere(function ($query) use ($authUserId, $contactUserId) {
            $query->where('sender_id', $contactUserId)
                  ->where('recipient_id', $authUserId);
        })->orderBy('created_at', 'asc')
          ->get();

        return response()->json($messages);
    }

    /**
     * Store a new message sent by the authenticated user.
     */
    public function storeMessage(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|integer|exists:users,id',
            'content' => 'required|string|max:1000',
        ]);

        // Store the message
        $message = Message::create([
            'sender_id' => auth()->id(),
            'recipient_id' => $request->recipient_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        return response()->json($message, 201);
    }
=======
    public function storeMessage(Request $request)
    {
        // Ensure the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate the incoming request
        $request->validate([
            'recipient_id' => 'required|integer|exists:users,id',  // Ensure recipient exists
            'content' => 'required|string|max:1000',  // Validate message content
        ]);

        // Store the new message in the database
        $message = Message::create([
            'sender_id' => auth()->id(),  // Authenticated user as the sender
            'recipient_id' => $request->recipient_id,  // Recipient ID
            'content' => $request->content,  // Message content
            'is_read' => false,  // New message is unread by default
        ]);

        // Return the stored message as a response
        return response()->json($message, 201);
    }


    public function getMessages($contactId)
    {
        $userId = auth()->id();
        
        // Log the user and contactId for debugging purposes
        \Log::info("Fetching messages for user: $userId with contact: $contactId");
    
        // Fetch the messages between the authenticated user and the contact
        $messages = Message::where(function ($query) use ($contactId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('recipient_id', $contactId);  // Messages sent by the authenticated user to the contact
        })
        ->orWhere(function ($query) use ($contactId, $userId) {
            $query->where('sender_id', $contactId)
                  ->where('recipient_id', $userId);  // Messages sent by the contact to the authenticated user
        })
        ->orderBy('created_at', 'asc')  // Ensure messages are ordered by creation time
        ->get();
    
        // Log the actual messages returned
        \Log::info("Fetched messages: " . $messages->toJson());
    
        // Return the messages as JSON response
        return response()->json($messages);
    }
    

    
    
    
>>>>>>> 8c4c85d6463f30a1ded158f2ace42c97d962da9b
}

