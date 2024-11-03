import { createContext, useState, useContext } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <MyContext.Provider
      value={{ isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </MyContext.Provider>
  );
};

const useSharedState = () => useContext(MyContext);

export { MyProvider, useSharedState };
