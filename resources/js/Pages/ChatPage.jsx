import React, { useState } from "react";
import axios from "axios";

export default function ChatPage({ contactUser }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                // Send message to backend
                const response = await axios.post("/messages", {
                    recipient_id: contactUser.id,  // The recipient's ID
                    content: message,               // The content of the message
                });

                // Assuming the backend returns the new message
                const newMessage = response.data;
                
                // Add message to chat history
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: "You", text: message },
                ]);
                setMessage("");  // Reset the input after sending
            } catch (error) {
                console.error("Error sending message:", error);
                // You can handle the error differently here (show a simple error message)
            }
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-[#231955] text-white py-4 px-6 shadow">
                <h2 className="font-semibold text-xl">
                    Chat with {contactUser.firstName} {contactUser.lastName}
                </h2>
            </header>

            <div className="flex flex-col flex-1 p-6 bg-gray-100">
                <div className="flex flex-col flex-grow space-y-4 overflow-y-auto p-4 bg-white rounded-lg shadow">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg ${
                                msg.sender === "You"
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-300 text-black self-start"
                            }`}
                        >
                            <strong>{msg.sender}: </strong> {msg.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center p-4 bg-white border-t border-gray-300">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded-r-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
