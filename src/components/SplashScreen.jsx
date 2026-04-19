import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 1500)
    const t3 = setTimeout(() => setPhase(3), 3800)
    const t4 = setTimeout(() => onComplete(), 4600)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 3 ? 0 : 1,
      transition: 'opacity 0.8s ease',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes glow {
          0% { filter: brightness(0.8) saturate(1); }
          40% { filter: brightness(2.5) saturate(1.8) drop-shadow(0 0 18px rgba(255,220,180,0.9)) drop-shadow(0 0 40px rgba(255,200,150,0.5)); }
          60% { filter: brightness(2.8) saturate(2) drop-shadow(0 0 24px rgba(255,240,200,1)) drop-shadow(0 0 60px rgba(255,180,100,0.6)); }
          80% { filter: brightness(2) saturate(1.5) drop-shadow(0 0 12px rgba(255,200,150,0.6)); }
          100% { filter: brightness(1) saturate(1); }
        }
      `}</style>
<div style={{
  position: 'relative',
  width: '100vw',
  maxWidth: 500,
  opacity: phase >= 1 ? 1 : 0,
  transition: 'opacity 1.6s ease',
  animation: phase >= 2 ? 'glow 2s ease forwards' : 'none',
  background: 'transparent',
  marginBottom: '20vh'
}}>
        <img
          src="/duvaan-ornament.png"
          style={{
            width: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}