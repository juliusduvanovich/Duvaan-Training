import { useState, useRef } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

export const TIER_THRESHOLDS = { member:0, builder:1000, creator:5000 }

export function getUserTier(points) {
  if (points >= 5000) return 'creator'
  if (points >= 1000) return 'builder'
  return 'member'
}

export const ELIEL_TIER_FILTERS = {
  member:  'sepia(0.8) saturate(0.4) brightness(1.1) hue-rotate(180deg) drop-shadow(0 0 18px rgba(160,180,220,0.6))',
  builder: 'drop-shadow(0 0 18px rgba(201,168,76,0.55))',
  creator: 'sepia(0.05) saturate(0.6) brightness(1.4) contrast(1.1) drop-shadow(0 0 24px rgba(220,240,255,0.9))',
}

export const ELIEL_TIER_GLOW = {
  member:  '#A0B4DC',
  builder: '#C9A84C',
  creator: '#DCF0FF',
}

export const AURAS = [
  { id:"red",       name:"Red",    color:"#FF3333", shadow:"rgba(255,51,51,0.8)",   desc:"Voima",       unlockedAt:'member'  },
  { id:"orange",    name:"Orange", color:"#FF8C00", shadow:"rgba(255,140,0,0.8)",   desc:"Energia",     unlockedAt:'member'  },
  { id:"gold",      name:"Gold",   color:"#C9A84C", shadow:"rgba(201,168,76,0.8)",  desc:"Viisaus",     unlockedAt:'member'  },
  { id:"green",     name:"Green",  color:"#44CC77", shadow:"rgba(68,204,119,0.8)",  desc:"Kasvu",       unlockedAt:'builder' },
  { id:"lightblue", name:"Sky",    color:"#55CCFF", shadow:"rgba(85,204,255,0.8)",  desc:"Ilmaisu",     unlockedAt:'builder' },
  { id:"indigo",    name:"Indigo", color:"#4455CC", shadow:"rgba(68,85,204,0.8)",   desc:"Intuitio",    unlockedAt:'creator' },
  { id:"purple",    name:"Purple", color:"#9933CC", shadow:"rgba(153,51,204,0.8)",  desc:"Mystiikka",   unlockedAt:'creator' },
  { id:"white",     name:"White",  color:"#E8E8FF", shadow:"rgba(220,220,255,0.9)", desc:"Puhtaus",     unlockedAt:'creator' },
]

export const ELIEL_TIER_FILTER_KEYS = { member:'member', builder:'builder', creator:'creator' }

const NOTIF_ITEMS = [
  { key:"notifFrequency", label:"Frequency-muistutus",        sub:"Muistuttaa jos treenistreak on vaarassa" },
  { key:"notifEliel",     label:"Elielin päivittäinen insight",sub:"Eliel lähettää aamuisin yhden lauseen" },
  { key:"notifNotes",     label:"Muistiinpanomuistutukset",    sub:"Muistuttaa avoimista muistiinpanoista" },
  { key:"notifClub",      label:"Klubiaktiivisuus",            sub:"Uutta toimintaa klubeissasi" },
  { key:"notifEvents",    label:"Tapahtumat lähistöllä",       sub:"Sinulle sopiva klubi tai tapahtuma lähellä" },
  { key:"notifMessages",  label:"Yksityisklubin viestit",      sub:"Viestit yksityisen klubisi jäseniltä" },
  { key:"notifContent",   label:"Uusi Duvaan-sisältö",         sub:"Musiikkia, artikkeleita ja julkaisuja" },
]

