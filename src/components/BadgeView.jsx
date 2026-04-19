const TOTAL_PIECES = 40
const COLS = 4
const ROWS = 10

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

export default function BadgeView({ completedSessions }) {
  const completed = completedSessions.filter(s => !s.skipped).length
  const skipped = completedSessions.filter(s => s.skipped).length
  const count = Math.min(Math.max(0, completed - skipped), TOTAL_PIECES)
  const pct = Math.round((count / TOTAL_PIECES) * 100)
  const unlockedCells = Math.round((count / TOTAL_PIECES) * (COLS * ROWS))

  const messages = [
    'Complete your first session to begin.',
    'The foundation is laid.',
    'Taking shape.',
    'Looking stronger.',
    'The form emerges.',
    'Discipline is showing.',
    'Hard work is visible.',
    'The body is responding.',
    'Almost there.',
    'One session away.',
    "Fight Club physique unlocked. It's A Lifestyle."
  ]
  const msgIndex = Math.floor((count / TOTAL_PIECES) * 10)

  const imgW = 320
  const imgH = 480
  const cellW = imgW / COLS
  const cellH = imgH / ROWS

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 6 }}>
        The Body
      </h1>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>
        {count} / {TOTAL_PIECES} sessions
      </p>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 8 }}>
        <div style={{ height: 2, background: 'var(--gold)', borderRadius: 1, width: `${pct}%`, transition: 'width 0.6s ease' }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', opacity: 0.8, minHeight: 20 }}>
        {messages[msgIndex]}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: imgW,
          height: imgH,
          background: '#0a0205',
          overflow: 'hidden'
        }}>
          <img
            src="/mallikeho.png"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              zIndex: 1
            }}
          />

          <svg
            style={{ position: 'absolute', top: -1, left: -1, zIndex: 2 }}
            width={imgW + 2}
            height={imgH + 2}
            viewBox={`-1 -1 ${imgW + 2} ${imgH + 2}`}
          >
            {Array.from({ length: ROWS }, (_, row) =>
              Array.from({ length: COLS }, (_, col) => {
                const cellIndex = row * COLS + col
                const isUnlocked = cellIndex < unlockedCells
                if (isUnlocked) return null
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * cellW}
                    y={row * cellH}
                    width={cellW}
                    height={cellH}
                    fill="#0a0205"
                    stroke="rgba(201,168,76,0.3)"
                    strokeWidth="1"
                  />
                )
              })
            )}
          </svg>

          <img
            src="/duvaan-ornament.png"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              mixBlendMode: 'screen',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 3
            }}
          />

          {count === TOTAL_PIECES && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, background: 'rgba(201,168,76,0.1)' }} />
          )}
        </div>
      </div>

      {count === TOTAL_PIECES && (
        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', letterSpacing: '0.08em' }}>
          Fight Club physique unlocked.
        </p>
      )}

      {completedSessions.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
            History
          </p>
          {completedSessions.slice().reverse().slice(0, 8).map((s, i) => (
            <div key={i} style={{ ...glassBox, marginBottom: 6, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', opacity: s.skipped ? 0.5 : 1 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
              <span style={{ color: s.skipped ? 'var(--muted)' : 'var(--text)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: s.skipped ? 'italic' : 'normal' }}>
                {s.day}
              </span>
              <span style={{ color: 'var(--muted)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13 }}>{s.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}