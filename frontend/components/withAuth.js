/**
 * withAuth.js — Higher-Order Component for frontend route protection
 *
 * Usage:
 *   export default withAuth(MyPage)
 *
 * Behaviour:
 *  - While AuthContext is still hydrating from localStorage → renders nothing (avoids flash)
 *  - If no token is found → redirects to /login
 *  - If authenticated → renders the wrapped component normally
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function withAuth(WrappedComponent) {
  function AuthGuard(props) {
    const { token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !token) {
        console.log("[withAuth] No token found — redirecting to /login");
        router.replace("/login");
      }
    }, [token, loading, router]);

    // Still hydrating: render nothing to avoid a flash of protected content
    if (loading) return null;

    // Not authenticated: render nothing while redirect happens
    if (!token) return null;

    return <WrappedComponent {...props} />;
  }

  // Copy displayName for React DevTools
  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthGuard;
}
