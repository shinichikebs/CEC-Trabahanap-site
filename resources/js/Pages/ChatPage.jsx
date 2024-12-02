import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { IoMdArrowBack } from "react-icons/io";

export default function ChatPage({ contactUser, currentUserId }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch messages from the backend on initial page load
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/messages/${contactUser.id}`);
                const enrichedMessages = response.data.map((msg) => ({
                    ...msg,
                    sender: msg.sender_id === currentUserId ? "You" : contactUser.firstName, // Replace 'Contact' with firstName
                }));
                setMessages(enrichedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [contactUser.id, contactUser.firstName, currentUserId]);



    // Scroll to the bottom of the messages container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send message function
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (message.trim()) {
            try {
                const response = await axios.post("/messages", {
                    recipient_id: contactUser.id,
                    content: message,
                });

                // Add the sent message directly to the chat with 'You' as sender
                const sentMessage = {
                    ...response.data,
                    sender: "You",
                };

                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setMessage(""); // Clear the input field
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleBackClick = () => {
        window.history.back();
    };
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#231955] text-white py-4 px-6 shadow flex items-center justify-between">
                <h2 className="font-semibold text-xl">
                    Chat with {contactUser.firstName} {contactUser.lastName}
                </h2>
                <button
                    onClick={() => window.history.back()}
                    className="text-[#E8AA42] bg-transparent border border-[#E8AA42] jutify-end item-end rounded-lg py-2 px-4 hover:bg-[#D18C33] hover:text-white transition duration-200"
                >
                    <IoMdArrowBack />
                </button>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === "You" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`p-4 rounded-lg max-w-sm ${
                                msg.sender === "You"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                            {/* Sender Name */}
                            <div className="font-bold mb-1 text-sm">{msg.sender}</div>
                            {/* Message Content */}
                            <div>{msg.content}</div>
                            {/* Timestamp */}
                            <div className="text-xs text-gray-500 mt-2">
                                {moment(msg.timestamp).format("h:mm A, MMM D")}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Auto-scroll reference element */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                className="flex items-center p-4 bg-white border-t border-gray-300"
                onSubmit={handleSendMessage}
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="Type your message..."
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                >
                    Send
                </button>
            </form>
        </div>
    );
}