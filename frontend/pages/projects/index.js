import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/components/withAuth";

function ProjectsRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "employer") {
      router.replace("/employer/projects");
    } else {
      router.replace("/freelancer/projects");
    }
  }, [user, router]);

  return null;
}

export default withAuth(ProjectsRedirect);
