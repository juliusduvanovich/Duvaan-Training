import { useState, useRef, useEffect } from 'react'

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
  overflow: 'hidden',
  boxShadow: isToday
    ? 'inset 0 1px 0 rgba(201,168,76,0.15), inset 1px 0 0 rgba(201,168,76,0.1)'
    : 'inset 0 1px 0 rgba(201,168,76,0.08), inset 1px 0 0 rgba(201,168,76,0.06)'
})

const inputStyle = {
  background: 'rgba(107,29,46,0.2)',
  border: '1px solid rgba(201,168,76,0.25)',
  borderRadius: 3,
  color: 'var(--text)',
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 13,
  padding: '4px 8px',
  outline: 'none',
  width: '100%'
}

function AnimatedContent({ isOpen, children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? ref.current.scrollHeight : 0)
    }
  }, [isOpen, children])

  return (
    <div style={{
      maxHeight: height,
      overflow: 'hidden',
      transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      borderTop: isOpen ? '1px solid rgba(201,168,76,0.1)' : 'none'
    }}>
      <div ref={ref}>
        {children}
      </div>
    </div>
  )
}

export default function ProgramView({ program, getTodayIndex, isChecked, updateExercise, addExercise }) {
  const [expanded, setExpanded] = useState(getTodayIndex())
  const [editing, setEditing] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [newExercise, setNewExercise] = useState({ name: '', sets: '3', reps: '10', weight: '' })
  const todayIndex = getTodayIndex()

  function formatSets(ex) {
    let str = `${ex.sets} × ${ex.reps}`
    if (ex.weight) str += ` × ${ex.weight}`
    return str
  }

  function handlePress(i) {
    if (editing !== null) return
    setExpanded(expanded === i ? null : i)
  }

  function startEdit(i, exercises) {
    const d = {}
    exercises.forEach(ex => {
      d[ex.id] = { name: ex.name, sets: ex.sets, reps: ex.reps, weight: ex.weight || '' }
    })
    setDrafts(d)
    setNewExercise({ name: '', sets: '3', reps: '10', weight: '' })
    setEditing(i)
  }

  function saveEdit(dayIndex, exercises) {
    exercises.forEach(ex => {
      const d = drafts[ex.id]
      if (d) updateExercise(ex.id, { name: d.name, sets: Number(d.sets), reps: d.reps, weight: d.weight || null })
    })
    if (newExercise.name.trim()) {
      addExercise(dayIndex, newExercise)
    }
    setEditing(null)
    setDrafts({})
    setNewExercise({ name: '', sets: '3', reps: '10', weight: '' })
  }

  function updateDraft(id, field, value) {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  return (
    <div className="view" style={{ position: 'relative' }}>
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
            const isEditing = editing === i
            const done = day.exercises.filter(ex => isChecked(i, ex.id)).length
            const total = day.exercises.length

            return (
              <div key={i} style={glassCard(isToday)}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)'
                }} />

                <div
                  onClick={() => !isEditing && handlePress(i)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}
                >
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
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>↓</span>
                  </div>
                </div>

                <AnimatedContent isOpen={isOpen}>
                  {!day.rest ? (
                    isEditing ? (
                      <>
                        {day.exercises.map((ex) => (
                          <div key={ex.id} style={{
                            padding: '10px 20px',
                            borderBottom: '1px solid rgba(107,29,46,0.2)',
                            display: 'flex', flexDirection: 'column', gap: 6
                          }}>
                            <input
                              value={drafts[ex.id]?.name || ''}
                              onChange={e => updateDraft(ex.id, 'name', e.target.value)}
                              style={{ ...inputStyle, fontSize: 14 }}
                              placeholder="Liikkeen nimi"
                            />
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                value={drafts[ex.id]?.sets || ''}
                                onChange={e => updateDraft(ex.id, 'sets', e.target.value)}
                                style={{ ...inputStyle, width: 60 }}
                                placeholder="Sarjat"
                              />
                              <input
                                value={drafts[ex.id]?.reps || ''}
                                onChange={e => updateDraft(ex.id, 'reps', e.target.value)}
                                style={{ ...inputStyle, width: 80 }}
                                placeholder="Toistot"
                              />
                              <input
                                value={drafts[ex.id]?.weight || ''}
                                onChange={e => updateDraft(ex.id, 'weight', e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                                placeholder="Paino"
                              />
                            </div>
                          </div>
                        ))}

                        <div style={{
                          padding: '12px 20px',
                          borderBottom: '1px solid rgba(107,29,46,0.2)',
                          display: 'flex', flexDirection: 'column', gap: 6,
                          background: 'rgba(201,168,76,0.04)'
                        }}>
                          <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif", marginBottom: 2 }}>
                            + Lisää liike
                          </p>
                          <input
                            value={newExercise.name}
                            onChange={e => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                            style={{ ...inputStyle, fontSize: 14 }}
                            placeholder="Liikkeen nimi"
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input
                              value={newExercise.sets}
                              onChange={e => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                              style={{ ...inputStyle, width: 60 }}
                              placeholder="Sarjat"
                            />
                            <input
                              value={newExercise.reps}
                              onChange={e => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                              style={{ ...inputStyle, width: 80 }}
                              placeholder="Toistot"
                            />
                            <input
                              value={newExercise.weight}
                              onChange={e => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                              style={{ ...inputStyle, flex: 1 }}
                              placeholder="Paino"
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, padding: '12px 20px' }}>
                          <button
                            onClick={() => saveEdit(i, day.exercises)}
                            style={{
                              flex: 1, padding: '10px',
                              background: 'rgba(201,168,76,0.15)',
                              border: '1px solid rgba(201,168,76,0.4)',
                              color: 'var(--gold)', borderRadius: 4,
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 12, letterSpacing: '0.1em',
                              textTransform: 'uppercase', cursor: 'pointer'
                            }}
                          >
                            Tallenna
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            style={{
                              padding: '10px 16px',
                              background: 'transparent',
                              border: '1px solid rgba(107,29,46,0.4)',
                              color: 'var(--muted)', borderRadius: 4,
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 12, cursor: 'pointer'
                            }}
                          >
                            Peruuta
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
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
                        <button
                          onClick={e => { e.stopPropagation(); startEdit(i, day.exercises) }}
                          style={{
                            width: '100%', padding: '10px',
                            background: 'transparent',
                            border: 'none',
                            borderTop: '1px solid rgba(107,29,46,0.2)',
                            color: 'rgba(201,168,76,0.5)',
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 11, letterSpacing: '0.12em',
                            textTransform: 'uppercase', cursor: 'pointer'
                          }}
                        >
                          Muokkaa
                        </button>
                      </>
                    )
                  ) : (
                    <div style={{ padding: '16px 20px' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--gold)', opacity: 0.6, letterSpacing: '0.05em' }}>
                        It's A Lifestyle
                      </p>
                    </div>
                  )}
                </AnimatedContent>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}