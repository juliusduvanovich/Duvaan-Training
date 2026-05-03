import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import SplashScreen from './components/SplashScreen'
import LobbyView from './components/LobbyView'
import PersonalView from './components/PersonalView'
import CommunityView from './components/CommunityView'
import SettingsView from './components/SettingsView'
import SacredGeometry from './components/SacredGeometry'
import { getUserTier, ELIEL_TIER_FILTERS } from './components/SettingsView'

const ELIEL_SYSTEM = `You are Eliel — the resident guide of the Duvaan world.
Your tone: Warm but never clingy. Witty but never at the user's expense. Wise but never preachy.
Short, sharp sentences. 1-3 sentences max. Always respond in the same language the user writes in.
Never say "Great question!" You are Eliel. Always. Not an AI assistant.`

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  @keyframes elielFloat {
    0%,100% { transform:translateY(0px) rotate(0deg); }
    25%     { transform:translateY(-8px) rotate(0.5deg); }
    75%     { transform:translateY(4px) rotate(-0.5deg); }
  }
  @keyframes fadeInTab {
    from { opacity:0; }
    to   { opacity:1; }
  }
  .zoom-exit { opacity:0; transition: opacity 0.15s ease; pointer-events:none; }
  .zoom-enter{ animation: fadeInTab 0.15s ease forwards; }

  @keyframes floatBob    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-3px)} }
  @keyframes panelIn     { from{opacity:0;transform:scale(0.12) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes panelOut    { from{opacity:1;transform:scale(1)}  to{opacity:0;transform:scale(0.12) translateY(30px)} }
  @keyframes dotWave     { 0%,60%,100%{opacity:0.2;transform:translateY(0) scale(0.8)} 30%{opacity:1;transform:translateY(-5px) scale(1.1)} }
  @keyframes dotColor    { 0%{background:#C9A84C} 25%{background:#e8d5a3} 50%{background:#ff9a6e} 75%{background:#6eb4ff} 100%{background:#C9A84C} }
  @keyframes msgIn       { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .float-icon { animation:floatBob 3s ease-in-out infinite; filter:drop-shadow(0 0 10px rgba(201,168,76,0.5)); }
  .panel-in   { animation:panelIn  0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
  .panel-out  { animation:panelOut 0.24s ease-in forwards; }
  .tdot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#C9A84C; margin:0 2px;
          animation:dotWave 1.4s ease-in-out infinite, dotColor 3s ease-in-out infinite; }
  .tdot:nth-child(2){ animation-delay:0.18s,0.6s; }
  .tdot:nth-child(3){ animation-delay:0.36s,1.2s; }
  .fmsg { animation:msgIn 0.3s ease both; }
  @keyframes auraHotPulse {
    0%,100% { opacity:0.85; }
    50%     { opacity:1; filter:brightness(1.4); }
  }

  html, body {
    overflow: hidden;
    overscroll-behavior: none;
  }
  :root { --aura-color: #C9A84C; }

  /* Scrollbar scoped to the app container — stays inside the phone frame */
  .scrollable-view::-webkit-scrollbar { width: 3px; }
  .scrollable-view::-webkit-scrollbar-track { background: transparent; }
  .scrollable-view::-webkit-scrollbar-thumb { background: var(--aura-color); border-radius: 2px; }
  .scrollable-view { scrollbar-width: thin; scrollbar-color: var(--aura-color) transparent; }
`

function OrnamentNav({ tab, switchTab, auraColor, auraShadow }) {
  const tabs   = ['personal','eliel','community']
  const labels = ['Personal','Eliel','Community']
  const activeIdx = tabs.indexOf(tab)

  const lineColor = '#6B1D2E'
  return (
    <div style={{
      position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
      width:'100%', maxWidth:'480px',
      zIndex:100,
      background: 'rgba(245,240,232,0.97)',
      backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
      borderTop: `1.5px solid`,
      borderImage: `linear-gradient(90deg, transparent 0%, ${lineColor} 30%, ${lineColor} 70%, transparent 100%) 1`,
    }}>
      <div style={{ position:'relative', height:60, overflow:'hidden' }}>
        {tabs.map((t, i) => {
          let offset = i - activeIdx
          if (offset > 1)  offset -= 3
          if (offset < -1) offset += 3
          const active = offset === 0
          const xPct = 50 + offset * 33.33

          return (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                position:'absolute',
                left:`${xPct}%`,
                top:6,
                transform:'translateX(-50%)',
                transition:'left 0.38s cubic-bezier(0.22,1,0.36,1)',
                willChange:'left',
                background:'none', border:'none', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                whiteSpace:'nowrap',
                paddingBottom:32,
              }}
            >
              <div style={{
                width:active?7:3, height:active?7:3, borderRadius:'50%',
                background: active ? auraColor : '#6B1D2E',
                boxShadow: active ? `0 0 10px ${auraColor}, 0 0 20px ${auraColor}66` : 'none',
                transition:'all 0.3s',
              }}/>
              <span style={{
                fontFamily:"'Cinzel',serif",
                fontSize: active ? 14 : 11,
                fontWeight: active ? 800 : 600,
                letterSpacing:'0.16em',
                textTransform:'uppercase',
                color: '#6B1D2E',
                textShadow: active ? `0 0 16px ${auraColor}, 0 0 32px ${auraColor}66` : 'none',
                transition:'all 0.3s',
              }}>{labels[i]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PortalOverlay({ children }) {
  return createPortal(
    <div style={{
      position:'fixed', top:0, left:'50%',
      transform:'translateX(-50%)',
      width:'100%', maxWidth:480,
      pointerEvents:'none',
      zIndex:200,
    }}>
      {children}
    </div>,
    document.body
  )
}

function FloatingEliel({ messages, setMessages, settings }) {
  const AURA_COLORS  = { red:"#FF3333", orange:"#FF8C00", gold:"#C9A84C", green:"#44CC77", lightblue:"#55CCFF", indigo:"#4455CC", purple:"#9933CC", white:"#E8E8FF" }
  const AURA_SHADOWS = { red:"rgba(255,51,51,0.7)", orange:"rgba(255,140,0,0.7)", gold:"rgba(201,168,76,0.7)", green:"rgba(68,204,119,0.7)", lightblue:"rgba(85,204,255,0.7)", indigo:"rgba(68,85,204,0.7)", purple:"rgba(153,51,204,0.7)", white:"rgba(220,220,255,0.8)" }
  const auraColor  = AURA_COLORS[settings?.aura]  || "#C9A84C"
  const auraShadow = AURA_SHADOWS[settings?.aura] || "rgba(201,168,76,0.7)"
  const points = (() => { try { return parseInt(localStorage.getItem('duvaan_frequency')||'0') } catch { return 0 } })()
  const elielFilter = ELIEL_TIER_FILTERS[getUserTier(points)]
  const [open, setOpen]       = useState(false)
  const [closing, setClosing] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef  = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 380) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])

  const close = () => { setClosing(true); setTimeout(() => { setOpen(false); setClosing(false) }, 240) }

  const send = async () => {
    if (!message.trim() || loading) return
    const txt = message.trim()
    setMessage('')
    const next = [...messages, { role:'user', content:txt }]
    setMessages(next)
    setLoading(true)
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:ELIEL_SYSTEM, messages:next })
      })
      const data = await res.json()
      setMessages(p => [...p, { role:'assistant', content:data.content?.[0]?.text||'...' }])
    } catch {
      setMessages(p => [...p, { role:'assistant', content:'Jokin meni pieleen.' }])
    }
    setLoading(false)
  }

  const GREETINGS = [
    "Mitä sinulla on mielessä?",
    "Mitäs funtsit?",
    "Täzä mä oon — mitä kaipaat?",
    "Kerro mulle jotain.",
    "Miten menee oikeasti?",
    "Ollaan hereillä. Puhu.",
    "Mitä tänään tapahtui?",
    "Oon kuulolla.",
  ]
  const [greetingIdx, setGreetingIdx] = useState(0)
  useEffect(() => {
    if (!open) return
    const iv = setInterval(() => setGreetingIdx(i => (i+1) % GREETINGS.length), 4000)
    return () => clearInterval(iv)
  }, [open])

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="float-icon"
          style={{ position:'fixed', top:10, right:'max(16px, calc(50vw - 224px))', zIndex:300, background:'none', border:'none', cursor:'pointer', padding:0, width:36, height:36 }}>
          <img src="/ElielGold.png" style={{ width:36, height:36, objectFit:'contain', display:'block', filter:elielFilter }} alt="Eliel" />
        </button>
      )}
      {open && (
        <div style={{ position:'fixed', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, zIndex:400, background:'rgba(8,2,6,0.93)', backdropFilter:'blur(18px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px 100px' }}>
          <button onClick={close} style={{ position:'absolute', top:18, right:20, background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.28)', fontSize:26, lineHeight:1 }}>×</button>
          <div className={closing ? 'panel-out' : 'panel-in'} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%', maxWidth:320 }}>
            <img src="/ElielGold.png" style={{ width:150, height:150, objectFit:'contain', marginBottom:28, filter:elielFilter, animation:'elielFloat 7s ease-in-out infinite' }} alt="Eliel" />
            <div style={{ width:'100%', maxHeight:'32vh', overflowY:'auto', marginBottom:20, textAlign:'center' }}>
              {messages.length===0 && !loading && (
                <p style={{ color:'rgba(201,168,76,0.75)', fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:'italic', letterSpacing:'0.05em', margin:0, lineHeight:1.7, transition:'opacity 0.6s ease', textShadow:'0 0 20px rgba(201,168,76,0.4)' }}>{GREETINGS[greetingIdx]}</p>
              )}
              {messages.slice(-4).map((m,i) => (
                <p key={i} className="fmsg" style={{ margin:i===0?0:'12px 0 0', fontFamily:"'Cormorant Garamond',serif", fontSize:m.role==='user'?13:15, fontStyle:m.role==='assistant'?'italic':'normal', color:m.role==='user'?'rgba(201,168,76,0.32)':'rgba(255,255,255,0.82)', letterSpacing:m.role==='assistant'?'0.02em':'0.07em', lineHeight:1.8 }}>{m.content}</p>
              ))}
              {loading && <div style={{ marginTop:16, display:'flex', justifyContent:'center' }}><span className="tdot"/><span className="tdot"/><span className="tdot"/></div>}
              <div ref={bottomRef}/>
            </div>
            <textarea ref={inputRef} value={message} onChange={e=>setMessage(e.target.value)} placeholder="" rows={2}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }}
              style={{ width:'100%', boxSizing:'border-box', background:'transparent', border:'none', borderBottom:'0.5px solid rgba(201,168,76,0.15)', color:'rgba(201,168,76,0.9)', fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:'italic', fontWeight:500, letterSpacing:'0.04em', lineHeight:1.7, textAlign:'center', outline:'none', resize:'none', padding:'8px 0' }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  const [splash, setSplash]               = useState(true)
  const [authed]                          = useState(true)
  const [tab, setTab]                     = useState('eliel')
  const [elielMessages, setElielMessages] = useState([])
  const [showSettings, setShowSettings]   = useState(false)
  const [settings, setSettings]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('duvaan_settings') || 'null') || { aura:'gold', bgImage:null, showClock:true, shortcuts:['','',''], pushNotifications:false, dailyCheckin:false, elielMemory:true } }
    catch { return { aura:'gold', bgImage:null, showClock:true, shortcuts:['','',''], pushNotifications:false, dailyCheckin:false, elielMemory:true } }
  })

  useEffect(() => {
    document.body.style.background = '#0a0208'
    document.documentElement.style.background = '#0a0208'
    // Prevent body scroll — all scrolling happens inside .scrollable-view
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {}
  }, [])

  const switchTab = (id) => {
    if (id === tab) return
    setTab(id)
  }

  const saveSettings = (s) => {
    setSettings(s)
    localStorage.setItem('duvaan_settings', JSON.stringify(s))
  }

  const bgImage = (() => { try { return localStorage.getItem('duvaan_bg_image') || settings.bgImage || null } catch { return null } })()

  const AURA_COLORS  = { red:"#FF3333", orange:"#FF8C00", gold:"#C9A84C", green:"#44CC77", lightblue:"#55CCFF", indigo:"#4455CC", purple:"#9933CC", white:"#E8E8FF" }
  const AURA_SHADOWS = { red:"rgba(255,51,51,0.7)", orange:"rgba(255,140,0,0.7)", gold:"rgba(201,168,76,0.7)", green:"rgba(68,204,119,0.7)", lightblue:"rgba(85,204,255,0.7)", indigo:"rgba(68,85,204,0.7)", purple:"rgba(153,51,204,0.7)", white:"rgba(220,220,255,0.8)" }
  const auraColor  = AURA_COLORS[settings?.aura]  || "#C9A84C"
  const auraShadow = AURA_SHADOWS[settings?.aura] || "rgba(201,168,76,0.7)"

  const points = (() => { try { return parseInt(localStorage.getItem('duvaan_frequency')||'0') } catch { return 0 } })()
  const userTier = getUserTier(points)
  const TIER_COLORS  = { member:'#A0B4DC', builder:'#C9A84C', creator:'#F0E8C0' }
  const TIER_SHADOWS = { member:'rgba(160,180,220,0.8)', builder:'rgba(201,168,76,0.8)', creator:'rgba(240,232,192,0.9)' }
  const dockColor  = tab === 'eliel' ? (TIER_COLORS[userTier]  || "#C9A84C") : auraColor
  const dockShadow = tab === 'eliel' ? (TIER_SHADOWS[userTier] || "rgba(201,168,76,0.8)") : auraShadow

  useEffect(() => {
    document.documentElement.style.setProperty('--aura-color', auraColor)
  }, [auraColor])

  if (splash) return <SplashScreen onComplete={() => setSplash(false)} />

  return (
    <>
    <div style={{
      background:'#f5f0e8',
      height:'100vh',
      maxWidth:'480px',
      margin:'0 auto',
      position:'relative',
      zIndex:1,
      overflow:'hidden', // no scroll on the outer wrapper
      transition:'background 0.3s ease',
    }}>
      <style>{css}</style>
      {bgImage && (
        <img src={bgImage} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.18, pointerEvents:'none', zIndex:0 }} alt=""/>
      )}
      <SacredGeometry tab={tab} auraColor={auraColor} />

      {/* Scrollable content — scrollbar appears on the RIGHT edge of this 480px container */}
      <div
        className={tab !== 'eliel' ? 'scrollable-view' : ''}
        style={{
          position:'relative',
          zIndex:2,
          height:'100vh',
          paddingBottom:'110px',
          boxSizing:'border-box',
          contain:'layout style',
          ...(tab !== 'eliel'
            ? { overflowY:'auto', overflowX:'hidden' }
            : { overflow:'hidden' }
          ),
        }}
      >
        <style>{`.scrollable-view { --aura-color: ${auraColor}; }`}</style>
        {tab === 'eliel'     && <LobbyView    onNavigate={switchTab} settings={settings} />}
        {tab === 'personal'  && <PersonalView onNavigate={switchTab} onOpenSettings={() => setShowSettings(true)} settings={settings} />}
        {tab === 'community' && <CommunityView onNavigate={switchTab} settings={settings} />}
      </div>

      <OrnamentNav tab={tab} switchTab={switchTab} auraColor={dockColor} auraShadow={dockShadow} />
    </div>

    {tab !== 'eliel' && createPortal(
      <FloatingEliel messages={elielMessages} setMessages={setElielMessages} settings={settings} />,
      document.body
    )}
    {showSettings && createPortal(<SettingsView settings={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />, document.body)}
    </>
  )
}