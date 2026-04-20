import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import TodayView from './components/TodayView'
import ProgramView from './components/ProgramView'
import LogView from './components/LogView'
import BadgeView from './components/BadgeView'
import { useProgram } from './hooks/useProgram'

function GlobalOrnament() {
  return (
    <>
      <style>{`
        @keyframes glow-burgundy {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.55; }
        }
        @keyframes glow-gold {
          0%, 20%  { opacity: 0; }
          45%      { opacity: 0.6; }
          70%, 100%{ opacity: 0; }
        }
        @keyframes glow-violet {
          0%, 50%  { opacity: 0; }
          72%      { opacity: 0.5; }
          95%, 100%{ opacity: 0; }
        }
        @keyframes glow-blue {
          0%, 68%  { opacity: 0; }
          83%      { opacity: 0.45; }
          100%     { opacity: 0; }
        }
        @keyframes sparkle {
          0%, 85%  { opacity: 0; filter: invert(1) sepia(0) saturate(1) brightness(3); }
          88%      { opacity: 0.7; filter: invert(1) sepia(0) saturate(1) brightness(4) drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(201,168,76,0.8)); }
          91%      { opacity: 0.2; }
          93%      { opacity: 0.6; filter: invert(1) sepia(0) saturate(1) brightness(3.5) drop-shadow(0 0 15px rgba(255,255,255,0.7)); }
          96%      { opacity: 0.1; }
          100%     { opacity: 0; }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 0,
        width: '100%', maxWidth: 480
      }}>
        {/* Base burgundy */}
        <img src="/duvaan-ornament.png" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100vw', maxWidth: 500,
          filter: 'invert(1) sepia(1) saturate(2.5) hue-rotate(290deg) brightness(0.55)',
          animation: 'glow-burgundy 9s ease-in-out infinite'
        }} />

        {/* Gold layer */}
        <img src="/duvaan-ornament.png" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100vw', maxWidth: 500,
          filter: 'invert(1) sepia(1) saturate(4) hue-rotate(335deg) brightness(1.1)',
          animation: 'glow-gold 9s ease-in-out infinite',
          opacity: 0
        }} />

        {/* Violet layer */}
        <img src="/duvaan-ornament.png" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100vw', maxWidth: 500,
          filter: 'invert(1) sepia(1) saturate(3) hue-rotate(230deg) brightness(0.7)',
          animation: 'glow-violet 9s ease-in-out infinite',
          opacity: 0
        }} />

        {/* Blue layer */}
        <img src="/duvaan-ornament.png" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100vw', maxWidth: 500,
          filter: 'invert(1) sepia(1) saturate(3) hue-rotate(185deg) brightness(0.65)',
          animation: 'glow-blue 9s ease-in-out infinite',
          opacity: 0
        }} />

        {/* Sparkle layer */}
        <img src="/duvaan-ornament.png" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100vw', maxWidth: 500,
          animation: 'sparkle 9s ease-in-out infinite',
          opacity: 0
        }} />

        {/* Spacer */}
        <img src="/duvaan-ornament.png" style={{ width: '100vw', maxWidth: 500, visibility: 'hidden' }} />
      </div>
    </>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('today')

  const {
    program, completedSessions,
    toggleExercise, isChecked,
    updateExercise, addExercise,
    getTodayIndex, completeSession, skipSession,
    addPastSession, removeSession
  } = useProgram()

  if (splash) return <SplashScreen onComplete={() => setSplash(false)} />

  return (
    <div className="app">
      <GlobalOrnament />

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