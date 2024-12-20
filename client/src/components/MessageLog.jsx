import React, { useEffect, useRef, useState } from "react";
import { useSharedState } from "../MyContext";

const MessageLog = () => {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const [messages, setMessages] = useState([]);
  const [userID, setUserID] = useState([]);
  const [matchedReason, setMatchedReason] = useState();
  const [matchedUsername, setMatchedUsername] = useState();
  const messagesEndRef = useRef(null);
  const [error, setError] = useState("");
  const { socket } = useSharedState();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_IP_AND_PORT}/user-metadata`, {
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
        setMatchedReason(data.matchedReason);
        setMatchedUsername(data.matchedUsername);
      })
      .then(() => {
        fetch(`${import.meta.env.VITE_SERVER_IP_AND_PORT}/message-history-of-current-match`, {
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
            console.log("setting messages");
            setMessages(data);
            setTimeout(scrollToBottom, 1000); // Scroll to bottom on initial load with delay
          });
      })
      .catch((error) => {
        setError("Error fetching data");
        setIsLoggedIn(false);
        console.log(error);
      });

    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
        },
      ]);
      setTimeout(scrollToBottom, 500); // Scroll to bottom when a new message appears with delay
    });
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 500); // Scroll to bottom whenever messages change with delay
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTimestamp = (date_string) => {
    const date = new Date(date_string);
    const now = new Date();

    // Remove time part from date objects for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date >= today) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date >= yesterday) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${date.toLocaleDateString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto text-zinc-100 p-4 flex-1 overflow-auto">
      <p className="text-center text-sm text-zinc-400 italic">
        You have been matched with {matchedUsername} because...
      </p>
      <p className="text-center text-zinc-200">{matchedReason}</p>

      {messages.length === 0 ? (
        <p className="text-center text-zinc-200">
          Send something to start the chat!
        </p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? messagesEndRef : null} // Set ref to last message
            className={`flex mb-2 sm:mb-4 ${
              message.senderId === userID ? "justify-end" : "justify-start"
            } `}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                message.senderId === userID ? "bg-zinc-600" : "bg-zinc-800"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <p
                className={`text-xs sm:text-sm text-zinc-400 mt-1 ${
                  message.senderId === userID ? "text-right" : "text-left"
                }`}
              >
                {formatTimestamp(message.createdTime)}
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
