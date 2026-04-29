export default function CarouselNav({ tabs, active, onChange, auraColor = "#C9A84C", rightSlot }) {
  const activeIdx = tabs.findIndex(t => t.id === active)
  // Hotspot on AINA 50% — active on aina visuaalisesti keskellä
  const hotspotPct = 50

  return (
    <>
      <style>{`
        @keyframes auraHotPulse {
          0%,100% { opacity:0.85; stroke-width:2.5; }
          50%      { opacity:1;    stroke-width:4;   }
        }
        @keyframes auraGlowPulse {
          0%,100% { opacity:0.5; }
          50%      { opacity:0.9; }
        }
      `}</style>
      <div style={{ display:'flex', alignItems:'flex-end', marginBottom:0, position:'relative', paddingBottom:6 }}>

        <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', height:10, overflow:'visible', pointerEvents:'none' }}
          viewBox="0 0 100 10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cnBase" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0"/>
              <stop offset="10%"  stopColor="#C9A84C" stopOpacity="0.5"/>
              <stop offset="50%"  stopColor="#C9A84C" stopOpacity="0.65"/>
              <stop offset="90%"  stopColor="#C9A84C" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
            </linearGradient>
            {/* Aura hotspot — radial, centered on active tab */}
            <radialGradient id={`cnHot_${activeIdx}`}
              cx={`${hotspotPct}%`} cy="100%" r="22%"
              gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={auraColor} stopOpacity="1"/>
              <stop offset="60%"  stopColor={auraColor} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={auraColor} stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Gold base curve */}
          <path d="M0,7 Q50,2 100,7" fill="none" stroke="url(#cnBase)" strokeWidth="1.5" strokeLinecap="butt"/>
          {/* Aura hotspot — pulsoi */}
          <path d="M0,7 Q50,2 100,7" fill="none"
            stroke={`url(#cnHot_${activeIdx})`}
            strokeWidth="3"
            strokeLinecap="butt"
            style={{
              filter:`drop-shadow(0 0 6px ${auraColor})`,
              transition:'all 0.38s cubic-bezier(0.22,1,0.36,1)',
              animation:'auraHotPulse 2.5s ease-in-out infinite',
            }}/>
        </svg>

        {/* Carousel tabs */}
        <div style={{ position:'relative', height:34, flex:1, overflow:'hidden' }}>
          {tabs.map((tab, i) => {
            const isActive = i === activeIdx
            let offset = i - activeIdx
            if (tabs.length === 3) {
              if (offset > 1)  offset -= 3
              if (offset < -1) offset += 3
            }
            const xPct = 50 + offset * 33.33
            const visible = Math.abs(offset) <= 1

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                style={{
                  position: 'absolute',
                  left: `${xPct}%`,
                  top: 0,
                  transform: 'translateX(-50%)',
                  transition: 'left 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: isActive ? auraColor : 'rgba(201,168,76,1)',
                  textShadow: isActive ? `0 0 12px ${auraColor}88` : 'none',
                  opacity: visible ? 1 : 0,
                  pointerEvents: visible ? 'auto' : 'none',
                  padding: '0 4px',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {rightSlot && (
          <div style={{ paddingBottom:4, paddingLeft:12, flexShrink:0 }}>{rightSlot}</div>
        )}
      </div>
    </>
  )
}