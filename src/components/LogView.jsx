import { useState } from 'react'

const BackgroundOrnament = () => (
  <div style={{
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', zIndex: 0,
    width: '100%',
    maxWidth: 480
  }}>
    <img src="/duvaan-ornament.png" style={{
      width: '100vw',
      maxWidth: 500,
      opacity: 0.22,
      filter: 'invert(1) sepia(1) saturate(2) hue-rotate(290deg) brightness(0.4)'
    }} />
  </div>
)

const glassBox = {
  background: 'linear-gradient(135deg, rgba(140,40,65,0.45) 0%, rgba(70,10,25,0.15) 50%, rgba(110,28,50,0.38) 100%)',
  border: '1px solid rgba(201,168,76,0.2)',
  borderTop: '1px solid rgba(201,168,76,0.4)',
  borderLeft: '2px solid rgba(150,50,70,0.5)',
  borderRadius: 6,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.08), inset 1px 0 0 rgba(201,168,76,0.06)'
}

export default function LogView({ completedSessions = [], addPastSession, removeSession }) {
  const [pastDate, setPastDate] = useState('')
  const [sessionSaved, setSessionSaved] = useState(false)

  function handlePastSession() {
    if (!pastDate) return
    const dateObj = new Date(pastDate)
    const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai']
    addPastSession({ date: pastDate, day: dayNames[dateObj.getDay()] })
    setSessionSaved(true)
    setTimeout(() => setSessionSaved(false), 2000)
  }

  return (
    <div className="view" style={{ position: 'relative' }}>
      <BackgroundOrnament />
      <div style={{ position: 'relative', zIndex: 3 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 20 }}>
          Log
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: 'var(--gold)', marginBottom: 16, letterSpacing: '0.05em' }}>
          Lisää sessio
        </p>

        <div style={{ ...glassBox, marginBottom: 10 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
          <input
            type="date"
            value={pastDate}
            onChange={e => setPastDate(e.target.value)}
            style={{ background: 'transparent', border: 'none', padding: '12px 16px', width: '100%', color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", fontSize: 14, outline: 'none' }}
          />
        </div>

        <button onClick={handlePastSession} style={{
          ...glassBox, width: '100%', padding: '14px',
          color: 'var(--gold)', fontSize: 12, letterSpacing: '0.15em',
          textTransform: 'uppercase', borderRadius: 6, marginBottom: 8,
          fontFamily: "'Cormorant Garamond', serif", cursor: 'pointer', display: 'block', textAlign: 'center'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
          Lisää sessio
        </button>

        {sessionSaved && (
          <p style={{ fontSize: 13, color: 'var(--gold)', textAlign: 'center', marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
            Sessio lisätty.
          </p>
        )}

        {completedSessions.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
              Sessiot ({completedSessions.length} / 40)
            </p>
            {completedSessions.map((s, i) => (
              <div key={i} style={{
                ...glassBox, marginBottom: 6,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', opacity: s.skipped ? 0.5 : 1
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
                <span style={{ color: s.skipped ? 'var(--muted)' : 'var(--text)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: s.skipped ? 'italic' : 'normal' }}>
                  {s.day}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: 'var(--muted)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13 }}>{s.date}</span>
                  <button onClick={() => removeSession(i)} style={{
                    fontSize: 11, color: 'var(--text)', letterSpacing: '0.05em',
                    padding: '3px 8px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 2,
                    background: 'transparent', fontFamily: "'Cormorant Garamond', serif", cursor: 'pointer'
                  }}>
                    poista
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}