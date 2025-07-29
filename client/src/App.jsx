import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/NavBar'
import SubmitDeal from './pages/SubmitDeal'
import MapCompnent from './components/MapComponent'
import Map from './pages/Map'
import RestaurantDetail from './pages/RestaurantDetail';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<p>404 Not Found</p>} />
        <Route path="/submit" element={session ? <SubmitDeal /> : <Login />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
