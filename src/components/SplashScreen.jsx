import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 4000)
    const t3 = setTimeout(() => onComplete(), 4800)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.8s ease',
      zIndex: 1000
    }}>
      <img
        src="/duvaan-logo.png"
        style={{
          width: '100vw',
          maxWidth: 600,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.8s ease',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}