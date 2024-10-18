import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSharedState } from "../MyContext";

const socket = io("http://localhost:3000");

const MessageLog = () => {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const [messages, setMessages] = useState([]);
  const [userID, setUserID] = useState([]);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/user-meta-data", {
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoggedIn(true);
        setUserID(data.userID);
      })
      .catch((error) => {
        setError("Error fetching data");
        setIsLoggedIn(false);
        console.log(error);
      });

    socket.on("initialMessages", (initialMessages) => {
      console.log("setting messages");
      setMessages(
        initialMessages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
      );
      console.log(messages);
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
            key={index}
            ref={index === messages.length - 1 ? messagesEndRef : null} // Set ref to last message
            className={`flex ${
              message.sender === userID ? "justify-end" : "justify-start"
            } mb-2 sm:mb-4`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                message.sender === userID ? "bg-zinc-600" : "bg-zinc-800"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.text}
              </p>
              <p
                className={`text-xs sm:text-sm text-zinc-400 mt-1 ${
                  message.sender === userID ? "text-right" : "text-left"
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
