<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function show($id)
    {
        // Fetch the user you're chatting with
        $contactUser = User::findOrFail($id);

        // Pass the user to the ChatPage component
        return inertia('ChatPage', [
            'contactUser' => $contactUser,
        ]);
    }
}
