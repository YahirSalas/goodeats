// client/src/components/Navbar.jsx
import { supabase } from '../supabaseClient'
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';


export default function Navbar() {

  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <a href="/">Home</a> | <a href="/Map">Map</a> | 
      { user ? (
        <>
          <button onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <a href="/login">Login</a> 
      )}
    </nav>
  )
}
