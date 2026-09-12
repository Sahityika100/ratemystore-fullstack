
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import StoreDashboard from './pages/StoreDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import StoreEdit from './pages/StoreEdit'
import { Route, Routes } from 'react-router-dom'
import CreateStore from './pages/CreateStore'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/store" element={
                        <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                            <StoreDashboard />
                        </ProtectedRoute>
                    }/>
        <Route path="/store/edit/:id" element={<StoreEdit />} />
        <Route path="/store/create" element={<CreateStore />} />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
        </ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
        </ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
