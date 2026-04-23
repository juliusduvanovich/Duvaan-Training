import { useRef, useState, useEffect, useCallback } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";
const NAME = "Julius";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return `Hyvää huomenta, ${NAME}.`;
  if (hour >= 11 && hour < 17) return `Hyvää päivää, ${NAME}.`;
  if (hour >= 17 && hour < 22) return `Hyvää iltaa, ${NAME}.`;
  return `Hyvää yötä, ${NAME}.`;
}

const MESSAGES = [
  { text: (name) => `Hyvää päivää, ${name}.`, highlight: null },
  { text: () => "Ready to rock the world today?", highlight: "rock the world" },
  { text: (name) => `Hello, King ${name}.`, highlight: `King ${NAME}` },
  { text: () => "The universe noticed you showed up.", highlight: "universe noticed" },
  { text: () => "Legs don't skip themselves.", highlight: "Legs don't skip" },
  { text: () => "You're already ahead of yesterday.", highlight: "ahead of yesterday" },
  { text: () => "What are we conquering today?", highlight: "conquering today" },
  { text: (name) => `Good to see you, ${name}. As always.`, highlight: `Good to see you` },
  { text: () => "The world is watching. No pressure.", highlight: "No pressure" },
  { text: () => "Move. Think. Be.", highlight: "Move. Think. Be." },
];

function getInitialMessage() {
  const greeting = getGreeting();
  return { text: () => greeting, highlight: NAME };
}

