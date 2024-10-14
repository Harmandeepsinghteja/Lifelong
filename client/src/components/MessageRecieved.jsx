import React from "react";

const MessageRecieved = ({ active, time, name, message }) => {
  return (
    <div>
      <div className="flex items-end w-3/4">
        <div className="w-8 m-3 rounded-full" />
        <div className="p-3 bg-zinc-800 mx-3 my-1 rounded-2xl rounded-bl-none ">
          <div className="text-gray-200 ">{message}</div>
          <div className="text-xs text-gray-400">{time}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageRecieved;
