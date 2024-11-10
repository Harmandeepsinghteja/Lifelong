import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [matchedUsername, setMatchedUsername] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const newSocket = io("http://localhost:3000", { autoConnect: false });
      const token = localStorage.getItem("token");
      newSocket.auth = { token };
      try {
        newSocket.connect();
        setSocket(newSocket);
      }
      catch (err) {
        console.log("Socket connection error: ", err);
      }
    }
  }, [isLoggedIn]);

  return (
    <MyContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, matchedUsername, setMatchedUsername, socket, setSocket }}
    >
      {children}
    </MyContext.Provider>
  );
};

const useSharedState = () => useContext(MyContext);

export { MyProvider, useSharedState };
