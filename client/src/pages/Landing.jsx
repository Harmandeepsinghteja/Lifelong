import { useSharedState } from "../MyContext";
import LogIn from "@/components/log-in";
import Chat from "@/components/chat";
import NoMatch from "@/components/NoMatch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { isLoggedIn } = useSharedState();
  const [matchedUsername, setMatchedUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3000/user-metadata", {
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

          if (!data.bioComplete) {
            navigate('/bio');

          }

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
