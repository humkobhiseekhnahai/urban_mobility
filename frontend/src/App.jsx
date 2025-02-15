
import './index.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Delivery } from './pages/delivery'
import { Dashboard } from './pages/dashboard'
import Home from './pages/home'
import Documentation from './pages/documentation'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/documentation" element={<Documentation/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
