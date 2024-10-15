import { useSharedState } from "../MyContext";
import LogIn from "@/components/log-in";
import Chat from "@/components/chat";

const Landing = () => {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  return <>{isLoggedIn ? <Chat /> : <LogIn />}</>;
};

export default Landing;
