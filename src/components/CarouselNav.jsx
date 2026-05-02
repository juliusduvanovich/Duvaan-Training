export default function CarouselNav({ tabs, active, onChange, auraColor = "#C9A84C", lineColor = "#6B1D2E", textColor = "#6B1D2E", rightSlot }) {
  const activeIdx = tabs.findIndex(t => t.id === active)

  return (
    <div style={{ display:'flex', alignItems:'flex-end', marginBottom:0, position:'relative', paddingBottom:6 }}>

      {/* Kaareva viiva */}
      <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', height:6, overflow:'visible', pointerEvents:'none' }}
        viewBox="0 0 100 6" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cnBase" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={lineColor} stopOpacity="0"/>
            <stop offset="20%"  stopColor={lineColor} stopOpacity="0.8"/>
            <stop offset="50%"  stopColor={lineColor} stopOpacity="1"/>
            <stop offset="80%"  stopColor={lineColor} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,5 Q50,1 100,5" fill="none" stroke="url(#cnBase)" strokeWidth="1"/>
      </svg>

      {/* Carousel tabs */}
      <div style={{ position:'relative', height:38, flex:1, overflow:'hidden' }}>
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
                transition: 'left 0.38s cubic-bezier(0.22,1,0.36,1), font-size 0.2s ease',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                fontSize: isActive ? 15 : 12,
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: '#6B1D2E',
                textShadow: isActive ? `0 0 18px ${auraColor}, 0 0 32px ${auraColor}88` : 'none',
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
  )
}