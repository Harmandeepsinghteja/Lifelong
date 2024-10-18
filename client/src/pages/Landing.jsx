import { useSharedState } from "../MyContext";
import LogIn from "@/components/log-in";
import Chat from "@/components/chat";
import NoMatch from "@/components/NoMatch";
import { useState, useEffect } from "react";

const Landing = () => {
  const { isLoggedIn } = useSharedState();
  const [matchedUsername, setMatchedUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
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
          setMatchedUsername(data.matchedUsername);
          console.log(data);
        })
        .catch((error) => {
          setError("Error fetching data");
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  return (
    <>{!isLoggedIn ? <LogIn /> : matchedUsername ? <Chat /> : <NoMatch />}</>
  );
};

export default Landing;
