import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPage({ contactUser }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Fetch messages from the backend
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/messages/${contactUser.id}`);
            
            // Log the response to inspect its structure
            console.log("Fetched messages:", response.data);
            setMessages(response.data);  // Update state with fetched messages
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Fetch messages when the component mounts
    useEffect(() => {
        fetchMessages();  // Fetch messages when the component mounts

        // Set up an interval to refresh messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);  // Adjust interval as needed
        return () => clearInterval(interval);  // Clean up interval when the component unmounts
    }, [contactUser.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (message.trim()) {
            try {
                const response = await axios.post("/messages", {
                    recipient_id: contactUser.id,
                    content: message,
                });

                const newMessage = response.data;

                // Add the new message to the chat history
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: "You", content: message },
                    { sender: contactUser.firstName, content: newMessage.content }
                ]);

                setMessage("");  // Reset input field
            } catch (error) {
                console.error("Error sending message:", error);
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
                <div className="flex flex-col space-y-4 overflow-y-auto p-4 bg-white rounded-lg shadow">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} mb-4`}
                            >
                                <div
                                    className={`p-4 rounded-lg max-w-xs ${
                                        msg.sender === "You"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-black"
                                    }`}
                                >
                                    <strong>{msg.sender === "You" ? "me" : msg.sender}: </strong>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No messages yet.</p>
                    )}
                </div>
            </div>

            <form className="flex items-center p-4 bg-white border-t border-gray-300" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="Type your message..."
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-r-lg"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
