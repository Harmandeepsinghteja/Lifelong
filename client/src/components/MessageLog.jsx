import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const MessageLog = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("initialMessages", (initialMessages) => {
      setMessages(
        initialMessages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
      );
      setTimeout(scrollToBottom, 1000); // Scroll to bottom on initial load with delay
    });

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp),
        },
      ]);
      setTimeout(scrollToBottom, 500); // Scroll to bottom when a new message appears with delay
    });

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 500); // Scroll to bottom whenever messages change with delay
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto text-zinc-100 p-4 flex-1 overflow-auto">
      {messages.length === 0 ? (
        <p className="text-center text-zinc-200">
          Send something to start the chat!
        </p>
      ) : (
        messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? messagesEndRef : null} // Set ref to last message
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-2 sm:mb-4`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                message.sender === "user" ? "bg-zinc-600" : "bg-zinc-800"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.text}
              </p>
              <p
                className={`text-xs sm:text-sm text-zinc-400 mt-1 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageLog;
