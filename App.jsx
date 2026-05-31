import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WorkerRegister from './pages/WorkerRegister'
import ManagerLogin from './pages/ManagerLogin'
import ManagerDashboard from './pages/ManagerDashboard'
import WorkerProfile from './pages/WorkerProfile'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worker-register" element={<WorkerRegister />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/profile/:id" element={<WorkerProfile />} />
      </Routes>
    </div>
  )
}

export default App
