import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from './helper/supabaseClient'
import Auth from './pages/auth'
import Register from './pages/Register'
import Login from './pages/Login'


function App() {

  const [session, setSession] = useState(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Register' element={<Register />}/>
        <Route path='/Login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
