import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import TodayView from './components/TodayView'
import ProgramView from './components/ProgramView'
import LogView from './components/LogView'
import BadgeView from './components/BadgeView'
import { useProgram } from './hooks/useProgram'

export default function App() {
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('today')
  const {
    program, completedSessions,
    toggleExercise, isChecked, addLogEntry,
    updateWeight, updateExercise, addExercise,
    getTodayIndex, completeSession, skipSession,
    addPastSession, removeSession
  } = useProgram()

  if (splash) return <SplashScreen onComplete={() => setSplash(false)} />

  return (
    <div className="app">
      {tab === 'today' && (
        <TodayView
          program={program}
          getTodayIndex={getTodayIndex}
          toggleExercise={toggleExercise}
          isChecked={isChecked}
          completeSession={completeSession}
          skipSession={skipSession}
        />
      )}
      {tab === 'program' && (
        <ProgramView
          program={program}
          getTodayIndex={getTodayIndex}
          isChecked={isChecked}
          updateExercise={updateExercise}
          addExercise={addExercise}
        />
      )}
      {tab === 'log' && (
        <LogView
          completedSessions={completedSessions}
          addPastSession={addPastSession}
          removeSession={removeSession}
        />
      )}
      {tab === 'body' && (
        <BadgeView completedSessions={completedSessions} />
      )}

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12 }}>Today</span>
        </button>
        <button className={`nav-btn ${tab === 'program' ? 'active' : ''}`} onClick={() => setTab('program')}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12 }}>Program</span>
        </button>
        <button className={`nav-btn ${tab === 'log' ? 'active' : ''}`} onClick={() => setTab('log')}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12 }}>Log</span>
        </button>
        <button className={`nav-btn ${tab === 'body' ? 'active' : ''}`} onClick={() => setTab('body')}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12 }}>Body</span>
        </button>
      </nav>
    </div>
  )
}