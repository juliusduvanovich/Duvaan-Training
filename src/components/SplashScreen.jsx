import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 1000)
    const t3 = setTimeout(() => setPhase(3), 2800)
    const t4 = setTimeout(() => setPhase(4), 4000)
    const t5 = setTimeout(() => onComplete(), 4800)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 4 ? 0 : 1,
      transition: 'opacity 0.8s ease',
      zIndex: 1000
    }}>
      <img
        src="/duvaan-logo.png"
        style={{
          width: '85vw',
          maxWidth: 420,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.8s ease',
          mixBlendMode: 'screen'
        }}
      />
      <div style={{
        marginTop: 28,
        fontFamily: "'Uncial Antiqua', serif",
        fontSize: 32,
        letterSpacing: '0.2em',
        color: '#C9A84C',
        opacity: phase >= 3 ? 1 : 0,
        transition: 'opacity 0.8s ease',
        background: 'transparent'
      }}>
        Duvaan
      </div>
    </div>
  )
}