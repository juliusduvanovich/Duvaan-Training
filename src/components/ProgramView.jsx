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

const glassCard = (isToday = false) => ({
  background: isToday
    ? 'linear-gradient(135deg, rgba(160,50,80,0.65) 0%, rgba(90,15,30,0.3) 50%, rgba(130,35,60,0.55) 100%)'
    : 'linear-gradient(135deg, rgba(140,40,65,0.45) 0%, rgba(70,10,25,0.15) 50%, rgba(110,28,50,0.38) 100%)',
  border: isToday ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(201,168,76,0.2)',
  borderTop: isToday ? '1px solid rgba(201,168,76,0.7)' : '1px solid rgba(201,168,76,0.4)',
  borderLeft: isToday ? '3px solid rgba(201,168,76,0.8)' : '2px solid rgba(150,50,70,0.5)',
  borderRadius: 6,
  marginBottom: 8,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'visible',
  boxShadow: isToday
    ? 'inset 0 1px 0 rgba(201,168,76,0.15), inset 1px 0 0 rgba(201,168,76,0.1)'
    : 'inset 0 1px 0 rgba(201,168,76,0.08), inset 1px 0 0 rgba(201,168,76,0.06)'
})

function CardRipple({ active }) {
  if (!active) return null
  return (
    <>
      {[1, 2, 3, 4].map(n => (
        <div key={n} style={{
          position: 'absolute',
          inset: -n * 8,
          borderRadius: 6 + n * 4,
          border: `1px solid rgba(201,168,76,${0.35 - n * 0.07})`,
          animation: `wave-out 1.4s ease-out forwards`,
          animationDelay: `${(n - 1) * 0.18}s`,
          pointerEvents: 'none',
          zIndex: 10
        }} />
      ))}
    </>
  )
}

export default function ProgramView({ program, getTodayIndex, isChecked }) {
  const [expanded, setExpanded] = useState(getTodayIndex())
  const [rippling, setRippling] = useState(null)
  const todayIndex = getTodayIndex()

  function formatSets(ex) {
    let str = `${ex.sets} × ${ex.reps}`
    if (ex.weight) str += ` × ${ex.weight}`
    return str
  }

  function handlePress(i) {
    setRippling(i)
    setTimeout(() => setRippling(null), 1400)
    setExpanded(expanded === i ? null : i)
  }

  return (
    <div className="view" style={{ position: 'relative' }}>
      <style>{`
        @keyframes buoy {
          0%   { transform: translateY(0) rotate(0deg); }
          25%  { transform: translateY(4px) rotate(0.3deg); }
          55%  { transform: translateY(-3px) rotate(-0.2deg); }
          75%  { transform: translateY(1.5px) rotate(0.1deg); }
          90%  { transform: translateY(-0.5px); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes wave-out {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.15); }
        }
      `}</style>
      <BackgroundOrnament />
      <div style={{ position: 'relative', zIndex: 3 }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, fontWeight: 400,
          color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 24
        }}>
          Program
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {program.map((day, i) => {
            const isToday = i === todayIndex
            const isOpen = expanded === i
            const isRippling = rippling === i
            const done = day.exercises.filter(ex => isChecked(i, ex.id)).length
            const total = day.exercises.length

            return (
              <div
                key={i}
                onClick={() => handlePress(i)}
                style={{
                  ...glassCard(isToday),
                  animation: isRippling ? 'buoy 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none'
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)'
                }} />

                <CardRipple active={isRippling} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 15, marginBottom: 3,
                      color: isToday ? 'var(--gold)' : 'var(--text)'
                    }}>
                      {day.name}
                    </p>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic', fontSize: 13,
                      color: isToday ? 'rgba(201,168,76,0.7)' : 'rgba(245,240,232,0.4)',
                      letterSpacing: '0.03em'
                    }}>
                      {day.focus}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {total > 0 && (
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
                        color: isToday ? 'var(--gold)' : 'rgba(201,168,76,0.5)'
                      }}>
                        {done}/{total}
                      </span>
                    )}
                    <span style={{
                      color: 'rgba(201,168,76,0.4)', fontSize: 11,
                      display: 'inline-block',
                      transition: 'transform 0.4s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>↓</span>
                  </div>
                </div>

                {isOpen && !day.rest && (
                  <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                    {day.exercises.map((ex, j) => {
                      const checked = isChecked(i, ex.id)
                      return (
                        <div key={ex.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 20px',
                          borderBottom: j < day.exercises.length - 1 ? '1px solid rgba(107,29,46,0.2)' : 'none',
                          opacity: checked ? 0.35 : 1
                        }}>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, textDecoration: checked ? 'line-through' : 'none', color: 'var(--text)' }}>
                            {ex.name}
                          </p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: checked ? 'rgba(136,136,136,0.5)' : 'var(--gold)' }}>
                            {formatSets(ex)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {isOpen && day.rest && (
                  <div style={{ borderTop: '1px solid rgba(107,29,46,0.3)', padding: '16px 20px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--gold)', opacity: 0.6, letterSpacing: '0.05em' }}>
                      It's A Lifestyle
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}