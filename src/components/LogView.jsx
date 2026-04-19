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
        const words = searchName.split(' ').filter(w => w.length > 2)
        const exWords = exName.split(' ').filter(w => w.length > 2)
        const fuzzy = exName === searchName || exName.includes(searchName) || searchName.includes(exName) || words.some(w => exName.includes(w)) || exWords.some(w => searchName.includes(w))
        if (fuzzy) updates.push({ id: ex.id, name: ex.name, type, value: type === 'weight' ? newValue + ' kg' : newValue })
      })
    })
  })
  return updates
}

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
      setSaved('Ei tunnistettu. Kokeile: "Dips → 15" tai "Arnold Press → 11 kg"')
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
      <h1 style={{ fontFamily: "'Uncial Antiqua', serif", fontSize: 28, fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 20 }}>
        Log
      </h1>

      <div style={{ ...glassBox, marginBottom: 10 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
        <textarea
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={'More Weights?'}
          style={{ background: 'transparent', border: 'none', padding: '14px 16px', width: '100%', color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif", fontSize: 15, resize: 'none', outline: 'none' }}
        />
      </div>

      <button onClick={handleSubmit} style={{
        ...glassBox, width: '100%', padding: '14px',
        color: 'var(--gold)', fontSize: 12, letterSpacing: '0.15em',
        textTransform: 'uppercase', borderRadius: 6, marginBottom: 8,
        fontFamily: "'Uncial Antiqua', serif", cursor: 'pointer', display: 'block', textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
        Päivitä ohjelma
      </button>

      {saved && (
        <p style={{ fontSize: 13, color: 'var(--gold)', textAlign: 'center', marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          {saved}
        </p>
      )}

      <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', margin: '28px 0' }} />

      <p style={{ fontFamily: "'Uncial Antiqua', serif", fontSize: 15, color: 'var(--gold)', marginBottom: 16, letterSpacing: '0.05em' }}>
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
        fontFamily: "'Uncial Antiqua', serif", cursor: 'pointer', display: 'block', textAlign: 'center'
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
          <p style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 12, fontFamily: "'Uncial Antiqua', serif" }}>
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
                  background: 'transparent', fontFamily: "'Cormorant Garamond', serif",
                  cursor: 'pointer'
                }}>
                  poista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}