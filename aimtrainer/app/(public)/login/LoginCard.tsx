'use client';

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginCard() {
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()

  return (
    <div className="my-20 mx-auto card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">Login</h2>

        <fieldset className="fieldset">
          <label className="fieldset-label">Username</label>
          <input type="text" className="input w-full" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />

          <label className="fieldset-label">Password</label>
          <input type="password" className="input w-full" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <div>Dont have an account? <a href="/register" className="link link-hover">Register it here</a></div>
          <button className="btn btn-neutral mt-4" onClick={() => signIn('username-creds', { username, password })}>Login</button>
        </fieldset>
      </div>
    </div>
  )
}