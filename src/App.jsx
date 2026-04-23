import { useState, useRef, useEffect, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import LobbyView from './components/LobbyView'
import PersonalView from './components/PersonalView'
import CommunityView from './components/CommunityView'

const GOLD = '#C9A84C'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');


  @keyframes gearColorShift {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    25%  { filter: hue-rotate(30deg) brightness(1.2); }
    50%  { filter: hue-rotate(0deg) brightness(0.9); }
    75%  { filter: hue-rotate(-20deg) brightness(1.1); }
    100% { filter: hue-rotate(0deg) brightness(1); }
  }

  @keyframes zoomIn {
    0%   { transform: scale(1);   opacity: 1;   filter: brightness(1); }
    70%  { transform: scale(4);   opacity: 0.5; filter: brightness(1.8); }
    100% { transform: scale(12);  opacity: 0;   filter: brightness(2.5); }
  }
  @keyframes zoomOut {
    0%   { transform: scale(0.08); opacity: 0;   filter: brightness(2.5); }
    30%  { transform: scale(0.3);  opacity: 0.5; filter: brightness(1.5); }
    100% { transform: scale(1);    opacity: 1;   filter: brightness(1); }
  }
  .zoom-exit {
    animation: zoomIn 0.5s ease-in forwards;
    transform-origin: 50% 42%;
    pointer-events: none;
  }
  .zoom-enter {
    animation: zoomOut 0.5s ease-out forwards;
    transform-origin: 50% 42%;
  }
`

function SkyBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const ctx = canvas.getContext('2d')
    let raf

    // Stars — only visible at night
    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random() * 0.85,
      r: 0.3 + Math.random() * 1.2,
      op: 0.2 + Math.random() * 0.6,
      tw: Math.random() * Math.PI * 2,
      ts: 0.004 + Math.random() * 0.01,
    }))

    let frame = 0

    // Get sky palette based on real clock hour (0-23)
    function getSkyPalette(hour) {
      // Smooth float hour e.g. 14.5
      const palettes = {
        // Deep night 0-4
        night:     { top: '#010108', mid: '#02020e', low: '#040210', hor: '#080408', stars: 1.0,  sunY: 1.0,  sunCol: null },
        // Pre-dawn 4-6
        predawn:   { top: '#03020e', mid: '#0a0520', low: '#1a0818', hor: '#2a0e08', stars: 0.6,  sunY: 0.92, sunCol: '#3a1005' },
        // Sunrise 6-7
        sunrise:   { top: '#06041a', mid: '#150830', low: '#2d1020', hor: '#c04010', stars: 0.1,  sunY: 0.82, sunCol: '#ff6020' },
        // Morning 7-9
        morning:   { top: '#080828', mid: '#101840', low: '#2a1a30', hor: '#e05818', stars: 0.0,  sunY: 0.65, sunCol: '#ffaa40' },
        // Day 9-16
        day:       { top: '#060420', mid: '#0c0c38', low: '#180e28', hor: '#8a3010', stars: 0.0,  sunY: 0.3,  sunCol: '#ffcc60' },
        // Afternoon 16-18
        afternoon: { top: '#080525', mid: '#100a30', low: '#200c20', hor: '#aa4010', stars: 0.0,  sunY: 0.55, sunCol: '#ff8830' },
        // Sunset 18-20
        sunset:    { top: '#04020e', mid: '#120830', low: '#2a0e18', hor: '#cc4808', stars: 0.08, sunY: 0.78, sunCol: '#ff5010' },
        // Dusk 20-22
        dusk:      { top: '#02020a', mid: '#080418', low: '#120810', hor: '#1e0808', stars: 0.5,  sunY: 0.95, sunCol: '#2a0808' },
        // Night 22-24
        latenight: { top: '#010108', mid: '#02020e', low: '#040210', hor: '#060306', stars: 0.9,  sunY: 1.0,  sunCol: null },
      }
      if (hour < 4)  return palettes.night
      if (hour < 6)  return { ...palettes.predawn,   t: (hour-4)/2 }
      if (hour < 7)  return palettes.sunrise
      if (hour < 9)  return palettes.morning
      if (hour < 16) return palettes.day
      if (hour < 18) return palettes.afternoon
      if (hour < 20) return palettes.sunset
      if (hour < 22) return palettes.dusk
      return palettes.latenight
    }

    function render() {
      const CW = canvas.width, CH = canvas.height
      const W = Math.min(CW, 480)
      const ox = (CW - W) / 2
      frame++

      ctx.clearRect(0, 0, CW, CH)

      // Real clock time
      const now = new Date()
      const hour = now.getHours() + now.getMinutes() / 60
      const pal = getSkyPalette(hour)

      // ── SKY GRADIENT ──
      const sky = ctx.createLinearGradient(ox, 0, ox, CH)
      sky.addColorStop(0,    pal.top)
      sky.addColorStop(0.35, pal.mid)
      sky.addColorStop(0.65, pal.low)
      sky.addColorStop(0.88, pal.hor)
      sky.addColorStop(1,    '#080808')
      ctx.fillStyle = sky
      ctx.fillRect(ox, 0, W, CH)

      // ── SUN / MOON GLOW ──
      if (pal.sunCol && pal.sunY < 1.0) {
        const sy = CH * pal.sunY
        const sg = ctx.createRadialGradient(ox+W*0.5, sy, 0, ox+W*0.5, sy, W*0.7)
        sg.addColorStop(0,   pal.sunCol + '55')
        sg.addColorStop(0.3, pal.sunCol + '22')
        sg.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = sg
        ctx.fillRect(ox, 0, W, CH)
      }

      // ── MOON — accurate lunar phase ──
      const isNight = hour < 6.5 || hour >= 19.5
      if (isNight) {
        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
        const lunarCycle = 29.530588853 * 24 * 60 * 60 * 1000
        const nowMs = now.getTime()
        const phase = ((nowMs - knownNewMoon) % lunarCycle + lunarCycle) % lunarCycle / lunarCycle
        // phase: 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter

        // Visibility: fade in/out near new moon
        const moonVis = phase < 0.04 || phase > 0.96 ? 0
          : phase < 0.09 ? (phase - 0.04) / 0.05
          : phase > 0.91 ? (0.96 - phase) / 0.05
          : 1.0

        if (moonVis > 0.01) {
          // Position based on hour — rises east, sets west
          const moonX = hour >= 20 ? 0.75 - (hour - 20) / 8 * 0.3 : 0.45 - hour / 6 * 0.25
          const moonY = hour >= 22 ? 0.10 + (hour - 22) / 2 * 0.06 : hour < 3 ? 0.08 : 0.10 + hour / 6 * 0.12
          const mx = ox + W * Math.min(0.88, Math.max(0.12, moonX))
          const my = CH * Math.min(0.50, Math.max(0.06, moonY))
          const mr = 14

          ctx.save()
          ctx.globalAlpha = moonVis

          // Outer glow
          const mg = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 5)
          mg.addColorStop(0,   'rgba(220,215,185,0.22)')
          mg.addColorStop(0.5, 'rgba(180,170,140,0.06)')
          mg.addColorStop(1,   'rgba(0,0,0,0)')
          ctx.fillStyle = mg
          ctx.beginPath()
          ctx.arc(mx, my, mr * 5, 0, Math.PI * 2)
          ctx.fill()

          // Clip to disc
          ctx.save()
          ctx.beginPath()
          ctx.arc(mx, my, mr, 0, Math.PI * 2)
          ctx.clip()

          // Base disc — warm white
          ctx.fillStyle = '#e8e0c8'
          ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2)

          // Realistic surface shading — limb darkening
          const limb = ctx.createRadialGradient(mx, my, 0, mx, my, mr)
          limb.addColorStop(0,   'rgba(255,255,240,0)')
          limb.addColorStop(0.7, 'rgba(200,185,155,0.1)')
          limb.addColorStop(1,   'rgba(80,70,50,0.55)')
          ctx.fillStyle = limb
          ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2)

          // Mare (dark patches) — realistic moon feature positions
          const mares = [
            { dx: 0.15, dy: -0.2, rx: 0.32, ry: 0.28, op: 0.22 },  // Mare Imbrium
            { dx: 0.35, dy: 0.1,  rx: 0.22, ry: 0.18, op: 0.18 },  // Mare Serenitatis
            { dx: 0.1,  dy: 0.35, rx: 0.28, ry: 0.2,  op: 0.20 },  // Mare Tranquillitatis
            { dx: -0.2, dy: 0.25, rx: 0.20, ry: 0.15, op: 0.15 },  // Mare Nubium
            { dx: 0.3,  dy: -0.4, rx: 0.16, ry: 0.12, op: 0.14 },  // Mare Vaporum
          ]
          mares.forEach(m => {
            ctx.beginPath()
            ctx.ellipse(mx + m.dx * mr, my + m.dy * mr, m.rx * mr, m.ry * mr, 0, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(130,120,95,${m.op})`
            ctx.fill()
          })

          // Phase shadow — terminator line
          // phase 0→0.5: waxing (shadow on left, shrinking)
          // phase 0.5→1: waning (shadow on right, growing)
          const termX = phase < 0.5
            ? mx - mr + phase * 4 * mr   // left shadow shrinking right
            : mx + mr - (phase - 0.5) * 4 * mr  // right shadow growing left
          const shadowRx = Math.abs(Math.cos(phase * Math.PI * 2)) * mr

          // Shadow fill
          ctx.fillStyle = 'rgba(4,3,12,0.97)'
          if (phase < 0.5) {
            // Left side shadow
            ctx.beginPath()
            ctx.moveTo(mx, my - mr)
            ctx.arc(mx, my, mr, -Math.PI / 2, Math.PI / 2, true)  // left semicircle
            if (shadowRx > 0.5) {
              ctx.ellipse(mx, my, shadowRx, mr, 0, Math.PI / 2, -Math.PI / 2, true)
            }
            ctx.closePath()
            ctx.fill()
          } else {
            // Right side shadow
            ctx.beginPath()
            ctx.moveTo(mx, my - mr)
            ctx.arc(mx, my, mr, -Math.PI / 2, Math.PI / 2)  // right semicircle
            if (shadowRx > 0.5) {
              ctx.ellipse(mx, my, shadowRx, mr, 0, Math.PI / 2, -Math.PI / 2)
            }
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore() // unclip

          // Subtle rim highlight
          ctx.beginPath()
          ctx.arc(mx, my, mr, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(255,250,230,0.15)'
          ctx.lineWidth = 0.8
          ctx.stroke()

          ctx.restore()
        }
      }

      // ── STARS ──
      const starAlpha = pal.stars || 0
      if (starAlpha > 0.01) {
        stars.forEach(s => {
          const op = s.op * starAlpha * (0.6 + 0.4 * Math.sin(frame * s.ts + s.tw))
          ctx.beginPath()
          ctx.arc(ox + s.x * W, s.y * CH, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(210,200,175,${op})`
          ctx.fill()
        })
      }

      // ── VIGNETTE ──
      const vig = ctx.createRadialGradient(ox+W/2, CH*0.4, W*0.05, ox+W/2, CH*0.4, W*0.9)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.48)')
      ctx.fillStyle = vig
      ctx.fillRect(ox, 0, W, CH)

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }} />
  )
}


export default function App() {
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('eliel')
  const [transitioning, setTransitioning] = useState(false)
  const [exitClass, setExitClass] = useState('')
  const [enterClass, setEnterClass] = useState('')

  const switchTab = (id) => {
    if (id === tab || transitioning) return
    setTransitioning(true)
    setExitClass('zoom-exit')
    setTimeout(() => {
      setTab(id)
      setExitClass('')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterClass('zoom-enter')
          setTimeout(() => {
            setEnterClass('')
            setTransitioning(false)
          }, 520)
        })
      })
    }, 420)
  }

  if (splash) return <SplashScreen onComplete={() => setSplash(false)} />

  const tabs = [
    { id: 'personal',  label: 'Personal' },
    { id: 'eliel',     label: 'Eliel' },
    { id: 'community', label: 'Community' },
  ]

  return (
    <>
    <SkyBg />
    <div style={{ background: 'transparent', minHeight: '100vh', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
      <style>{css}</style>

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 80 }} className={exitClass || enterClass}>
        {tab === 'eliel'     && <LobbyView onNavigate={switchTab} />}
        {tab === 'personal'  && <PersonalView onNavigate={switchTab} />}
        {tab === 'community' && <CommunityView onNavigate={switchTab} />}
      </div>

      <nav style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(10px)',
        borderTop: 'none',
        display: 'flex', flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes navLine {
            0%,100% { background: linear-gradient(90deg, transparent, #C9A84C 35%, #C9A84C 65%, transparent); opacity: 0.55; }
            16%     { background: linear-gradient(90deg, transparent, #e8d5a3 35%, #e8d5a3 65%, transparent); opacity: 0.75; }
            33%     { background: linear-gradient(90deg, transparent, #ff6eb4 35%, #ff6eb4 65%, transparent); opacity: 0.65; }
            50%     { background: linear-gradient(90deg, transparent, #6eb4ff 35%, #6eb4ff 65%, transparent); opacity: 0.75; }
            66%     { background: linear-gradient(90deg, transparent, #6effa0 35%, #6effa0 65%, transparent); opacity: 0.55; }
            83%     { background: linear-gradient(90deg, transparent, #ff9a6e 35%, #ff9a6e 65%, transparent); opacity: 0.65; }
          }
          @keyframes navLiquid {
            0%   { color: #C9A84C; } 16% { color: #e8d5a3; }
            33%  { color: #ff6eb4; } 50% { color: #6eb4ff; }
            66%  { color: #6effa0; } 83% { color: #ff9a6e; }
            100% { color: #C9A84C; }
          }
          @keyframes dotLiquid {
            0%   { background: #C9A84C; } 16% { background: #e8d5a3; }
            33%  { background: #ff6eb4; } 50% { background: #6eb4ff; }
            66%  { background: #6effa0; } 83% { background: #ff9a6e; }
            100% { background: #C9A84C; }
          }
          .nav-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0 4px; flex: 1; }
          .nav-btn.active { transform: scale(1.15); }
          .nav-dot { width: 4px; height: 4px; border-radius: 50%; }
          .nav-dot.inactive { background: #C9A84C; }
          .nav-dot.active { animation: dotLiquid 6s ease-in-out infinite; }
          .nav-label { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
          .nav-label.inactive { color: #C9A84C; font-weight: 400; }
          .nav-label.active { font-weight: 700; animation: navLiquid 6s ease-in-out infinite; }
        `}</style>
        <div style={{ width: '100%', height: '1px', animation: 'navLine 6s ease-in-out infinite' }} />
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 16px 28px' }}>
          {tabs.map(({ id, label }) => {
            const active = tab === id
            return (
              <button key={id} className={`nav-btn ${active ? 'active' : ''}`} onClick={() => switchTab(id)}>
                <div className={`nav-dot ${active ? 'active' : 'inactive'}`} />
                <span className={`nav-label ${active ? 'active' : 'inactive'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
    </>
  )
}