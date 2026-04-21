import { useState, useRef, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import LobbyView from './components/LobbyView'
import TrainView from './components/TrainView'
import CommunityView from './components/CommunityView'

const GOLD = '#C9A84C'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

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

  .nav-btn {
    background: none; border: none; cursor: pointer;
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; padding: 0 4px; transition: transform 0.3s ease; flex: 1;
  }
  .nav-btn.active { transform: scale(1.15); }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; }
  .nav-dot.inactive { background: #C9A84C; }
  .nav-dot.active   { animation: dotLiquid 6s ease-in-out infinite; }
  .nav-label {
    font-family: 'Cinzel', serif; font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .nav-label.inactive { color: #C9A84C; font-weight: 400; }
  .nav-label.active   { font-weight: 700; animation: navLiquid 6s ease-in-out infinite; }

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

function FireflyBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['#C9A84C','#e8d5a3','#ff6eb4','#6eb4ff','#6effa0','#ff9a6e','#C9A84C']

    function lerpColor(c1, c2, t) {
      const r1=parseInt(c1.slice(1,3),16),g1=parseInt(c1.slice(3,5),16),b1=parseInt(c1.slice(5,7),16)
      const r2=parseInt(c2.slice(1,3),16),g2=parseInt(c2.slice(3,5),16),b2=parseInt(c2.slice(5,7),16)
      return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`
    }

    // DNA pair — two flies orbiting a moving center
    class DNAPair {
      constructor(w, h) { this.w=w; this.h=h; this.reset() }
      reset() {
        // moving center path
        this.cx = this.w * (0.2 + Math.random() * 0.6)
        this.cy = this.h * (0.2 + Math.random() * 0.6)
        this.cvx = (Math.random()-0.5) * 1.8
        this.cvy = (Math.random()-0.5) * 1.8
        this.angle = Math.random() * Math.PI * 2
        this.speed = 0.022 + Math.random() * 0.018
        this.radius = 60 + Math.random() * 80
        this.colorIdx = Math.floor(Math.random() * (COLORS.length-1))
        this.colorT = 0
        this.trail1 = []
        this.trail2 = []
        this.trailMax = 120
        this.age = 0
        this.maxAge = 500 + Math.random() * 300
        // axis tilt for 3d feel
        this.tiltX = Math.random() * 0.6
        this.tiltY = Math.random() * 0.6
      }
      update() {
        this.age++
        this.colorT += 0.004
        if (this.colorT >= 1) { this.colorT = 0; this.colorIdx = (this.colorIdx+1) % (COLORS.length-1) }

        this.angle += this.speed
        // drift center
        this.cx += this.cvx
        this.cy += this.cvy
        this.cvx += (Math.random()-0.5)*0.06
        this.cvy += (Math.random()-0.5)*0.06
        this.cvx *= 0.98; this.cvy *= 0.98

        const rx = Math.cos(this.angle) * this.radius
        const ry = Math.sin(this.angle) * this.radius * 0.35 // flatten for helix look

        const x1 = this.cx + rx
        const y1 = this.cy + ry
        const x2 = this.cx - rx
        const y2 = this.cy - ry

        this.trail1.push({ x: x1, y: y1 })
        this.trail2.push({ x: x2, y: y2 })
        if (this.trail1.length > this.trailMax) { this.trail1.shift(); this.trail2.shift() }

        if (this.age > this.maxAge ||
            this.cx < -150 || this.cx > this.w+150 ||
            this.cy < -150 || this.cy > this.h+150) {
          this.reset()
        }
      }
      draw(ctx) {
        const life = this.age / this.maxAge
        const fadeIn  = Math.min(1, this.age / 60)
        const fadeOut = life > 0.75 ? 1-(life-0.75)/0.25 : 1
        const alpha = fadeIn * fadeOut
        const color = lerpColor(COLORS[this.colorIdx], COLORS[this.colorIdx+1], this.colorT)

        // Draw strand 1
        for (let i = 1; i < this.trail1.length; i++) {
          const p0 = this.trail1[i-1], p1 = this.trail1[i]
          const tr = i / this.trail1.length
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = color
          ctx.globalAlpha = alpha * tr * 0.45
          ctx.lineWidth = tr * 1.8
          ctx.stroke()
        }
        // Draw strand 2
        for (let i = 1; i < this.trail2.length; i++) {
          const p0 = this.trail2[i-1], p1 = this.trail2[i]
          const tr = i / this.trail2.length
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = color
          ctx.globalAlpha = alpha * tr * 0.45
          ctx.lineWidth = tr * 1.8
          ctx.stroke()
        }
        // Draw rungs (DNA cross bars) every few steps
        const step = 8
        for (let i = step; i < this.trail1.length; i += step) {
          const p1 = this.trail1[i], p2 = this.trail2[i]
          if (!p1 || !p2) continue
          const tr = i / this.trail1.length
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = color
          ctx.globalAlpha = alpha * tr * 0.18
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
        // Glow dots at tips
        const last1 = this.trail1[this.trail1.length-1]
        const last2 = this.trail2[this.trail2.length-1]
        if (last1 && last2) {
          [last1, last2].forEach(p => {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
            g.addColorStop(0, color)
            g.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(p.x, p.y, 10, 0, Math.PI*2)
            ctx.fillStyle = g
            ctx.globalAlpha = alpha * 0.7
            ctx.fill()
          })
        }
        ctx.globalAlpha = 1
      }
    }

    // Single solo firefly for extra life
    class Firefly {
      constructor(w, h) { this.w=w; this.h=h; this.reset() }
      reset() {
        this.x = Math.random()*this.w; this.y = Math.random()*this.h
        this.vx=(Math.random()-0.5)*1.4; this.vy=(Math.random()-0.5)*1.4
        this.spiralAngle=Math.random()*Math.PI*2
        this.spiralR=0.8+Math.random()*1.2
        this.spiralSpd=0.03+Math.random()*0.03
        this.trail=[]; this.trailMax=80
        this.colorIdx=Math.floor(Math.random()*(COLORS.length-1))
        this.colorT=0; this.age=0
        this.maxAge=350+Math.random()*200
      }
      update() {
        this.age++
        this.colorT+=0.005
        if(this.colorT>=1){this.colorT=0;this.colorIdx=(this.colorIdx+1)%(COLORS.length-1)}
        this.spiralAngle+=this.spiralSpd
        this.x+=this.vx+Math.cos(this.spiralAngle)*this.spiralR
        this.y+=this.vy+Math.sin(this.spiralAngle*1.4)*this.spiralR
        this.vx+=(Math.random()-0.5)*0.05; this.vy+=(Math.random()-0.5)*0.05
        this.vx*=0.98; this.vy*=0.98
        this.trail.push({x:this.x,y:this.y})
        if(this.trail.length>this.trailMax) this.trail.shift()
        if(this.age>this.maxAge||this.x<-80||this.x>this.w+80||this.y<-80||this.y>this.h+80) this.reset()
      }
      draw(ctx) {
        const life=this.age/this.maxAge
        const alpha=Math.min(1,this.age/50)*(life>0.7?1-(life-0.7)/0.3:1)
        const color=lerpColor(COLORS[this.colorIdx],COLORS[this.colorIdx+1],this.colorT)
        for(let i=1;i<this.trail.length;i++){
          const p0=this.trail[i-1],p1=this.trail[i],tr=i/this.trail.length
          ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y)
          ctx.strokeStyle=color;ctx.globalAlpha=alpha*tr*0.4;ctx.lineWidth=tr*1.5;ctx.stroke()
        }
        const last=this.trail[this.trail.length-1]
        if(last){
          const g=ctx.createRadialGradient(last.x,last.y,0,last.x,last.y,8)
          g.addColorStop(0,color);g.addColorStop(1,'transparent')
          ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2)
          ctx.fillStyle=g;ctx.globalAlpha=alpha*0.65;ctx.fill()
        }
        ctx.globalAlpha=1
      }
    }

    let dnaPairs = [], solos = []
    const init = () => {
      dnaPairs = [new DNAPair(canvas.width, canvas.height), new DNAPair(canvas.width, canvas.height)]
      solos = [new Firefly(canvas.width, canvas.height), new Firefly(canvas.width, canvas.height), new Firefly(canvas.width, canvas.height)]
    }
    init()
    window.addEventListener('resize', init)
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dnaPairs.forEach(d => { d.update(); d.draw(ctx) })
      solos.forEach(f => { f.update(); f.draw(ctx) })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('resize', init) }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }} />
}

function TesseractBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['#C9A84C', '#e8d5a3', '#ff6eb4', '#6eb4ff', '#6effa0', '#ff9a6e']
    let colorIdx = 0
    let colorProgress = 0

    function lerpColor(a, b, t) {
      const parse = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]
      const [ar,ag,ab] = parse(a)
      const [br,bg,bb] = parse(b)
      return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`
    }

    // Tesseract: 8 vertices of outer cube, 8 of inner cube, connected
    // Project 4D hypercube to 2D with rotation
    function vertex4D(x, y, z, w) { return { x, y, z, w } }

    const verts4D = [
      // outer cube (w=1)
      vertex4D(-1,-1,-1, 1), vertex4D( 1,-1,-1, 1),
      vertex4D( 1, 1,-1, 1), vertex4D(-1, 1,-1, 1),
      vertex4D(-1,-1, 1, 1), vertex4D( 1,-1, 1, 1),
      vertex4D( 1, 1, 1, 1), vertex4D(-1, 1, 1, 1),
      // inner cube (w=-1)
      vertex4D(-1,-1,-1,-1), vertex4D( 1,-1,-1,-1),
      vertex4D( 1, 1,-1,-1), vertex4D(-1, 1,-1,-1),
      vertex4D(-1,-1, 1,-1), vertex4D( 1,-1, 1,-1),
      vertex4D( 1, 1, 1,-1), vertex4D(-1, 1, 1,-1),
    ]

    // Edges: outer cube, inner cube, and connecting edges
    const edges = [
      // outer cube
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],
      // inner cube
      [8,9],[9,10],[10,11],[11,8],[12,13],[13,14],[14,15],[15,12],[8,12],[9,13],[10,14],[11,15],
      // connecting outer-inner
      [0,8],[1,9],[2,10],[3,11],[4,12],[5,13],[6,14],[7,15],
    ]

    let t = 0

    function rotXY(v, a) {
      return { ...v, x: v.x*Math.cos(a) - v.y*Math.sin(a), y: v.x*Math.sin(a) + v.y*Math.cos(a) }
    }
    function rotXZ(v, a) {
      return { ...v, x: v.x*Math.cos(a) - v.z*Math.sin(a), z: v.x*Math.sin(a) + v.z*Math.cos(a) }
    }
    function rotYW(v, a) {
      return { ...v, y: v.y*Math.cos(a) - v.w*Math.sin(a), w: v.y*Math.sin(a) + v.w*Math.cos(a) }
    }
    function rotZW(v, a) {
      return { ...v, z: v.z*Math.cos(a) - v.w*Math.sin(a), w: v.z*Math.sin(a) + v.w*Math.cos(a) }
    }
    function rotXW(v, a) {
      return { ...v, x: v.x*Math.cos(a) - v.w*Math.sin(a), w: v.x*Math.sin(a) + v.w*Math.cos(a) }
    }

    function project(v) {
      // 4D -> 3D perspective
      const w4d = 2.5
      const d4 = w4d / (w4d - v.w)
      const x3 = v.x * d4
      const y3 = v.y * d4
      const z3 = v.z * d4

      // 3D -> 2D perspective
      const d3 = 4
      const zp = d3 / (d3 - z3)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const scale = Math.min(canvas.width, canvas.height) * 0.22

      return {
        x: cx + x3 * zp * scale,
        y: cy + y3 * zp * scale,
        depth: z3,
      }
    }

    // Electric impulses along tesseract edges
    const impulses = []
    const IMPULSE_COUNT = 6
    const IMP_COLORS = ['#C9A84C','#e8d5a3','#ff6eb4','#6eb4ff','#6effa0','#ff9a6e','#C9A84C']

    function spawnImpulse() {
      const edge = edges[Math.floor(Math.random() * edges.length)]
      impulses.push({
        edge, t: 0,
        speed: 0.012 + Math.random() * 0.018,
        colorIdx: Math.floor(Math.random() * (IMP_COLORS.length - 1)),
        colorT: Math.random(),
        size: 3 + Math.random() * 4,
      })
    }
    for (let i = 0; i < IMPULSE_COUNT; i++) {
      setTimeout(() => spawnImpulse(), i * 500 + Math.random() * 1000)
    }

    function drawImpulses(projected) {
      for (let k = impulses.length - 1; k >= 0; k--) {
        const imp = impulses[k]
        imp.t += imp.speed
        imp.colorT += 0.02
        if (imp.colorT >= 1) { imp.colorT = 0; imp.colorIdx = (imp.colorIdx+1) % (IMP_COLORS.length-1) }
        if (imp.t >= 1.2) {
          impulses.splice(k, 1)
          if (Math.random() < 0.75) spawnImpulse()
          continue
        }
        const [a, b] = imp.edge
        const pa = projected[a], pb = projected[b]
        if (!pa || !pb) continue
        const t = Math.min(imp.t, 1)
        const px = pa.x + (pb.x - pa.x) * t
        const py = pa.y + (pb.y - pa.y) * t
        const c1 = IMP_COLORS[imp.colorIdx], c2 = IMP_COLORS[imp.colorIdx+1]
        const r1=parseInt(c1.slice(1,3),16),g1=parseInt(c1.slice(3,5),16),b1=parseInt(c1.slice(5,7),16)
        const r2=parseInt(c2.slice(1,3),16),g2=parseInt(c2.slice(3,5),16),b2=parseInt(c2.slice(5,7),16)
        const cr=Math.round(r1+(r2-r1)*imp.colorT), cg=Math.round(g1+(g2-g1)*imp.colorT), cb=Math.round(b1+(b2-b1)*imp.colorT)
        const fade = imp.t < 0.1 ? imp.t/0.1 : imp.t > 0.85 ? 1-(imp.t-0.85)/0.3 : 1
        const t0 = Math.max(0, t-0.14)
        const tx0 = pa.x+(pb.x-pa.x)*t0, ty0 = pa.y+(pb.y-pa.y)*t0
        const grad = ctx.createLinearGradient(tx0, ty0, px, py)
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`)
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${0.8*fade})`)
        ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(px, py)
        ctx.strokeStyle = grad; ctx.globalAlpha = 1; ctx.lineWidth = 1.8; ctx.stroke()
        const glow = ctx.createRadialGradient(px, py, 0, px, py, imp.size*2.5)
        glow.addColorStop(0, `rgba(255,255,255,${0.95*fade})`)
        glow.addColorStop(0.3, `rgba(${cr},${cg},${cb},${0.8*fade})`)
        glow.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(px, py, imp.size*2.5, 0, Math.PI*2)
        ctx.fillStyle = glow; ctx.globalAlpha = 1; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, imp.size*0.5, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${0.98*fade})`; ctx.globalAlpha = 1; ctx.fill()
      }
    }

    function draw() {
      t += 0.003
      colorProgress += 0.002
      if (colorProgress >= 1) { colorProgress = 0; colorIdx = (colorIdx + 1) % COLORS.length }
      const currentColor = lerpColor(COLORS[colorIdx], COLORS[(colorIdx+1) % COLORS.length], colorProgress)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rotate in 4D
      const projected = verts4D.map(v => {
        let r = rotXY(v, t * 0.7)
        r = rotXZ(r, t * 0.5)
        r = rotYW(r, t * 0.4)
        r = rotZW(r, t * 0.3)
        r = rotXW(r, t * 0.6)
        return project(r)
      })

      // Draw edges — vary opacity by depth
      edges.forEach(([a, b]) => {
        const pa = projected[a]
        const pb = projected[b]
        const avgDepth = (pa.depth + pb.depth) / 2
        const alpha = 0.12 + avgDepth * 0.08

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = currentColor
        ctx.globalAlpha = Math.max(0.08, Math.min(0.32, alpha))
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      // Draw vertices
      projected.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = currentColor
        ctx.globalAlpha = 0.3
        ctx.fill()
      })

      drawImpulses(projected)
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
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
    { id: 'train',     label: 'Training' },
    { id: 'eliel',     label: 'Eliel' },
    { id: 'community', label: 'Community' },
  ]

  return (
    <div style={{ background: '#080808', minHeight: '100vh', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
      <style>{css}</style>

      <TesseractBg />
      <FireflyBg />

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 80 }} className={exitClass || enterClass}>
        {tab === 'eliel'     && <LobbyView onNavigate={setTab} />}
        {tab === 'train'     && <TrainView onNavigate={setTab} />}
        {tab === 'community' && <CommunityView onNavigate={setTab} />}
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
  )
}