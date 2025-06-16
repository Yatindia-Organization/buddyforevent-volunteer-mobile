import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useGlobalInfo } from "../../context/GlobalContext";

export default function Index() {
  const { isLoggedIn } = useGlobalInfo();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isLoggedIn]);

  return null;
}
