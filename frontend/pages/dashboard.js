import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/components/withAuth";

function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "employer") {
      router.replace("/employer/dashboard");
    } else {
      router.replace("/freelancer/dashboard");
    }
  }, [user, router]);

  return null;
}

export default withAuth(Dashboard);
