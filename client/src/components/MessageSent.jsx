import React from "react";

const MessageSent = ({ active, time, name, message }) => {
  const _class = active ? "bg-zinc-200" : "bg-white";
  return (
    <div>
      <div className="flex justify-end mr-4">
        <div className="flex items-end w-auto bg-purple-500 dark:bg-zinc-800 m-1 rounded-xl rounded-br-none ">
          <div className="p-2">
            <div className="text-gray-700 dark:text-gray-200">{message}</div>
            <div className="text-xs text-gray-400">{time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSent;
