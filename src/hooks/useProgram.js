import { useState, useEffect, useRef } from 'react'
import { defaultProgram } from '../data/program'

export function useProgram() {
  const [program, setProgram] = useState(() => {
    const saved = localStorage.getItem('duvaan_program')
    return saved ? JSON.parse(saved) : defaultProgram
  })

  const programRef = useRef(program)
  useEffect(() => { programRef.current = program }, [program])

  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem('duvaan_checked')
    const savedWeek = localStorage.getItem('duvaan_week')
    const currentWeek = getWeekNumber()
    if (savedWeek !== String(currentWeek)) {
      localStorage.removeItem('duvaan_checked')
      localStorage.setItem('duvaan_week', String(currentWeek))
      return {}
    }
    return saved ? JSON.parse(saved) : {}
  })

  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem('duvaan_log')
    return saved ? JSON.parse(saved) : []
  })

  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('duvaan_sessions')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('duvaan_program', JSON.stringify(program))
  }, [program])

  useEffect(() => {
    localStorage.setItem('duvaan_checked', JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem('duvaan_log', JSON.stringify(log))
  }, [log])

  useEffect(() => {
    localStorage.setItem('duvaan_sessions', JSON.stringify(completedSessions))
  }, [completedSessions])

  function toggleExercise(dayIndex, exerciseId) {
    const key = `${dayIndex}_${exerciseId}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function isChecked(dayIndex, exerciseId) {
    return !!checked[`${dayIndex}_${exerciseId}`]
  }

  function completeSession(dayName) {
    const today = new Date().toLocaleDateString('fi-FI')
    setCompletedSessions(prev => {
      const alreadyDone = prev.find(s => s.date === today)
      if (alreadyDone) return prev
      return [...prev, { date: today, day: dayName, skipped: false }]
    })
  }

  function skipSession(dayName) {
    const today = new Date().toLocaleDateString('fi-FI')
    setCompletedSessions(prev => {
      const alreadyDone = prev.find(s => s.date === today)
      if (alreadyDone) return prev
      return [...prev, { date: today, day: `I skipped, can you imagine? (${dayName})`, skipped: true }]
    })
  }

  function addPastSession({ date, day }) {
    const formatted = new Date(date).toLocaleDateString('fi-FI')
    setCompletedSessions(prev => {
      const alreadyDone = prev.find(s => s.date === formatted)
      if (alreadyDone) return prev
      return [...prev, { date: formatted, day, skipped: false }].sort((a, b) =>
        new Date(a.date.split('.').reverse().join('-')) -
        new Date(b.date.split('.').reverse().join('-'))
      )
    })
  }

  function removeSession(index) {
    setCompletedSessions(prev => prev.filter((_, i) => i !== index))
  }

  function updateWeight(exerciseId, newWeight) {
    setProgram(prev => prev.map(day => ({
      ...day,
      exercises: day.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, weight: newWeight } : ex
      )
    })))
  }

  function updateExercise(exerciseId, fields) {
    setProgram(prev => prev.map(day => ({
      ...day,
      exercises: day.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, ...fields } : ex
      )
    })))
  }

  function addLogEntry(text) {
    const entry = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleString('fi-FI')
    }
    setLog(prev => [entry, ...prev])
  }

  function getTodayIndex() {
    const day = new Date().getDay()
    return day === 0 ? 6 : day - 1
  }

  return {
    program, checked, log, completedSessions,
    toggleExercise, isChecked, updateWeight, updateExercise,
    addLogEntry, getTodayIndex, completeSession, skipSession,
    addPastSession, removeSession
  }
}

function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7)
}