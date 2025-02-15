
import './index.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Delivery } from './pages/delivery'
import { Dashboard } from './pages/dashboard'
import Home from './pages/home'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
