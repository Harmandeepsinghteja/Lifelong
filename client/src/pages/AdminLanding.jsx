import { useSharedState } from "../MyContext";
import AdminLogIn from "@/components/AdminLogIn";
import AdminContent from "@/components/AdminContent";

const AdminLanding = () => {
  const { isAdminLoggedIn } = useSharedState();
  return <>{isAdminLoggedIn ? <AdminContent /> : <AdminLogIn />}</>;
};

export default AdminLanding;
