import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Delivery } from './pages/delivery'
import { Dashboard } from './pages/dashboard'
import AuthSuccess from './pages/authSuccess'
import Login from './pages/login'
import RoleSelection from './pages/roleSelection'
import Signup from './pages/signup'
import ProtectedRoute from './components/protectedRoute'
import Unauthorized from './pages/unauthorized'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute role="operator">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/delivery" element={
            <ProtectedRoute role="operator">
              <Delivery />
            </ProtectedRoute>
          } />
          <Route path="/role-select" element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App