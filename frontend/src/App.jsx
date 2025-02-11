
import './index.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Delivery } from './pages/delivery'
import { Dashboard } from './pages/dashboard'
function App() {
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
