import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function AuthPage(){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setLoading(true)
    try{
      if(mode === 'login'){
        await signInWithEmailAndPassword(auth, email, password)
      }else{
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    }catch(err){
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded" />
        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="px-3 py-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{mode === 'login' ? 'Sign in' : 'Sign up'}</button>
      </form>
      <div className="mt-4 text-sm">
        {mode === 'login' ? (
          <p>Don't have an account? <button onClick={()=>setMode('signup')} className="text-blue-600">Create one</button></p>
        ) : (
          <p>Have an account? <button onClick={()=>setMode('login')} className="text-blue-600">Sign in</button></p>
        )}
      </div>
    </div>
  )
}

