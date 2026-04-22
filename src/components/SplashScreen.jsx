import { useEffect, useRef } from 'react'

export default function SplashScreen({ onComplete }) {
  const imgRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const DURATION = 900 // ms total
    const start = performance.now()

    function frame(now) {
      const t = Math.min((now - start) / DURATION, 1)

      // Ease: fast start, smooth end
      const ease = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2

      const scale = 0.1 + ease * 14  // 0.1 → 14
      const opacity = t < 0.35
        ? t / 0.35                    // fade in
        : 1 - ((t - 0.35) / 0.65)    // fade out

      img.style.transform = `scale(${scale})`
      img.style.opacity = opacity

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        onComplete()
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, overflow: 'hidden',
    }}>
      <img
        ref={imgRef}
        src="/duvaan-ornament.png"
        style={{
          width: 180, height: 180,
          objectFit: 'contain',
          willChange: 'transform, opacity',
          filter: 'invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)',
          transform: 'scale(0.1)',
          opacity: 0,
        }}
      />
    </div>
  )
}