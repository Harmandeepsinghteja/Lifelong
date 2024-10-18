import UserBioForm from "@/components/userBioForm";
import { useSharedState } from "../MyContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Bio = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div className="BioFormWrapper flex flex-col md:flex-row bg-zinc-950 h-auto w-full justify-center p-2">
      <UserBioForm></UserBioForm>
    </div>
  );
};

export default Bio;
