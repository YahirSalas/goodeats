import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm your signup.')
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error('Login error:', error)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{isSigningUp ? 'Sign Up' : 'Log In'} to GoodEats</h2>

      <form onSubmit={isSigningUp ? handleSignup : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">
          {isSigningUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <br />
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <br /><br />

      <button onClick={() => setIsSigningUp(!isSigningUp)}>
        {isSigningUp ? 'Already have an account? Log in' : 'Create a new account'}
      </button>
    </div>
  )
}
