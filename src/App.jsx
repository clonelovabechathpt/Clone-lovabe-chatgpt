import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthScreen from './AuthScreen'
import Shell from './Shell'
import './App.css'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="boot-screen">
        <span className="boot-mark">˙˙˙</span>
      </div>
    )
  }

  return session ? <Shell session={session} /> : <AuthScreen />
}
