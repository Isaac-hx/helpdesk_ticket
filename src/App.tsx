import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import './App.css'
import Home from './pages/Home';
import DetailWork from "./pages/DetailWork";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { getCookie } from "./helper/getCookie";
import Admin from "./pages/Admin";
import DetailAdmin from "./pages/DetailAdmin";

 function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login-admin"); // redirect jika belum login
    }
  }, [token, navigate]);

  return <>{token ? children : null}</>;
}
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Home/>}/>
          <Route path='/detail-work/:ticket_id'  element={<DetailWork/>}/>
          <Route path="/login-admin" element={<Login/>} />
          <Route path="/register-admin" element={<Register/>} />
          <Route path="/dashboard-helpdesk" element ={          <ProtectedRoute>
            <Admin/>
            </ProtectedRoute>}/>
                      <Route path="/detail-work-admin/:ticket_id" element ={          <ProtectedRoute>
            <DetailAdmin/>
            </ProtectedRoute>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
