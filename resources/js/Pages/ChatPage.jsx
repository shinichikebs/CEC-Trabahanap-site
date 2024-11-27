<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Set axios base URL for all requests
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
=======
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 799b6669009074df6aabe96d31cabe67caac2ede
import axios from "axios";
>>>>>>> 8c4c85d6463f30a1ded158f2ace42c97d962da9b

export default function ChatPage({ contactUser }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
<<<<<<< HEAD
    const [error, setError] = useState(null); // To capture and display errors
    const messageEndRef = useRef(null); // For auto-scrolling to the latest message

    // Fetch messages from the backend
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/messages/${contactUser.id}`);
                const formattedMessages = response.data.map((msg) => ({
                    sender: msg.sender_id === contactUser.id ? contactUser.firstName : "You",
                    text: msg.content,
                    timestamp: new Date(msg.created_at).toLocaleString(), // Full date and time
                }));
                setMessages(formattedMessages);
                setError(null); // Clear any previous errors
            } catch (err) {
                setError("Failed to load messages. Please try again.");
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, [contactUser.id]);

    // Auto-scroll to the latest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                recipient_id: contactUser.id,
                content: message,
            };

            try {
                const response = await axios.post("/messages", newMessage);
                const sentMessage = {
                    sender: "You",
                    text: response.data.content,
                    timestamp: new Date(response.data.created_at).toLocaleString(),
                };

                // Update the local messages list and clear input
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setMessage("");
                setError(null); // Clear any previous errors
            } catch (err) {
                setError("Failed to send the message. Please try again.");
                console.error("Error sending message:", err);
=======

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
<<<<<<< HEAD
                // You can handle the error differently here (show a simple error message)
>>>>>>> 8c4c85d6463f30a1ded158f2ace42c97d962da9b
=======
>>>>>>> 799b6669009074df6aabe96d31cabe67caac2ede
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
<<<<<<< HEAD
                {error && (
                    <div className="mb-4 text-red-500 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}
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
                            <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
                        </div>
                    ))}
                    <div ref={messageEndRef}></div> {/* For auto-scrolling */}
=======
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
>>>>>>> 799b6669009074df6aabe96d31cabe67caac2ede
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
                    disabled={!message.trim()} // Disable button if input is empty
                >
                    Send
                </button>
            </form>
        </div>
    );
}
