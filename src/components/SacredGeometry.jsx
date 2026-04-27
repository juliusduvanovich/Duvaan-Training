export default function SacredGeometry({ auraColor = "#C9A84C" }) {
  const r = 40
  const GOLD = "rgba(201,168,76,"
  const circ = +(2 * Math.PI * r).toFixed(1)
  const CYCLE = 8
  const BURST = 1.5

  // Flower of Life ympyrät per kerros
  const byLayer = { 0:[], 1:[], 2:[], 3:[], 4:[] }
  byLayer[0].push([0, 0])
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    byLayer[1].push([r * Math.cos(a), r * Math.sin(a)])
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    byLayer[2].push([2*r*Math.cos(a), 2*r*Math.sin(a)])
    const a2 = a + Math.PI/6
    byLayer[2].push([Math.sqrt(3)*r*Math.cos(a2), Math.sqrt(3)*r*Math.sin(a2)])
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    byLayer[3].push([3*r*Math.cos(a), 3*r*Math.sin(a)])
    const a2 = a + Math.PI/6
    byLayer[3].push([2*Math.sqrt(3)*r*Math.cos(a2), 2*Math.sqrt(3)*r*Math.sin(a2)])
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    byLayer[4].push([4*r*Math.cos(a), 4*r*Math.sin(a)])
    const a2 = a + Math.PI/6
    byLayer[4].push([3*Math.sqrt(3)*r*Math.cos(a2)*0.9, 3*Math.sqrt(3)*r*Math.sin(a2)*0.9])
  }

  const layerO = [0.55, 0.48, 0.32, 0.14, 0.06]
  const layerW = [0.7,  0.6,  0.45, 0.3,  0.2]
  const allCircles = Object.entries(byLayer).flatMap(([l,pts]) =>
    pts.map(([x,y]) => ({ x, y, layer: parseInt(l) }))
  )

  // Impulssit: spark per kerros, 8s sykli
  const pct = n => (n/CYCLE*100).toFixed(2)

  return (
    <>
      <style>{`
        @keyframes spark0 {
          0%              { stroke-dashoffset:${circ}; opacity:0; }
          ${pct(0.05)}%   { opacity:1; }
          ${pct(BURST*.6)}% { opacity:1; }
          ${pct(BURST)}%  { stroke-dashoffset:0; opacity:0; }
          100%            { stroke-dashoffset:${circ}; opacity:0; }
        }
        @keyframes spark1 {
          0%, ${pct(0.18)}% { stroke-dashoffset:${circ}; opacity:0; }
          ${pct(0.22)}%     { opacity:0.9; }
          ${pct(0.18+BURST)}% { stroke-dashoffset:0; opacity:0; }
          100%              { stroke-dashoffset:${circ}; opacity:0; }
        }
        @keyframes spark2 {
          0%, ${pct(0.4)}%  { stroke-dashoffset:${circ}; opacity:0; }
          ${pct(0.44)}%     { opacity:0.75; }
          ${pct(0.4+BURST)}% { stroke-dashoffset:0; opacity:0; }
          100%              { stroke-dashoffset:${circ}; opacity:0; }
        }
        @keyframes spark3 {
          0%, ${pct(0.65)}% { stroke-dashoffset:${circ}; opacity:0; }
          ${pct(0.68)}%     { opacity:0.5; }
          ${pct(0.65+BURST)}% { stroke-dashoffset:0; opacity:0; }
          100%              { stroke-dashoffset:${circ}; opacity:0; }
        }
        @keyframes spark4 {
          0%, ${pct(0.95)}% { stroke-dashoffset:${circ}; opacity:0; }
          ${pct(0.98)}%     { opacity:0.25; }
          ${pct(0.95+BURST)}% { stroke-dashoffset:0; opacity:0; }
          100%              { stroke-dashoffset:${circ}; opacity:0; }
        }
      `}</style>

      {/* SVG käyttää 100vw × 100vh ja sijoittaa kukan täydelliseen keskelle */}
      <svg
        style={{
          position: 'fixed',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480,
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 480 100"
        preserveAspectRatio="none"
      >
      </svg>

      {/* Erillinen SVG joka käyttää viewport-yksikköjä — kukka TARKASTI 50vh 50vw */}
      <svg
        style={{
          position: 'fixed',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480,
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 480 860"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Fade mask keskeltä */}
          <radialGradient id="sgFade" cx="50%" cy="50%" r="48%">
            <stop offset="0%"   stopColor="white" stopOpacity="1"/>
            <stop offset="50%"  stopColor="white" stopOpacity="0.8"/>
            <stop offset="78%"  stopColor="white" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="sgMask">
            <rect x="0" y="0" width="480" height="860" fill="url(#sgFade)"
              transform="translate(0,0)"
            />
          </mask>
          {/* Radial fade centeroitu kukalle */}
          <radialGradient id="sgFade2" cx="240" cy="430" r="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1"/>
            <stop offset="55%"  stopColor="white" stopOpacity="0.7"/>
            <stop offset="80%"  stopColor="white" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="sgMask2">
            <rect x="0" y="0" width="480" height="860" fill="url(#sgFade2)"/>
          </mask>
          {/* Glow filter impulsseille */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Kaikki geometria keskitettynä pisteeseen (240, 430) = tarkka keskipiste 480×860 */}
        <g transform="translate(240, 430)">

          {/* ── STAATTINEN GEOMETRIA ── */}
          <g mask="url(#sgMask2)" transform="translate(-240,-430)">
            <g transform="translate(240,430)">
              {allCircles.map(({x,y,layer},i) => (
                <circle key={`s${i}`} cx={x} cy={y} r={r}
                  fill="none"
                  stroke={`${GOLD}${layerO[layer]})`}
                  strokeWidth={layerW[layer]}
                />
              ))}
              {[1,1.732,2].map((sc,i) => {
                const pts = Array.from({length:6},(_,j)=>{
                  const a=(j*Math.PI)/3-Math.PI/6
                  return `${(r*sc*Math.cos(a)).toFixed(2)},${(r*sc*Math.sin(a)).toFixed(2)}`
                }).join(' ')
                return <polygon key={`h${i}`} points={pts} fill="none"
                  stroke={`${GOLD}${[0.25,0.15,0.08][i]})`} strokeWidth="0.4"/>
              })}
              {[0,Math.PI/6].map((off,ti)=>{
                const pts=Array.from({length:3},(_,j)=>{
                  const a=off+(j*2*Math.PI)/3
                  return `${(r*1.732*Math.cos(a)).toFixed(2)},${(r*1.732*Math.sin(a)).toFixed(2)}`
                }).join(' ')
                return <polygon key={`t${ti}`} points={pts} fill="none"
                  stroke="rgba(160,100,220,0.18)" strokeWidth="0.35"/>
              })}
              <circle cx={0} cy={0} r="2.5" fill={`${GOLD}0.9)`}/>
              <circle cx={0} cy={0} r="6"   fill="none" stroke={`${GOLD}0.35)`} strokeWidth="0.5"/>
            </g>
          </g>

          {/* ── SÄHKÖIMPULSSIT (ei maskia, täysi kirkkaus) ── */}

          {/* Kerros 0 — glow + terävä viiva */}
          <circle cx={0} cy={0} r={r} fill="none"
            stroke={auraColor} strokeWidth="3"
            strokeDasharray={circ} filter="url(#glow)"
            style={{animation:`spark0 ${CYCLE}s ease-in-out infinite`}}/>
          <circle cx={0} cy={0} r={r} fill="none"
            stroke="white" strokeWidth="1"
            strokeDasharray={circ} strokeOpacity="0.6"
            style={{animation:`spark0 ${CYCLE}s ease-in-out infinite`}}/>

          {/* Kerros 1 */}
          {byLayer[1].map(([x,y],i) => (
            <g key={`i1${i}`}>
              <circle cx={x} cy={y} r={r} fill="none"
                stroke={auraColor} strokeWidth="2.2"
                strokeDasharray={circ} filter="url(#glow)"
                style={{animation:`spark1 ${CYCLE}s ease-in-out infinite`, animationDelay:`${i*0.05}s`}}/>
              <circle cx={x} cy={y} r={r} fill="none"
                stroke="white" strokeWidth="0.7"
                strokeDasharray={circ} strokeOpacity="0.5"
                style={{animation:`spark1 ${CYCLE}s ease-in-out infinite`, animationDelay:`${i*0.05}s`}}/>
            </g>
          ))}

          {/* Kerros 2 */}
          {byLayer[2].map(([x,y],i) => (
            <circle key={`i2${i}`} cx={x} cy={y} r={r} fill="none"
              stroke={auraColor} strokeWidth="1.6"
              strokeDasharray={circ} filter="url(#glowSoft)"
              style={{animation:`spark2 ${CYCLE}s ease-in-out infinite`, animationDelay:`${i*0.04}s`}}/>
          ))}

          {/* Kerros 3 */}
          {byLayer[3].slice(0,8).map(([x,y],i) => (
            <circle key={`i3${i}`} cx={x} cy={y} r={r} fill="none"
              stroke={auraColor} strokeWidth="1"
              strokeDasharray={circ} filter="url(#glowSoft)"
              style={{animation:`spark3 ${CYCLE}s ease-in-out infinite`, animationDelay:`${i*0.035}s`}}/>
          ))}

          {/* Kerros 4 */}
          {byLayer[4].slice(0,8).map(([x,y],i) => (
            <circle key={`i4${i}`} cx={x} cy={y} r={r} fill="none"
              stroke={auraColor} strokeWidth="0.6"
              strokeDasharray={circ}
              style={{animation:`spark4 ${CYCLE}s ease-in-out infinite`, animationDelay:`${i*0.03}s`}}/>
          ))}

        </g>
      </svg>
    </>
  )
}