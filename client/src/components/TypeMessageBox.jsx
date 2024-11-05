import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });
const token = localStorage.getItem("token");
socket.auth = { token };
socket.connect();

export default function MessageInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = React.useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("message", { content: newMessage });
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 border-t border-zinc-800 bg-zinc-900 sticky bottom-0">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-end space-x-2"
      >
        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600 min-h-[2.5rem] max-h-[200px] resize-none text-sm sm:text-base md:text-lg"
          style={{ overflow: "auto" }}
        />

        <Button
          type="submit"
          size="icon"
          className="bg-zinc-700 hover:bg-zinc-500 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" color="ivory" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
