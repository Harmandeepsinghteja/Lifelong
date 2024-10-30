import "./App.css";
import { useState, useEffect, useMemo, useLayoutEffect } from "react";
import AdminLogIn from "./components/AdminLogIn";
import AdminContent from "./components/AdminContent";

import { useSharedState } from "./MyContext";



function App() {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();


  useLayoutEffect(() => {
    if (localStorage.getItem("adminToken")) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, []);

  return <>{isLoggedIn ? <AdminContent /> : <AdminLogIn />}</>;
}

export default App;
