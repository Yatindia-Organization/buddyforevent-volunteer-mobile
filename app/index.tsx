import { useGlobalInfo } from "../context/GlobalContext";
import DashboardScreen from "./dashboard";
import LoginScreen from "./login";

export default function Index() {
  const { isLoggedIn } = useGlobalInfo();

  if (isLoggedIn) {
    return <DashboardScreen />;
  }
  return <LoginScreen />;
}
