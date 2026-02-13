import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getMe } from "@/api/auth";
import { getAccessToken } from "@/api/client";
import { Spinner, Center } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const token = getAccessToken();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      if (!res.success || !res.data) throw new Error("Unauthorized");
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || !data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
