import { useState } from 'react'

const TOASTS = [
  "Well fucking done.",
  "Noted.",
  "One step closer.",
  "That's how it's done.",
  "No days off."
]

const BackgroundOrnament = () => (
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', zIndex: 0
  }}>
    <img src="/duvaan-ornament.png" style={{
      width: '100vw',
      maxWidth: 500,
      opacity: 0.22,
      filter: 'invert(1) sepia(1) saturate(2) hue-rotate(290deg) brightness(0.4)'
    }} />
  </div>
)

export default function TodayView({ program, getTodayIndex, toggleExercise, isChecked, completeSession, skipSession }) {
  const [toast, setToast] = useState(null)
  const [showComplete, setShowComplete] = useState(false)
  const [tapping, setTapping] = useState(null)

  const todayIndex = getTodayIndex()
  const today = program[todayIndex]
  const date = new Date().toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' })

  const total = today.exercises.length
  const done = today.exercises.filter(ex => isChecked(todayIndex, ex.id)).length

  function handleCheck(ex) {
    setTapping(ex.id)
    setTimeout(() => setTapping(null), 300)
    const wasChecked = isChecked(todayIndex, ex.id)
    toggleExercise(todayIndex, ex.id)
    if (!wasChecked) {
      const msg = TOASTS[Math.floor(Math.random() * TOASTS.length)]
      setToast(msg)
      setTimeout(() => setToast(null), 2000)
      if (done + 1 === total && total > 0) {
        setTimeout(() => {
          setShowComplete(true)
          completeSession(today.name)
        }, 400)
      }
    }
  }

  function handleSkip() {
    skipSession(today.name)
    setToast('I skipped, can you imagine?')
    setTimeout(() => setToast(null), 3000)
  }

  function formatSets(ex) {
    let str = `${ex.sets} × ${ex.reps}`
    if (ex.weight) str += ` × ${ex.weight}`
    return str
  }

  if (today.rest) {
    return (
      <div className="view" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '80vh', position: 'relative', overflow: 'hidden'
      }}>
        <BackgroundOrnament />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 3 }}>
          <p style={{
            fontFamily: "'Uncial Antiqua', serif",
            fontSize: 22, color: 'var(--gold)',
            letterSpacing: '0.08em', textAlign: 'center',
            lineHeight: 1.5
          }}>
            Rest Champion,<br />get ready.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="view" style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundOrnament />

      <div style={{ position: 'relative', zIndex: 3 }}>
        <p style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          {date}
        </p>
        <h1 style={{ fontFamily: "'Uncial Antiqua', serif", fontSize: 30, fontWeight: 400, marginBottom: 8, color: 'var(--gold)' }}>
          {today.name}
        </h1>
        <div style={{ display: 'inline-block', background: 'var(--burgundy)', color: 'var(--text)', fontSize: 11, padding: '4px 12px', borderRadius: 2, letterSpacing: '0.08em', marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          {today.focus}
        </div>

        {total > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', letterSpacing: '0.08em' }}>Edistyminen</span>
              <span style={{ fontSize: 13, color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif" }}>{done} / {total}</span>
            </div>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }}>
              <div style={{ height: 2, background: 'var(--gold)', borderRadius: 1, width: `${total > 0 ? (done / total) * 100 : 0}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {today.exercises.map((ex, i) => {
            const checked = isChecked(todayIndex, ex.id)
            const isTapping = tapping === ex.id
            return (
              <div
                key={ex.id}
                onClick={() => handleCheck(ex)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px',
                  background: isTapping
                    ? 'rgba(201, 168, 76, 0.15)'
                    : checked
                    ? 'rgba(107, 29, 46, 0.15)'
                    : 'linear-gradient(135deg, rgba(107,29,46,0.35) 0%, rgba(107,29,46,0.15) 50%, rgba(107,29,46,0.28) 100%)',
                  border: checked
                    ? '1px solid rgba(201, 168, 76, 0.12)'
                    : isTapping
                    ? '1px solid rgba(201, 168, 76, 0.5)'
                    : '1px solid rgba(201, 168, 76, 0.18)',
                  borderLeft: checked
                    ? '3px solid rgba(201, 168, 76, 0.3)'
                    : isTapping
                    ? '3px solid var(--gold)'
                    : '3px solid var(--burgundy)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: checked ? 0.5 : 1,
                  transition: 'all 0.25s ease',
                  transform: isTapping ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: checked ? 'none' : `1.5px solid ${isTapping ? 'var(--gold)' : 'var(--burgundy)'}`,
                  background: checked ? 'var(--gold)' : isTapping ? 'rgba(201,168,76,0.2)' : 'transparent',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {checked && <span style={{ fontSize: 10, color: '#080808', fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 15, marginBottom: 3,
                    textDecoration: checked ? 'line-through' : 'none',
                    color: checked ? 'var(--muted)' : 'var(--text)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500, letterSpacing: '0.02em'
                  }}>
                    {ex.name}
                  </p>
                  <p style={{
                    fontSize: 13,
                    color: checked ? 'rgba(136,136,136,0.5)' : 'var(--gold)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic', letterSpacing: '0.06em'
                  }}>
                    {formatSets(ex)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={handleSkip} style={{
          width: '100%', marginTop: 20, padding: '14px',
          background: 'transparent',
          border: '1px solid rgba(107,29,46,0.6)',
          color: 'var(--gold)',
          fontSize: 12, letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderRadius: 2,
          fontFamily: "'Uncial Antiqua', serif",
          cursor: 'pointer'
        }}>
          I skipped
        </button>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,8,8,0.95)', border: '1px solid var(--gold)',
          color: 'var(--gold)', padding: '10px 24px', borderRadius: 2,
          fontSize: 13, letterSpacing: '0.08em', zIndex: 200, whiteSpace: 'nowrap',
          fontFamily: "'Uncial Antiqua', serif"
        }}>
          {toast}
        </div>
      )}

      {showComplete && (
        <div onClick={() => setShowComplete(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(8,8,8,0.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, cursor: 'pointer', overflow: 'hidden'
        }}>
          <BackgroundOrnament />
          <img src="/duvaan-logo.png" style={{ width: '60vw', maxWidth: 260, mixBlendMode: 'screen', position: 'relative', zIndex: 3 }} />
          <p style={{ fontFamily: "'Uncial Antiqua', serif", fontSize: 28, color: 'var(--gold)', marginTop: 28, letterSpacing: '0.05em', position: 'relative', zIndex: 3 }}>
            Session complete.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10, letterSpacing: '0.05em', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', position: 'relative', zIndex: 3 }}>
            {date} · {today.focus}
          </p>
          <p style={{ color: 'var(--gold)', fontSize: 12, marginTop: 8, opacity: 0.7, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', position: 'relative', zIndex: 3 }}>
            Body unlocked +1
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 24, letterSpacing: '0.08em', position: 'relative', zIndex: 3 }}>tap to continue</p>
        </div>
      )}
    </div>
  )
}