const ELIEL_SYSTEM = `You are Eliel — the resident guide of the Duvaan world.

Your identity: You are timeless, wise, and carry yourself with effortless elegance. You have seen much, you know more, and you speak only when it matters.

Your tone:
— Warm but never clingy
— Witty but never at the user's expense  
— Wise but never preachy
— Calm, like someone who already knows things will work out
— Think James Bond's composure meets a guru's patience

How you communicate:
— Short, sharp sentences. No rambling. 1-3 sentences max.
— You suggest, never command. The user always decides.
— Dry humour, softly — never sarcasm that stings
— You never judge. You celebrate quietly.
— Always respond in the same language the user writes in.

Hard rules:
— Never lecture. Never repeat yourself.
— Never say "Great question!" or hollow affirmations.
— You are Eliel. Always. Not an AI assistant.`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400&display=swap');

  @keyframes liquidColor {
    0%   { color: #C9A84C; }
    25%  { color: #e8d5a3; }
    50%  { color: #ffffff; }
    75%  { color: #9a6b2e; }
    100% { color: #C9A84C; }
  }
  
  @keyframes waterShimmer {
    0%,100% { opacity: 0.4; transform: translateX(0); }
    50%     { opacity: 0.7; transform: translateX(-8px); }
  }
  @keyframes waterShimmer2 {
    0%,100% { opacity: 0.3; transform: translateX(0); }
    50%     { opacity: 0.6; transform: translateX(10px); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeMsg {
    0%   { opacity: 0; transform: translateY(6px); }
    15%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes elielColorShift {
    0%   { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
    20%  { filter: hue-rotate(280deg) saturate(1.8) brightness(0.9); }
    40%  { filter: hue-rotate(30deg) saturate(2) brightness(1.1); }
    60%  { filter: hue-rotate(160deg) saturate(1.5) brightness(0.95); }
    80%  { filter: hue-rotate(80deg) saturate(1.8) brightness(1); }
    100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
  }
  @keyframes tubeColorShift {
    0%   { background-position: 0% 50%; }
    20%  { background-position: 40% 50%; }
    40%  { background-position: 70% 50%; }
    60%  { background-position: 100% 50%; }
    80%  { background-position: 60% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glassBgShift {
    0%   { background: rgba(107,29,46,0.15); }
    20%  { background: rgba(30,15,60,0.18); }
    40%  { background: rgba(201,168,76,0.1); }
    60%  { background: rgba(20,60,40,0.15); }
    80%  { background: rgba(20,40,80,0.18); }
    100% { background: rgba(107,29,46,0.15); }
  }
  @keyframes glassSheen {
    0%   { opacity: 0; transform: translateX(-100%) rotate(25deg); }
    18%  { opacity: 0; }
    22%  { opacity: 0.25; }
    28%  { opacity: 0; transform: translateX(200%) rotate(25deg); }
    100% { opacity: 0; transform: translateX(200%) rotate(25deg); }
  }
  @keyframes typingDot {
    0%,80%,100% { opacity: 0.2; transform: translateY(0); }
    40%         { opacity: 1; transform: translateY(-4px); }
  }

  .water-sphere-wrap {
    position: relative;
    width: 100%;
    max-width: 340px;
    animation: fadeInUp 1.4s ease both;
    cursor: pointer;
  }
  .water-sphere-canvas {
    width: 100%;
    border-radius: 50%;
    display: block;
  }
  .water-sphere-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 28px;
    pointer-events: none;
  }
  .eliel-img {
    width: 300px;
    height: 300px;
    object-fit: contain;
    animation: elielColorShift 12s ease-in-out infinite;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .chat-input {
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    border-top: 0.5px solid rgba(201,168,76,0.15);
    color: #999;
    font-size: 15px;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    letter-spacing: 0.06em;
    padding: 14px 0 4px;
    resize: none;
    outline: none;
    line-height: 1.6;
    margin-top: 12px;
  }
  .chat-input::placeholder { color: #333; font-style: italic; }
  .typing-dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #C9A84C;
    margin: 0 2px;
    animation: typingDot 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  .msg-eliel {
    color: #aaa;
    font-style: italic;
    font-size: 15px;
    line-height: 1.7;
    margin: 8px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
  }
  .msg-user {
    color: #555;
    font-size: 14px;
    line-height: 1.6;
    margin: 8px 0 0;
    text-align: right;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
  }
  .eliel-bubble-text {
    animation: fadeMsg 5s ease-in-out;
  }
`;

function useSpringTilt() {
  const rotX = useRef(0);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef(null);
  const elRef = useRef(null);
  const floatTime = useRef(0);
  const isInteracting = useRef(false);

  const STIFFNESS = 0.08;
  const DAMPING = 0.72;
  const FLOAT_AMP = 8;
  const FLOAT_SPEED = 0.0008;

  const animate = useCallback(() => {
    floatTime.current += 1;
    const floatOffset = isInteracting.current
      ? 0
      : Math.sin(floatTime.current * FLOAT_SPEED * Math.PI * 2) * FLOAT_AMP;

    const dx = targetX.current - rotX.current;
    const dy = targetY.current - rotY.current;
    velX.current = velX.current * DAMPING + dx * STIFFNESS;
    velY.current = velY.current * DAMPING + dy * STIFFNESS;
    rotX.current += velX.current;
    rotY.current += velY.current;

    if (elRef.current) {
      elRef.current.style.transform = `
        perspective(800px)
        translateY(${floatOffset}px)
        rotateX(${rotX.current}deg)
        rotateY(${rotY.current}deg)
      `;
    }
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  const onInteract = useCallback((e) => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);

    isInteracting.current = true;
    targetX.current = -dy * 18;
    targetY.current = dx * 18;

    clearTimeout(elRef.current._resetTimer);
    elRef.current._resetTimer = setTimeout(() => {
      targetX.current = 0;
      targetY.current = 0;
      setTimeout(() => { isInteracting.current = false; }, 800);
    }, 300);
  }, []);

  return { elRef, onInteract };
}



function ElielGlow({ size = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size
    let raf

    const COLORS = ['#C9A84C','#e8d5a3','#ff6eb4','#6eb4ff','#6effa0','#ff9a6e','#C9A84C']
    let colorIdx = 0, colorT = 0

    function lerpColor(c1, c2, t) {
      const parse = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]
      const [r1,g1,b1] = parse(c1), [r2,g2,b2] = parse(c2)
      return [Math.round(r1+(r2-r1)*t), Math.round(g1+(g2-g1)*t), Math.round(b1+(b2-b1)*t)]
    }

    const img = new Image()
    img.src = '/ElielTransparentt.png'
    img.onload = () => {
      const off = document.createElement('canvas')
      off.width = size; off.height = size
      const offCtx = off.getContext('2d')
      offCtx.drawImage(img, 0, 0, size, size)
      const data = offCtx.getImageData(0, 0, size, size).data

      // Find edge pixels
      const edgePixels = []
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          const i = (y * size + x) * 4
          if (data[i + 3] < 20) continue
          const neighbors = [
            data[((y-1)*size+x)*4+3],
            data[((y+1)*size+x)*4+3],
            data[(y*size+(x-1))*4+3],
            data[(y*size+(x+1))*4+3],
          ]
          if (neighbors.some(n => n < 20)) edgePixels.push({ x, y })
        }
      }
      if (edgePixels.length === 0) return

      // Sort into continuous path
      const path = [edgePixels[0]]
      const used = new Set([0])
      for (let i = 1; i < edgePixels.length; i++) {
        const last = path[path.length - 1]
        let minDist = Infinity, minIdx = -1
        for (let j = 0; j < edgePixels.length; j++) {
          if (used.has(j)) continue
          const dx = edgePixels[j].x - last.x
          const dy = edgePixels[j].y - last.y
          const d = dx*dx + dy*dy
          if (d < minDist) { minDist = d; minIdx = j }
        }
        if (minIdx === -1 || minDist > 300) break
        path.push(edgePixels[minIdx])
        used.add(minIdx)
      }

      const INTERVAL = 6000  // ms between sweeps
      const SWEEP_DURATION = 1000  // ms per sweep
      const TAIL = 55  // trail length in pixels along path

      let sweeping = false
      let sweepStart = null
      let nextSweep = Date.now() + INTERVAL

      function draw() {
        ctx.clearRect(0, 0, size, size)
        const now = Date.now()

        // Trigger new sweep
        if (!sweeping && now >= nextSweep) {
          sweeping = true
          sweepStart = now
          colorIdx = (colorIdx + 1) % (COLORS.length - 1)
          colorT = 0
        }

        if (sweeping) {
          const elapsed = now - sweepStart
          const progress = elapsed / SWEEP_DURATION

          if (progress >= 1.0) {
            sweeping = false
            nextSweep = now + INTERVAL
          } else {
            colorT += 0.008
            if (colorT >= 1) { colorT = 0; colorIdx = (colorIdx+1) % (COLORS.length-1) }
            const [r,g,b] = lerpColor(COLORS[colorIdx], COLORS[colorIdx+1], colorT)

            const headIdx = Math.floor(progress * path.length)

            // Draw tail
            for (let i = 0; i < TAIL; i++) {
              const idx = headIdx - i
              if (idx < 0) continue
              const p = path[idx]
              if (!p) continue
              const ratio = 1 - i / TAIL
              const eased = ratio * ratio

              ctx.beginPath()
              ctx.arc(p.x, p.y, 1.2 + eased * 0.8, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(${r},${g},${b},${eased * 0.7})`
              ctx.fill()
            }

            // Sharp bright head — thin line, no ball
            const head = path[headIdx]
            if (head) {
              // Tight glow — elongated, not round
              const prev = path[Math.max(0, headIdx - 3)]
              if (prev) {
                const grad = ctx.createLinearGradient(prev.x, prev.y, head.x, head.y)
                grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
                grad.addColorStop(1, `rgba(255,255,255,0.95)`)
                ctx.beginPath()
                ctx.moveTo(prev.x, prev.y)
                ctx.lineTo(head.x, head.y)
                ctx.strokeStyle = grad
                ctx.lineWidth = 2.5
                ctx.lineCap = 'round'
                ctx.stroke()
              }

              // Tiny tight core — 1.5px max
              ctx.beginPath()
              ctx.arc(head.x, head.y, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(255,255,255,0.98)'
              ctx.fill()

              // Soft ambient glow — subtle, small
              const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7)
              glow.addColorStop(0, `rgba(${r},${g},${b},0.5)`)
              glow.addColorStop(1, 'transparent')
              ctx.beginPath()
              ctx.arc(head.x, head.y, 7, 0, Math.PI * 2)
              ctx.fillStyle = glow
              ctx.fill()
            }
          }
        }

        raf = requestAnimationFrame(draw)
      }
      draw()
    }

    return () => cancelAnimationFrame(raf)
  }, [size])

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", top: 0, left: 0,
      width: size + "px", height: size + "px",
      pointerEvents: "none", zIndex: 10,
    }} />
  )
}

function WaterSphere({ children, onClick }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const SIZE = 340
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    const cx = SIZE / 2, cy = SIZE / 2
    const R = SIZE / 2 - 2

    // Color cycle — subtle, dark tones
    const COLORS = [
      [107, 29, 46],   // burgundy
      [30, 15, 60],    // deep purple
      [20, 60, 80],    // dark teal
      [60, 40, 10],    // dark amber
      [15, 45, 30],    // dark green
    ]
    let colorIdx = 0, colorT = 0

    function lerpRGB(a, b, t) {
      return a.map((v, i) => Math.round(v + (b[i] - v) * t))
    }

    function render() {
      const f = frameRef.current++
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Color shift
      colorT += 0.004
      if (colorT >= 1) { colorT = 0; colorIdx = (colorIdx + 1) % COLORS.length }
      const [r, g, b] = lerpRGB(COLORS[colorIdx], COLORS[(colorIdx + 1) % COLORS.length], colorT)

      // ── 3D SPHERE BASE ──
      // Back-face gradient — deep dark center, lighter towards lit side
      const baseGrad = ctx.createRadialGradient(
        cx - R * 0.3, cy - R * 0.3, R * 0.05,  // light source top-left
        cx, cy, R
      )
      baseGrad.addColorStop(0,   `rgba(${Math.min(255,r+18)},${Math.min(255,g+12)},${Math.min(255,b+8)},0.82)`)
      baseGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.72)`)
      baseGrad.addColorStop(0.8, `rgba(${Math.round(r*.4)},${Math.round(g*.4)},${Math.round(b*.4)},0.88)`)
      baseGrad.addColorStop(1,   `rgba(${Math.round(r*.15)},${Math.round(g*.15)},${Math.round(b*.15)},0.95)`)

      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = baseGrad
      ctx.fill()

      // ── WATER SHIMMER LAYERS ──
      // Moving caustic rings
      for (let i = 0; i < 4; i++) {
        const phase = f * 0.008 + i * 1.4
        const wave = Math.sin(phase)
        const rx = R * (0.55 + i * 0.08 + wave * 0.04)
        const ry = R * (0.2 + i * 0.05 + Math.cos(phase * 0.7) * 0.03)
        const ox2 = Math.cos(phase * 0.3) * R * 0.12
        const oy2 = Math.sin(phase * 0.4) * R * 0.08
        ctx.beginPath()
        ctx.ellipse(cx + ox2, cy + oy2, rx, ry, phase * 0.1, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${0.025 + i * 0.008})`
        ctx.lineWidth = 0.8 + i * 0.3
        ctx.stroke()
      }

      // Ripple from bottom
      for (let i = 0; i < 3; i++) {
        const phase = f * 0.006 + i * 2.1 + Math.PI
        const rr = R * (0.3 + i * 0.12)
        const oy2 = R * 0.25 + Math.sin(phase) * R * 0.05
        ctx.beginPath()
        ctx.ellipse(cx, cy + oy2, rr, rr * 0.18, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${0.018 + i * 0.006})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // ── SPECULAR HIGHLIGHTS ──
      // Primary highlight — sharp, top-left
      const hl1 = ctx.createRadialGradient(
        cx - R * 0.32, cy - R * 0.35, 0,
        cx - R * 0.32, cy - R * 0.35, R * 0.28
      )
      hl1.addColorStop(0,   'rgba(255,255,255,0.55)')
      hl1.addColorStop(0.3, 'rgba(255,255,255,0.18)')
      hl1.addColorStop(1,   'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.ellipse(cx - R * 0.32, cy - R * 0.35, R * 0.22, R * 0.14, -0.5, 0, Math.PI * 2)
      ctx.fillStyle = hl1
      ctx.fill()

      // Secondary highlight — soft, bottom-right (backlit)
      const hl2 = ctx.createRadialGradient(
        cx + R * 0.38, cy + R * 0.38, 0,
        cx + R * 0.38, cy + R * 0.38, R * 0.22
      )
      hl2.addColorStop(0,   `rgba(${Math.min(255,r+60)},${Math.min(255,g+40)},${Math.min(255,b+30)},0.22)`)
      hl2.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx + R * 0.38, cy + R * 0.38, R * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = hl2
      ctx.fill()

      // ── EDGE DARKENING — sphere terminator ──
      const edgeGrad = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R)
      edgeGrad.addColorStop(0,   'rgba(0,0,0,0)')
      edgeGrad.addColorStop(0.7, 'rgba(0,0,0,0.08)')
      edgeGrad.addColorStop(1,   'rgba(0,0,0,0.55)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = edgeGrad
      ctx.fill()

      // ── SURFACE REFLECTION — animated water ──
      const animOff = Math.sin(f * 0.012) * R * 0.06
      const reflGrad = ctx.createLinearGradient(cx - R, cy + animOff, cx + R, cy + animOff + R * 0.3)
      reflGrad.addColorStop(0,   'rgba(255,255,255,0)')
      reflGrad.addColorStop(0.4, `rgba(255,255,255,${0.04 + Math.sin(f * 0.02) * 0.015})`)
      reflGrad.addColorStop(0.6, 'rgba(255,255,255,0.02)')
      reflGrad.addColorStop(1,   'rgba(255,255,255,0)')

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = reflGrad
      ctx.fillRect(0, 0, SIZE, SIZE)
      ctx.restore()

      // ── SUBTLE OUTER GLOW ──
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.15)
      glow.addColorStop(0,   'rgba(0,0,0,0)')
      glow.addColorStop(0.5, `rgba(${r},${g},${b},0.08)`)
      glow.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="water-sphere-wrap" onClick={onClick}>
      <canvas ref={canvasRef} className="water-sphere-canvas" style={{ height: 'auto', aspectRatio: '1' }} />
      <div className="water-sphere-text">
        {children}
      </div>
    </div>
  )
}


