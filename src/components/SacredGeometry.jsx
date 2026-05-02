export default function SacredGeometry({ auraColor = "#C9A84C", tab = "eliel" }) {
  const isLight = tab !== 'eliel'

  if (!isLight) {
    const r = 40
    const GOLD = "rgba(201,168,76,"
    const byLayer = { 0:[], 1:[], 2:[], 3:[], 4:[] }
    byLayer[0].push([0,0])
    for (let i=0;i<6;i++){const a=(i*Math.PI)/3;byLayer[1].push([r*Math.cos(a),r*Math.sin(a)])}
    for (let i=0;i<6;i++){const a=(i*Math.PI)/3;byLayer[2].push([2*r*Math.cos(a),2*r*Math.sin(a)]);const a2=a+Math.PI/6;byLayer[2].push([Math.sqrt(3)*r*Math.cos(a2),Math.sqrt(3)*r*Math.sin(a2)])}
    for (let i=0;i<6;i++){const a=(i*Math.PI)/3;byLayer[3].push([3*r*Math.cos(a),3*r*Math.sin(a)]);const a2=a+Math.PI/6;byLayer[3].push([2*Math.sqrt(3)*r*Math.cos(a2),2*Math.sqrt(3)*r*Math.sin(a2)])}
    for (let i=0;i<6;i++){const a=(i*Math.PI)/3;byLayer[4].push([4*r*Math.cos(a),4*r*Math.sin(a)])}
    const layerO = [0.55, 0.48, 0.32, 0.14, 0.06]
    const layerW = [0.65, 0.55, 0.4,  0.25, 0.15]
    const allCircles = Object.entries(byLayer).flatMap(([l,pts])=>pts.map(([x,y])=>({x,y,layer:parseInt(l)})))

    return (
      <svg style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:480, height:480, pointerEvents:'none', zIndex:1, overflow:'visible' }}
        viewBox="-240 -240 480 480">
        <defs>
          <radialGradient id="sgFade" cx="0" cy="0" r="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1"/>
            <stop offset="55%"  stopColor="white" stopOpacity="0.75"/>
            <stop offset="80%"  stopColor="white" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="sgMask">
            <rect x="-240" y="-240" width="480" height="480" fill="url(#sgFade)"/>
          </mask>
        </defs>
        <g mask="url(#sgMask)">
          {allCircles.map(({x,y,layer},i)=>(
            <circle key={`s${i}`} cx={x} cy={y} r={r} fill="none" stroke={`${GOLD}${layerO[layer]})`} strokeWidth={layerW[layer]}/>
          ))}
          {[1,1.732,2].map((sc,i)=>{
            const pts=Array.from({length:6},(_,j)=>{const a=(j*Math.PI)/3-Math.PI/6;return `${(r*sc*Math.cos(a)).toFixed(1)},${(r*sc*Math.sin(a)).toFixed(1)}`}).join(' ')
            return <polygon key={`h${i}`} points={pts} fill="none" stroke={`${GOLD}${[0.22,0.14,0.07][i]})`} strokeWidth="0.4"/>
          })}
          {[0,Math.PI/6].map((off,ti)=>{
            const pts=Array.from({length:3},(_,j)=>{const a=off+(j*2*Math.PI)/3;return `${(r*1.732*Math.cos(a)).toFixed(1)},${(r*1.732*Math.sin(a)).toFixed(1)}`}).join(' ')
            return <polygon key={`t${ti}`} points={pts} fill="none" stroke="rgba(160,100,220,0.16)" strokeWidth="0.35"/>
          })}
          <circle cx={0} cy={0} r="2.5" fill={`${GOLD}0.9)`}/>
          <circle cx={0} cy={0} r="6" fill="none" stroke={`${GOLD}0.3)`} strokeWidth="0.5"/>
        </g>
      </svg>
    )
  }

  return (
    <svg style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'480px', height:'100%', pointerEvents:'none', zIndex:0 }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="52" height="60" patternUnits="userSpaceOnUse">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" fill="none" stroke="#8B6A18" strokeWidth="0.6" opacity="0.28"/>
          <polygon points="26,10 40,18 40,34 26,42 12,34 12,18" fill="none" stroke="#7A5510" strokeWidth="0.3" opacity="0.16"/>
          <line x1="4"  y1="14" x2="12" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="14" x2="40" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="4"  y1="38" x2="12" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="38" x2="40" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="2"  x2="26" y2="10" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="50" x2="26" y2="42" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <circle cx="26" cy="26" r="1.8" fill="#C9A84C" opacity="0.35"/>
          <circle cx="26" cy="26" r="3.2" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.18"/>
          <circle cx="26" cy="2"  r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="26" cy="50" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
        </pattern>
        <pattern id="hex2" x="26" y="30" width="52" height="60" patternUnits="userSpaceOnUse">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" fill="none" stroke="#8B6A18" strokeWidth="0.6" opacity="0.28"/>
          <polygon points="26,10 40,18 40,34 26,42 12,34 12,18" fill="none" stroke="#7A5510" strokeWidth="0.3" opacity="0.16"/>
          <line x1="4"  y1="14" x2="12" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="14" x2="40" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="4"  y1="38" x2="12" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="38" x2="40" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="2"  x2="26" y2="10" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="50" x2="26" y2="42" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <circle cx="26" cy="26" r="1.8" fill="#C9A84C" opacity="0.35"/>
          <circle cx="26" cy="26" r="3.2" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.18"/>
          <circle cx="26" cy="2"  r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="26" cy="50" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#f5f0e8"/>
      <rect width="100%" height="100%" fill="url(#hex)"/>
      <rect width="100%" height="100%" fill="url(#hex2)"/>
    </svg>
  )
}