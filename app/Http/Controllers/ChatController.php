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

    public function storeMessage(Request $request)
    {
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
    
    
}
