import { useState } from 'react'
import { supabase } from './supabaseClient'
import AgeCalculator from './AgeCalculator'
import Dashboard from './Dashboard'
import './Shell.css'

export default function Shell({ session }) {
  const [tab, setTab] = useState('calculator')

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-mark">
          <span className="shell-mark-num">A</span>ge
        </div>

        <nav className="shell-tabs">
          <button
            className={tab === 'calculator' ? 'shell-tab shell-tab--active' : 'shell-tab'}
            onClick={() => setTab('calculator')}
          >
            Calculator
          </button>
          <button
            className={tab === 'dashboard' ? 'shell-tab shell-tab--active' : 'shell-tab'}
            onClick={() => setTab('dashboard')}
          >
            My uploads
          </button>
        </nav>

        <div className="shell-account">
          <span className="shell-email">{session.user.email}</span>
          <button className="shell-logout" onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </div>
      </header>

      <main className="shell-main">
        {tab === 'calculator' ? <AgeCalculator /> : <Dashboard session={session} />}
      </main>
    </div>
  )
}