const FREQ_LEVELS = [
  { name:'Member',  icon:'◈', color:'#A0B4DC', min:0,    max:999,  price:'4€/kk'  },
  { name:'Builder', icon:'✦', color:'#C9A84C', min:1000, max:4999, price:'9€/kk'  },
  { name:'Creator', icon:'✸', color:'#FFF5D0', min:5000, max:null, price:'16€/kk' },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes breatheBox {
    0%,100% { box-shadow: 0 2px 12px #6B1D2E, 0 0 0 rgba(201,168,76,0); }
    50%     { box-shadow: 0 4px 20px #6B1D2E, 0 0 0 rgba(201,168,76,0); }
  }
  @keyframes auraPulse {
    0%,85%,100% { box-shadow: 0 2px 12px #6B1D2E; }
    88%  { box-shadow: 0 0 0 2px var(--ac), 0 0 18px var(--ac), 0 2px 12px #6B1D2E; }
    93%  { box-shadow: 0 0 0 1px var(--ac), 0 0 8px var(--ac), 0 2px 12px #6B1D2E; }
    96%  { box-shadow: 0 0 0 2px var(--ac), 0 0 22px var(--ac), 0 2px 12px #6B1D2E; }
  }

  .s-section {
    background: rgba(255,255,255,0.55);
    border: 1.5px solid #6B1D2E;
    border-radius: 16px;
    padding: 18px 16px;
    margin-bottom: 12px;
    animation: fadeUp 0.3s ease both, auraPulse 9s ease-in-out infinite;
  }
  .s-section:nth-child(2) { animation-delay: 0s, 1s; }
  .s-section:nth-child(3) { animation-delay: 0.05s, 2.5s; }
  .s-section:nth-child(4) { animation-delay: 0.1s, 4s; }
  .s-section:nth-child(5) { animation-delay: 0.15s, 5.5s; }
  .s-section:nth-child(6) { animation-delay: 0.2s, 7s; }

  .s-row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid #6B1D2E; }
  .s-row:last-child { border-bottom:none; }
  .toggle-track { width:44px; height:24px; border-radius:12px; position:relative; cursor:pointer; transition:background 0.22s; flex-shrink:0; border:1.5px solid rgba(201,168,76,0.4); }
  .toggle-thumb { width:18px; height:18px; border-radius:50%; position:absolute; top:2px; transition:left 0.22s,background 0.22s; }
  .danger-btn { width:100%; padding:12px 0; background:rgba(255,50,50,0.06); border:1.5px solid rgba(200,50,50,0.25); border-radius:11px; color:rgba(160,30,30,0.8); font-family:'Cinzel',serif; font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; margin-bottom:8px; }
  .danger-btn:last-child { margin-bottom:0; }
`

function Toggle({ value, onChange }) {
  return (
    <div className="toggle-track"
      style={{ background: value ? "rgba(201,168,76,0.22)" : "#6B1D2E", border:"1.5px solid rgba(201,168,76,0.4)" }}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-thumb" style={{ left:value?23:3, background: GOLD }}/>
    </div>
  )
}

function SecTitle({ children }) {
  return <p style={{ color:"#6B1D2E", fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", margin:"0 0 14px", borderBottom:"1px solid #6B1D2E", paddingBottom:8 }}>{children}</p>
}

function RowLabel({ title, sub }) {
  return (
    <div style={{ flex:1, paddingRight:12 }}>
      <p style={{ color:"#2a1a05", fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:"0.06em", margin:"0 0 3px", fontWeight:700 }}>{title}</p>
      {sub && <p style={{ color:"rgba(80,40,5,0.6)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:0, lineHeight:1.4 }}>{sub}</p>}
    </div>
  )
}

export default function SettingsView({ onClose, settings, onSave }) {
  const initBgImage = (() => { try { return localStorage.getItem('duvaan_bg_image') || settings?.bgImage || null } catch { return null } })()
  const [local, setLocal] = useState({ ...settings, bgImage: initBgImage })
  const [changingPin, setChangingPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinStep, setPinStep] = useState('enter') // enter | confirm
  const [pinConfirm, setPinConfirm] = useState('')
  const [pinMsg, setPinMsg] = useState('')
  const bgRef = useRef(null)
  const set = (key, val) => setLocal(s => ({ ...s, [key]:val }))

  const points = (() => { try { return parseInt(localStorage.getItem('duvaan_frequency')||'0') } catch { return 0 } })()
  const userTier = getUserTier(points)
  const tierOrder = ['member','builder','creator']
  const isUnlocked = (t) => tierOrder.indexOf(userTier) >= tierOrder.indexOf(t)
  const currentTier = FREQ_LEVELS.find(l => l.name.toLowerCase() === userTier) || FREQ_LEVELS[0]

  const compressImage = (file, maxPx, quality, callback) => {
    const img = new Image(); const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const ratio = Math.min(maxPx/img.width, maxPx/img.height, 1)
      canvas.width = Math.round(img.width*ratio); canvas.height = Math.round(img.height*ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      callback(canvas.toDataURL('image/jpeg', quality))
    }; img.src = url
  }

  const handleBgPhoto = e => {
    const file = e.target.files?.[0]; if(!file) return
    const tryStore = (dataUrl) => {
      try { localStorage.setItem('duvaan_bg_image', dataUrl); set("bgImage", dataUrl); return true } catch { return false }
    }
    compressImage(file, 600, 0.6, (d) => { if(!tryStore(d)) compressImage(file, 400, 0.5, (d2) => { if(!tryStore(d2)) alert('Kuva liian suuri.') }) })
  }

  const handleClearBg = () => { try { localStorage.removeItem('duvaan_bg_image') } catch {}; set("bgImage", null) }

  const handleSave = () => {
    const s = { ...local }; delete s.bgImage
    onSave(s); onClose()
  }

  // PIN change logic
  const handlePinDigit = (d) => {
    if (pinStep === 'enter') {
      const next = newPin + d
      setNewPin(next)
      if (next.length === 4) { setPinStep('confirm'); setPinMsg('Syötä uudelleen vahvistukseksi') }
    } else {
      const next = pinConfirm + d
      setPinConfirm(next)
      if (next.length === 4) {
        if (next === newPin) {
          sessionStorage.setItem('duvaan_pin', newPin)
          setPinMsg('✓ PIN vaihdettu')
          setTimeout(() => { setChangingPin(false); setNewPin(''); setPinConfirm(''); setPinStep('enter'); setPinMsg('') }, 1200)
        } else {
          setPinMsg('PIN ei täsmää — yritä uudelleen')
          setPinConfirm(''); setPinStep('enter'); setNewPin('')
        }
      }
    }
  }

  const aura = AURAS.find(a => a.id === local.aura) || AURAS[0]

  return (
    <>
      <style>{css}</style>
      <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", justifyContent:"center", background:"rgba(0,0,0,0.5)" }}>
        <div style={{
          width:"100%", maxWidth:"480px",
          background:"#f5f0e8",
          overflowY:"auto", position:"relative",
        }}>
          {/* Header */}
          <div style={{ position:"sticky", top:0, background:"rgba(245,240,232,0.97)", backdropFilter:"blur(12px)", zIndex:10, padding:"52px 20px 12px", borderBottom:"1px solid rgba(201,168,76,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:700, letterSpacing:"0.1em", margin:0 }}>Asetukset</h2>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(80,50,10,0.4)", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase" }}>Peruuta</button>
              <button onClick={handleSave} style={{ background:BURGUNDY, border:"1px solid rgba(201,168,76,0.4)", borderRadius:9, padding:"7px 16px", color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>Tallenna</button>
            </div>
          </div>

          <div style={{ padding:"16px 16px 80px" }}>
            <style>{`.s-section { --ac: ${aura.color}44; }`}</style>

            {/* ── 1. JÄSENYYS ── */}
            <div className="s-section">
              <SecTitle>Jäsenyys</SecTitle>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <p style={{ color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700, margin:"0 0 2px" }}>{currentTier.icon} {currentTier.name}</p>
                  <p style={{ color:"rgba(80,50,10,0.5)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:0 }}>{currentTier.price}</p>
                </div>
                <span style={{ color:"rgba(80,50,10,0.4)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.14em" }}>AKTIIVINEN</span>
              </div>
              {/* Upgrade buttons */}
              <div style={{ display:'flex', gap:8 }}>
                {FREQ_LEVELS.filter(l => l.name.toLowerCase() !== userTier).map(tier => (
                  <button key={tier.name} onClick={() => {
                    const pts = { Member:0, Builder:1000, Creator:5000 }
                    localStorage.setItem('duvaan_frequency', String(pts[tier.name]))
                    window.location.reload()
                  }} style={{ flex:1, padding:"9px 0", background:"#6B1D2E", border:`1px solid ${tier.color}55`, borderRadius:10, color:tier.color, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
                    {tier.icon} {tier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ── 2. KIELI ── */}
            <div className="s-section">
              <SecTitle>Kieli · Language</SecTitle>
              {(() => {
                const LANGUAGES = [
                  { code:'fi', label:'Suomi' },
                  { code:'en', label:'English' },
                  { code:'sv', label:'Svenska' },
                  { code:'no', label:'Norsk' },
                  { code:'da', label:'Dansk' },
                  { code:'de', label:'Deutsch' },
                  { code:'fr', label:'Français' },
                  { code:'es', label:'Español' },
                  { code:'it', label:'Italiano' },
                  { code:'pt', label:'Português' },
                  { code:'nl', label:'Nederlands' },
                  { code:'pl', label:'Polski' },
                  { code:'ru', label:'Русский' },
                  { code:'ja', label:'日本語' },
                  { code:'zh', label:'中文' },
                  { code:'ko', label:'한국어' },
                  { code:'ar', label:'العربية' },
                ]
                const current = LANGUAGES.find(l => l.code === (local.language || 'fi')) || LANGUAGES[0]
                const [open, setOpen] = [local._langOpen, (v) => set('_langOpen', v)]
                return (
                  <div style={{ position:'relative' }}>
                    <button onClick={() => set('_langOpen', !local._langOpen)}
                      style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.5)', border:'1.5px solid rgba(107,29,46,0.35)', borderRadius: local._langOpen ? '10px 10px 0 0' : 10, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, color:'#6B1D2E', letterSpacing:'0.08em' }}>
                      <span>{current.label}</span>
                      <span style={{ transition:'transform 0.2s', display:'inline-block', transform: local._langOpen ? 'rotate(180deg)' : 'none', fontSize:13 }}>↓</span>
                    </button>
                    {local._langOpen && (
                      <div style={{ border:'1.5px solid rgba(107,29,46,0.35)', borderTop:'none', borderRadius:'0 0 10px 10px', background:'rgba(255,255,255,0.95)', maxHeight:220, overflowY:'auto', position:'relative', zIndex:10 }}>
                        {LANGUAGES.map(lang => (
                          <button key={lang.code} onClick={() => { set('language', lang.code); set('_langOpen', false); localStorage.setItem('duvaan_language', lang.code) }}
                            style={{ width:'100%', padding:'11px 14px', background: lang.code === (local.language||'fi') ? 'rgba(107,29,46,0.08)' : 'transparent', border:'none', borderBottom:'0.5px solid rgba(107,29,46,0.1)', cursor:'pointer', textAlign:'left', fontFamily:"'Cinzel',serif", fontSize:11, fontWeight: lang.code === (local.language||'fi') ? 700 : 500, color: lang.code === (local.language||'fi') ? '#6B1D2E' : '#2a1008', letterSpacing:'0.06em' }}>
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* ── 3. TURVALLISUUS ── */}
            <div className="s-section">
              <SecTitle>Turvallisuus</SecTitle>
              <div className="s-row">
                <RowLabel title="Face ID" sub="Tunnistaudu kasvojentunnistuksella"/>
                <Toggle value={local.allowFaceId||false} onChange={async v => {
                  if(v) { try { await navigator.credentials.get({ publicKey: { challenge: window.crypto.getRandomValues(new Uint8Array(32)), timeout:60000, userVerification:'required', rpId:window.location.hostname }}); set("allowFaceId", true) } catch { set("allowFaceId", false) } }
                  else set("allowFaceId", false)
                }}/>
              </div>
              <div className="s-row">
                <RowLabel title="Touch ID" sub="Tunnistaudu sormenjäljellä"/>
                <Toggle value={local.allowTouchId||false} onChange={v => set("allowTouchId", v)}/>
              </div>
              <div className="s-row" style={{ borderBottom:'none' }}>
                <RowLabel title="Vaihda PIN" sub="4-numeroinen pääsykoodi"/>
                <button onClick={() => setChangingPin(c => !c)} style={{ background:"#6B1D2E", border:"1px solid rgba(201,168,76,0.3)", borderRadius:8, padding:"6px 14px", color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.1em", cursor:"pointer" }}>
                  {changingPin ? 'Peruuta' : 'Vaihda'}
                </button>
              </div>
              {changingPin && (
                <div style={{ paddingTop:12, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  <p style={{ color:"rgba(80,50,10,0.6)", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.12em", margin:0 }}>
                    {pinStep==='enter' ? 'Syötä uusi PIN' : 'Vahvista PIN'}
                  </p>
                  <div style={{ display:'flex', gap:10 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ width:12, height:12, borderRadius:'50%', background: (pinStep==='enter'?newPin:pinConfirm).length > i ? BURGUNDY : '#6B1D2E', border:'1px solid rgba(201,168,76,0.3)', transition:'background 0.15s' }}/>
                    ))}
                  </div>
                  {pinMsg && <p style={{ color: pinMsg.startsWith('✓') ? '#2a7a2a' : '#aa3333', fontFamily:"'Cinzel',serif", fontSize:10, margin:0 }}>{pinMsg}</p>}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, width:200 }}>
                    {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d,i) => (
                      <button key={i} onClick={() => { if(d==='⌫') { if(pinStep==='enter') setNewPin(p=>p.slice(0,-1)); else setPinConfirm(p=>p.slice(0,-1)) } else if(d!=='') handlePinDigit(String(d)) }}
                        style={{ background: d==='' ? 'transparent' : '#6B1D2E', border: d==='' ? 'none' : '1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:"12px 0", color:"#3a2a0a", fontSize: d==='⌫'?16:18, fontFamily:"'Cinzel',serif", fontWeight:600, cursor: d===''?'default':'pointer', pointerEvents: d===''?'none':'auto' }}
                      >{d}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── 4. ULKOASU ── */}
            <div className="s-section">
              <SecTitle>Ulkoasu</SecTitle>
              <div className="s-row" style={{ borderBottom:'none' }}>
                <RowLabel title="Taustakuva" sub={local.bgImage ? "✓ Kuva asetettu" : "Ei taustakuvaa"}/>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {local.bgImage && (
                    <>
                      <div style={{ width:32, height:32, borderRadius:7, overflow:"hidden", border:"1px solid rgba(201,168,76,0.3)" }}>
                        <img src={local.bgImage} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>
                      </div>
                      <button onClick={handleClearBg} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(80,50,10,0.4)", fontSize:18 }}>×</button>
                    </>
                  )}
                  <button onClick={() => bgRef.current?.click()} style={{ background:"none", border:"1px solid rgba(201,168,76,0.3)", borderRadius:8, padding:"6px 12px", color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.12em", cursor:"pointer" }}>
                    {local.bgImage ? "Vaihda" : "Valitse"}
                  </button>
                </div>
                <input ref={bgRef} type="file" accept="image/*" onChange={handleBgPhoto} style={{ display:"none" }}/>
              </div>
            </div>

            {/* ── 5. ELIEL ── */}
            <div className="s-section">
              <SecTitle>Eliel</SecTitle>

              {/* Kommunikointi */}
              <div style={{ marginBottom:14 }}>
                <p style={{ color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:600, letterSpacing:"0.07em", margin:"0 0 8px" }}>Kommunikoinnin oletus</p>
                <div style={{ display:"flex", gap:8 }}>
                  {[['text','✍ Kirjoitus'],['voice','Puhe']].map(([val,label]) => (
                    <button key={val} onClick={() => set("elielMode", val)} style={{ flex:1, padding:"10px 8px", cursor:"pointer", background:local.elielMode===val?"#6B1D2E":"rgba(255,255,255,0.3)", border:local.elielMode===val?`1.5px solid ${BURGUNDY}`:"1px solid rgba(201,168,76,0.2)", borderRadius:10, color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.08em" }}>{label}</button>
                  ))}
                </div>
              </div>

              <div className="s-row">
                <RowLabel title="Mikrofoni" sub="Tarvitaan puheella kommunikointiin"/>
                <Toggle value={local.allowMic||false} onChange={async v => {
                  if(v) { try { await navigator.mediaDevices.getUserMedia({audio:true}); set("allowMic", true) } catch { set("allowMic", false) } }
                  else set("allowMic", false)
                }}/>
              </div>
              <div className="s-row">
                <RowLabel title="Kamera" sub="Profiilikuva ja klubikuvat"/>
                <Toggle value={local.allowCamera||false} onChange={async v => {
                  if(v) { try { await navigator.mediaDevices.getUserMedia({video:true}); set("allowCamera", true) } catch { set("allowCamera", false) } }
                  else set("allowCamera", false)
                }}/>
              </div>
              <div className="s-row">
                <RowLabel title="Elielin muisti" sub="Eliel muistaa aiemmat keskustelusi"/>
                <Toggle value={local.elielMemory!==false} onChange={v => set("elielMemory", v)}/>
              </div>

              {/* Aura — compact grid */}
              <div style={{ marginTop:16 }}>
                <p style={{ color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:600, letterSpacing:"0.07em", margin:"0 0 10px" }}>Aura</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {AURAS.map(a => {
                    const locked = !isUnlocked(a.unlockedAt)
                    const selected = local.aura === a.id
                    return (
                      <button key={a.id} onClick={() => !locked && set("aura", a.id)}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 10px', borderRadius:12, cursor:locked?'default':'pointer', background:selected?'#6B1D2E':'rgba(255,255,255,0.3)', border:selected?`1.5px solid ${a.color}`:'1px solid rgba(201,168,76,0.2)', opacity:locked?0.35:1, minWidth:52 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${a.color}, ${a.color}66)`, boxShadow:selected?`0 0 8px ${a.shadow}`:'none' }}/>
                        <span style={{ color:selected?a.color:"#3a2a0a", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.06em" }}>{a.name}</span>
                        {locked && <span style={{ fontSize:7, color:"rgba(80,50,10,0.4)" }}>🔒</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── 6. ILMOITUKSET ── */}
            <div className="s-section">
              <SecTitle>Ilmoitukset</SecTitle>
              <div className="s-row">
                <RowLabel title="Push-ilmoitukset" sub="Pääkytkin kaikille ilmoituksille"/>
                <Toggle value={local.pushNotifications||false} onChange={v => set("pushNotifications", v)}/>
              </div>
              {local.pushNotifications && NOTIF_ITEMS.map(item => (
                <div key={item.key} className="s-row">
                  <RowLabel title={item.label} sub={item.sub}/>
                  <Toggle value={local[item.key]||false} onChange={v => set(item.key, v)}/>
                </div>
              ))}
            </div>

            {/* ── 7. YKSITYISYYS ── */}
            <div className="s-section">
              <SecTitle>Yksityisyys</SecTitle>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button className="danger-btn" onClick={() => { if(window.confirm("Tyhjentääkö Elielin muistin?")) set("elielMemoryCleared", true) }}>
                  Tyhjennä Elielin muisti
                </button>
                <button className="danger-btn" onClick={() => { if(window.confirm("Poistetaanko kaikki data?")) { localStorage.clear(); window.location.reload() } }}>
                  Poista kaikki data
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}