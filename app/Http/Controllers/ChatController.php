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
}
