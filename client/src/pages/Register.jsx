import React from 'react'
import { useState } from 'react'
import { supabase } from '../helper/supabaseClient'

function Register() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("")

    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (error) {
        setMessage(error.message)
        return;
    }

    if (data){
        setMessage("User Account Created!");
    }

    setEmail("")
    setPassword("")
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-1"></h2>
        <div className="h-1 w-20 mx-auto bg-blue-500 rounded-full mb-6"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              
              onChange= {(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
          >
          </button>
        </form>
      </div>
      </div>
    </div>
  )
}

export default Register
