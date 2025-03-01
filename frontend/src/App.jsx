import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Delivery } from "./pages/delivery";
import { Dashboard } from "./pages/dashboard";
import Home from "./pages/home";
import Documentation from "./pages/documentation";
import AuthSuccess from "./pages/authSuccess";
import Login from "./pages/login";
import RoleSelection from "./pages/roleSelection";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/protectedRoute";
import Unauthorized from "./pages/unauthorized";
import { Dashboard2 } from "./pages/dashboard2";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/documentation" element={<Documentation />} />
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
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
