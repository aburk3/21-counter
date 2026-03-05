import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/AppShell";
import { hasToken } from "@/lib/api";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Play from "@/pages/Play";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  if (!hasToken()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppShell title="Training Dashboard" context="Dashboard">
              <Dashboard />
            </AppShell>
          </PrivateRoute>
        }
      />
      <Route
        path="/play"
        element={
          <PrivateRoute>
            <AppShell title="Card Counting Training" context="Training Session">
              <Play />
            </AppShell>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={hasToken() ? "/dashboard" : "/auth"} replace />} />
    </Routes>
  );
};

export default App;
