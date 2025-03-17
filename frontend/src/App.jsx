import React from "react";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Delivery from "./pages/delivery";
import { Dashboard } from "./pages/dashboard";
import Home from "./pages/home";
import DocsPage from "./components/documentation_folder/docMain";
import AuthSuccess from "./pages/auth/authSuccess";
import Login from "./pages/auth/login";
import RoleSelection from "./pages/auth/roleSelection";
import Signup from "./pages/auth/signup";
import ProtectedRoute from "./components/protectedRoute";
import Unauthorized from "./pages/auth/unauthorized";
import { Public } from "./pages/public";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/documentation" element={<DocsPage />} />     
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={"user" | "operator" | "partner"}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/public"
            element={
              <ProtectedRoute role={"operator"}>
                <Public />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery"
            element={
              <ProtectedRoute role="partner">
                <Delivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-select"
            element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
