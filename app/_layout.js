import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

export default function Layout() {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
}

function ProtectedRoutes() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!user && segments[0] !== "(auth)") {
      router.replace("/login");
    }
  }, [user, segments]);

  return <Stack
  screenOptions={{
    headerShown: false,
  }}
/>;
}
