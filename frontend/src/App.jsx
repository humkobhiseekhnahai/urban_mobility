
import './index.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Delivery } from './pages/delivery'
import { Dashboard } from './pages/dashboard'
import AuthSuccess from './pages/authSuccess'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
