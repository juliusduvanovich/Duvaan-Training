export default function SacredGeometry({ auraColor = "#C9A84C" }) {
  const r = 40
  const GOLD = "rgba(201,168,76,"
  const circ = +(2 * Math.PI * r).toFixed(1)

  // Flower of Life per kerros — koordinaatit suhteessa keskipisteeseen (0,0)
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
    <>
      <style>{`
        /* Impulssi: 8s sykli, 1.5s burst, kerros kerrokselta */
        @keyframes spark0 {
          0%,1%    { stroke-dashoffset:${circ}; opacity:0; }
          3%        { opacity:1; }
          18%       { stroke-dashoffset:0; opacity:0.8; }
          20%,100%  { stroke-dashoffset:0; opacity:0; }
        }
        @keyframes spark1 {
          0%,4%    { stroke-dashoffset:${circ}; opacity:0; }
          6%        { opacity:0.85; }
          20%       { stroke-dashoffset:0; opacity:0.6; }
          22%,100%  { stroke-dashoffset:0; opacity:0; }
        }
        @keyframes spark2 {
          0%,8%    { stroke-dashoffset:${circ}; opacity:0; }
          10%       { opacity:0.7; }
          24%       { stroke-dashoffset:0; opacity:0.4; }
          26%,100%  { stroke-dashoffset:0; opacity:0; }
        }
        @keyframes spark3 {
          0%,12%   { stroke-dashoffset:${circ}; opacity:0; }
          14%       { opacity:0.45; }
          28%       { stroke-dashoffset:0; opacity:0.2; }
          30%,100%  { stroke-dashoffset:0; opacity:0; }
        }
        @keyframes spark4 {
          0%,16%   { stroke-dashoffset:${circ}; opacity:0; }
          18%       { opacity:0.25; }
          32%       { stroke-dashoffset:0; opacity:0.1; }
          34%,100%  { stroke-dashoffset:0; opacity:0; }
        }
      `}</style>

      <svg
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          height: 480,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'visible',
        }}
        viewBox="-240 -240 480 480"
      >
        <defs>
          {/* Fade mask — häivyttää reunoille */}
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

        {/* Staattinen geometria — maskin alla */}
        <g mask="url(#sgMask)">
          {allCircles.map(({x,y,layer},i)=>(
            <circle key={`s${i}`} cx={x} cy={y} r={r}
              fill="none" stroke={`${GOLD}${layerO[layer]})`} strokeWidth={layerW[layer]}/>
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
          <circle cx={0} cy={0} r="6"   fill="none" stroke={`${GOLD}0.3)`} strokeWidth="0.5"/>
        </g>

        {/* Impulssit — EI filteriä, pelkkä stroke + opacity animaatio = nopea */}
        {/* Kerros 0 */}
        <circle cx={0} cy={0} r={r} fill="none"
          stroke={auraColor} strokeWidth="2.5" strokeDasharray={circ}
          style={{animation:'spark0 8s ease-in-out infinite'}}/>

        {/* Kerros 1 — yksi impulssi per animaatiokierros, ei 6 erillistä */}
        <circle cx={0} cy={0} r={r*2} fill="none"
          stroke={auraColor} strokeWidth="1.8" strokeDasharray={+(2*Math.PI*r*2).toFixed(1)}
          style={{animation:'spark1 8s ease-in-out infinite'}}/>

        {/* Kerros 2 */}
        <circle cx={0} cy={0} r={r*2*Math.sqrt(3)/Math.sqrt(3)*1.1} fill="none"
          stroke={auraColor} strokeWidth="1.2" strokeDasharray={+(2*Math.PI*r*2.15).toFixed(1)}
          style={{animation:'spark2 8s ease-in-out infinite'}}/>

        {/* Kerros 3 */}
        <circle cx={0} cy={0} r={r*3.2} fill="none"
          stroke={auraColor} strokeWidth="0.8" strokeDasharray={+(2*Math.PI*r*3.2).toFixed(1)}
          style={{animation:'spark3 8s ease-in-out infinite'}}/>

        {/* Kerros 4 */}
        <circle cx={0} cy={0} r={r*4.2} fill="none"
          stroke={auraColor} strokeWidth="0.5" strokeDasharray={+(2*Math.PI*r*4.2).toFixed(1)}
          style={{animation:'spark4 8s ease-in-out infinite'}}/>

      </svg>
    </>
  )
}