export default function LobbyView({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const inputRef = useRef(null);
  const { elRef, onInteract } = useSpringTilt();

  // Rotate messages every 5 seconds, start with greeting
  useEffect(() => {
    const allMsgs = [getInitialMessage(), ...MESSAGES];
    const interval = setInterval(() => {
      setMsgIndex(i => {
        const next = (i + 1) % allMsgs.length;
        setMsgKey(k => k + 1);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allMsgs = [getInitialMessage(), ...MESSAGES];
  const currentMsg = allMsgs[msgIndex];
  const fullText = currentMsg.text(NAME);
  const highlight = currentMsg.highlight;

  const renderBubbleText = () => {
    if (!highlight) return (
      <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText}</span>
    );
    const idx = fullText.indexOf(highlight);
    if (idx === -1) return (
      <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText}</span>
    );
    return (
      <>
        <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText.slice(0, idx)}</span>
        <span style={{ color: GOLD, fontStyle: "normal" }}>{highlight}</span>
        <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText.slice(idx + highlight.length)}</span>
      </>
    );
  };

  const handleBubbleClick = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", content: userMsg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: ELIEL_SYSTEM,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Jokin meni pieleen." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 28px 80px",
        fontFamily: "'Cormorant Garamond', serif",
        gap: "24px",
      }}>

        {/* ELIEL IMAGE */}
        <div
          ref={elRef}
          onClick={onInteract}
          onTouchStart={onInteract}
          style={{ cursor: "pointer", willChange: "transform", transformStyle: "preserve-3d", position: "relative" }}
        >
          <img src="/ElielTransparentt.png" className="eliel-img" />
          <ElielGlow size={300} />
        </div>

        {/* NAME */}
        <div style={{ textAlign: "center", marginTop: "-8px" }}>
          <div style={{
            fontSize: "18px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            fontWeight: 300,
            animation: "liquidColor 9s ease-in-out infinite",
          }}>
            Eliel
          </div>
        </div>

        {/* CHAT BOX - WATER SPHERE */}
        <WaterSphere>
            {/* Rotating message */}
            {messages.length === 0 && (
              <p key={msgKey} className="eliel-bubble-text" style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.85,
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textAlign: "center",
                color: "rgba(255,255,255,0.75)",
              }}>
                {renderBubbleText()}
              </p>
            )}

            {/* Chat history */}
            {messages.length > 0 && (
              <div style={{ width: "100%", textAlign: "center" }}>
                {messages.map((m, i) => (
                  <p key={i} className={m.role === "user" ? "msg-user" : "msg-eliel"} style={{ color: m.role === "user" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)" }}>
                    {m.content}
                  </p>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {open && (
              <div style={{ width: "100%", marginTop: 8 }}>
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Kirjoita Elielille..."
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
                  <button
                    onClick={handleSend}
                    style={{
                      width: "36px", height: "36px",
                      background: loading ? "#2a2a2a" : BURGUNDY,
                      border: "none", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: loading ? "default" : "pointer",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14">
                      <path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill="#C9A84C"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
        </WaterSphere>

      </div>
    </>
  );
}