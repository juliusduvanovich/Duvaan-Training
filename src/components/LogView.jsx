import { useState } from 'react'

function parseUpdates(text, program) {
  const updates = []
  const lines = text.split('\n').filter(l => l.trim())

  lines.forEach(line => {
    const weightMatch = line.match(/(.+?)\s*[→\->]+\s*(\d+\.?\d*)\s*kg/i)
    const setsMatch = line.match(/(.+?)\s*[→\->]+\s*(\d+)\s*sarjaa?/i)
    const repsMatch = line.match(/(.+?)\s*[→\->]+\s*(\d+)\s*(toistoa?|reps?)?$/i)

    const match = weightMatch || setsMatch || repsMatch
    if (!match) return

    const searchName = match[1].trim().toLowerCase()
    const newValue = match[2]
    const type = weightMatch ? 'weight' : setsMatch ? 'sets' : 'reps'

    program.forEach(day => {
      day.exercises.forEach(ex => {
        const exName = ex.name.toLowerCase()
        const searchWords = searchName.split(' ').filter(w => w.length > 2)
        const exWords = exName.split(' ').filter(w => w.length > 2)

        const fuzzy =
          exName === searchName ||
          exName.includes(searchName) ||
          searchName.includes(exName) ||
          searchWords.some(w => exName.includes(w)) ||
          exWords.some(w => searchName.includes(w))

        if (fuzzy) {
          updates.push({
            id: ex.id,
            name: ex.name,
            type,
            value: type === 'weight' ? newValue + ' kg' : newValue
          })
        }
      })
    })
  })

  return updates
}

export default function LogView({ addLogEntry, completedSessions, addPastSession, removeSession, program, updateExercise }) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [pastDate, setPastDate] = useState('')
  const [sessionSaved, setSessionSaved] = useState(false)

  function handleSubmit() {
    if (!text.trim()) return
    const updates = parseUpdates(text, program)

    if (updates.length > 0) {
      updates.forEach(u => updateExercise(u.id, { [u.type]: u.value }))
      setSaved(`Päivitetty: ${[...new Set(updates.map(u => u.name))].join(', ')}`)
    } else {
      setSaved('Ei tunnistettu. Kokeile: "dipit → 15" tai "Arnold → 11 kg"')
    }

    addLogEntry(text.trim())
    setText('')
    setTimeout(() => setSaved(false), 3000)
  }

  function handlePastSession() {
    if (!pastDate) return
    const dateObj = new Date(pastDate)
    const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai']
    addPastSession({ date: pastDate, day: dayNames[dateObj.getDay()] })
    setSessionSaved(true)
    setTimeout(() => setSessionSaved(false), 2000)
  }

  return (
    <div className="view">
      <h1 style={{
        fontFamily: "'Uncial Antiqua', serif",
        fontSize: 28, fontWeight: 400,
        color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 20
      }}>
        Log
      </h1>

      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'dipit → 15\nArnold press → 11 kg'}
        style={{ marginBottom: 10 }}
      />

      <button onClick={handleSubmit} style={{
        width: '100%', padding: '14px',
        background: 'transparent',
        border: '1px solid var(--gold)',
        color: 'var(--gold)',
        fontSize: 12, letterSpacing: '0.15em',
        textTransform: 'uppercase',
        borderRadius: 2, marginBottom: 8,
        fontFamily: "'Uncial Antiqua', serif"
      }}>
        Päivitä ohjelma
      </button>

      {saved && (
        <p style={{ fontSize: 13, color: 'var(--gold)', textAlign: 'center', marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          {saved}
        </p>
      )}

      <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', margin: '28px 0' }} />

      <p style={{
        fontFamily: "'Uncial Antiqua', serif",
        fontSize: 15, color: 'var(--gold)',
        marginBottom: 16, letterSpacing: '0.05em'
      }}>
        Lisää sessio
      </p>

      <div style={{ marginBottom: 10 }}>
        <input
          type="date"
          value={pastDate}
          onChange={e => setPastDate(e.target.value)}
          style={{
            width: '100%', padding: '12px',
            background: 'rgba(107, 29, 46, 0.2)', color: 'var(--gold)',
            border: '1px solid rgba(107, 29, 46, 0.4)', borderRadius: 4,
            fontSize: 14, outline: 'none',
            fontFamily: "'Cormorant Garamond', serif"
          }}
        />
      </div>

      <button onClick={handlePastSession} style={{
        width: '100%', padding: '14px',
        background: 'transparent',
        border: '1px solid rgba(107, 29, 46, 0.6)',
        color: 'var(--gold)',
        fontSize: 12, letterSpacing: '0.15em',
        textTransform: 'uppercase',
        borderRadius: 2, marginBottom: 8,
        fontFamily: "'Uncial Antiqua', serif"
      }}>
        Lisää sessio
      </button>

      {sessionSaved && (
        <p style={{ fontSize: 13, color: 'var(--gold)', textAlign: 'center', marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          Sessio lisätty.
        </p>
      )}

      {completedSessions.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={{
            fontSize: 13, color: 'var(--muted)',
            letterSpacing: '0.08em', marginBottom: 12,
            fontFamily: "'Uncial Antiqua', serif"
          }}>
            Sessiot ({completedSessions.length} / 40)
          </p>
          {completedSessions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid rgba(107,29,46,0.2)',
              fontSize: 13, fontFamily: "'Cormorant Garamond', serif"
            }}>
              <span style={{ color: 'var(--text)' }}>{s.day}</span>
              <span style={{ color: 'var(--muted)', flex: 1, textAlign: 'center' }}>{s.date}</span>
              <button onClick={() => removeSession(i)} style={{
                fontSize: 11, color: 'rgba(107,29,46,0.8)',
                letterSpacing: '0.05em', padding: '4px 8px',
                border: '1px solid rgba(107,29,46,0.4)', borderRadius: 2,
                background: 'transparent', fontFamily: "'Cormorant Garamond', serif"
              }}>
                poista
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}