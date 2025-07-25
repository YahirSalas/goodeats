// client/src/components/Navbar.jsx
import { supabase } from '../supabaseClient'

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <a href="/">Home</a> | <a href="/login">Login</a> |{' '}
      <a href="/Map">Map</a>
      <button onClick={handleLogout}>Sign Out</button>
    </nav>
  )
}
