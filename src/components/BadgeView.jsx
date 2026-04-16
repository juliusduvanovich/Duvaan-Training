const TOTAL_PIECES = 40
const COLS = 4
const ROWS = 10

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
  const gap = 3
  const cellW = imgW / COLS
  const cellH = imgH / ROWS

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h1 style={{
        fontFamily: "'Uncial Antiqua', serif",
        fontSize: 28, fontWeight: 400,
        color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 6
      }}>
        The Body
      </h1>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>
        {count} / {TOTAL_PIECES} sessions
      </p>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 8 }}>
        <div style={{ height: 2, background: 'var(--gold)', borderRadius: 1, width: `${pct}%`, transition: 'width 0.6s ease' }} />
      </div>
      <p style={{
        fontSize: 13, color: 'var(--gold)', marginBottom: 24,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic', opacity: 0.8, minHeight: 20
      }}>
        {messages[msgIndex]}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: imgW,
          height: imgH,
          overflow: 'hidden',
          borderRadius: 2
        }}>
          <img
            src="/mallikeho.png"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block'
            }}
          />
          <svg
            style={{ position: 'absolute', top: 0, left: 0 }}
            width={imgW}
            height={imgH}
            viewBox={`0 0 ${imgW} ${imgH}`}
          >
            {Array.from({ length: ROWS }, (_, row) =>
              Array.from({ length: COLS }, (_, col) => {
                const cellIndex = row * COLS + col
                const isUnlocked = cellIndex < unlockedCells
                if (isUnlocked) return null
                const x = col * cellW + gap / 2
                const y = row * cellH + gap / 2
                const w = cellW - gap
                const h = cellH - gap
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x} y={y} width={w} height={h}
                    rx="4"
                    fill="#0a0205"
                    stroke="rgba(107,29,46,0.4)"
                    strokeWidth="0.5"
                  />
                )
              })
            )}
            {count === TOTAL_PIECES && (
              <rect x="0" y="0" width={imgW} height={imgH} fill="rgba(201,168,76,0.1)" />
            )}
          </svg>
        </div>
      </div>

      {count === TOTAL_PIECES && (
        <p style={{
          textAlign: 'center', marginTop: 20,
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: 16, color: 'var(--gold)',
          letterSpacing: '0.08em'
        }}>
          Fight Club physique unlocked.
        </p>
      )}

      {completedSessions.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={{
            fontSize: 13, color: 'var(--muted)',
            letterSpacing: '0.08em', marginBottom: 12,
            fontFamily: "'Uncial Antiqua', serif"
          }}>
            History
          </p>
          {completedSessions.slice().reverse().slice(0, 8).map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid rgba(107,29,46,0.2)',
              fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
              opacity: s.skipped ? 0.5 : 1
            }}>
              <span style={{ color: s.skipped ? 'rgba(136,136,136,0.6)' : 'var(--text)', fontStyle: s.skipped ? 'italic' : 'normal' }}>
                {s.day}
              </span>
              <span style={{ color: 'var(--muted)' }}>{s.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}