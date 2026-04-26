import { useState, useRef, useEffect } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

// ── TOOL DEFINITIONS ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "gym",
    icon: "🏋️",
    name: "Gym",
    tagline: "Oma salisi taskina",
    desc: "Rakenna treeniohjelma, seuraa sarjat ja painot, yhdistä Apple Health.",
    color: "#C9A84C",
  },
  {
    id: "notes",
    icon: "📋",
    name: "Notes",
    tagline: "Muistiinpanot, taskit, projektit",
    desc: "Quick Notes, Daily Tasks ja jaettavat projektit. Lisää taskeja Eliel-aloitusnäytölle.",
    color: "#6EFFA0",
  },
  {
    id: "alarm",
    icon: "🔔",
    name: "Alarm",
    tagline: "Duvaan-soundit & muistutukset",
    desc: "Herätyskellot ja muistutukset Duvaan-soundeilla. Yhdistä Google tai Apple Kalenteriin.",
    color: "#FF8C00",
  },
  {
    id: "calendar",
    icon: "📅",
    name: "Calendar",
    tagline: "Google & Apple Kalenteri",
    desc: "Yhdistä olemassa olevat kalenterisi. Tulevat eventit näkyvät feedissä.",
    color: "#55CCFF",
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  @keyframes toolboxIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toolIn     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toolExpand { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes chestLidOpen {
    from { transform: perspective(400px) rotateX(0deg);   }
    to   { transform: perspective(400px) rotateX(-115deg); }
  }
  @keyframes chestLidClose {
    from { transform: perspective(400px) rotateX(-115deg); }
    to   { transform: perspective(400px) rotateX(0deg);   }
  }

  .tool-row {
    display:flex; align-items:center; gap:14px;
    padding:14px 0;
    border-bottom:0.5px solid rgba(201,168,76,0.08);
    cursor:pointer; transition:background 0.2s;
    animation: toolIn 0.3s ease both;
  }
  .tool-row:last-child { border-bottom:none; }
  .tool-detail { animation: toolExpand 0.25s ease both; }
  .add-btn {
    background:none; border:1px solid rgba(201,168,76,0.3); border-radius:8px;
    padding:6px 14px; cursor:pointer; color:rgba(201,168,76,0.7);
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.14em;
    text-transform:uppercase; transition:all 0.2s;
  }
  .add-btn.added {
    border-color:rgba(110,255,160,0.5); color:#6effa0;
  }
`;

// ── CHEST ICON SVG ────────────────────────────────────────────────────────────
function ChestIcon({ isOpen, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {/* Body */}
      <rect x="4" y="20" width="36" height="20" rx="3" fill={BURGUNDY} stroke={GOLD} strokeWidth="1.5"/>
      {/* Latch */}
      <rect x="18" y="26" width="8" height="6" rx="2" fill={GOLD} opacity="0.8"/>
      {/* Hinges */}
      <rect x="6"  y="19" width="4" height="3" rx="1" fill={GOLD} opacity="0.6"/>
      <rect x="34" y="19" width="4" height="3" rx="1" fill={GOLD} opacity="0.6"/>
      {/* Lid — animates */}
      <g style={{
        transformOrigin: "22px 21px",
        animation: isOpen ? 'chestLidOpen 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'chestLidClose 0.3s ease forwards',
      }}>
        <rect x="4" y="8" width="36" height="13" rx="3" fill={BURGUNDY} stroke={GOLD} strokeWidth="1.5"/>
        {/* Lid detail line */}
        <line x1="4" y1="14" x2="40" y2="14" stroke={GOLD} strokeWidth="0.5" opacity="0.4"/>
      </g>
    </svg>
  );
}

// ── NOTES TOOL ───────────────────────────────────────────────────────────────
function NotesTool({ onAddToHome, homeNotes, setHomeNotes }) {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('duvaan_notes') || '[]') } catch { return [] }
  });
  const [view, setView] = useState('list'); // list | new | edit
  const [form, setForm] = useState({ title:'', content:'', type:'quick', pinToHome:false });
  const [editId, setEditId] = useState(null);

  const save = () => {
    if (!form.title.trim() && !form.content.trim()) return;
    const note = { id: editId || Date.now(), ...form, createdAt: new Date().toISOString() };
    const updated = editId ? notes.map(n => n.id===editId ? note : n) : [...notes, note];
    setNotes(updated);
    localStorage.setItem('duvaan_notes', JSON.stringify(updated));
    if (form.pinToHome && !editId) onAddToHome?.(note);
    setView('list'); setForm({ title:'', content:'', type:'quick', pinToHome:false }); setEditId(null);
  };

  const del = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('duvaan_notes', JSON.stringify(updated));
  };

  const TYPE_COLORS = { quick: GOLD, task: '#6EFFA0', project: '#55CCFF' };
  const TYPE_LABELS = { quick: 'Quick Note', task: 'Daily Task', project: 'Projekti' };

  if (view === 'new' || view === 'edit') return (
    <div style={{ animation:'toolExpand 0.25s ease both' }}>
      <button onClick={() => { setView('list'); setEditId(null); setForm({ title:'', content:'', type:'quick', pinToHome:false }); }}
        style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', marginBottom:16, padding:0 }}>← Takaisin</button>

      {/* Type selector */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {['quick','task','project'].map(t => (
          <button key={t} onClick={() => setForm(f=>({...f,type:t}))} style={{ flex:1, padding:'8px 4px', background:form.type===t?`${TYPE_COLORS[t]}18`:'rgba(255,255,255,0.02)', border:`1px solid ${form.type===t?TYPE_COLORS[t]:'rgba(201,168,76,0.15)'}`, borderRadius:9, cursor:'pointer', color:form.type===t?TYPE_COLORS[t]:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em', transition:'all 0.2s' }}>
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Otsikko..."
        style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'10px 14px', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, outline:'none', marginBottom:10 }}/>

      <textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="Kirjoita..."
        rows={5} style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'10px 14px', color:'rgba(201,168,76,0.8)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:'none', resize:'none', marginBottom:10 }}/>

      {/* Pin to home */}
      <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:16 }}>
        <div onClick={() => setForm(f=>({...f,pinToHome:!f.pinToHome}))}
          style={{ width:36, height:20, borderRadius:10, background:form.pinToHome?'rgba(201,168,76,0.25)':'rgba(255,255,255,0.05)', border:`1px solid ${form.pinToHome?GOLD:'rgba(201,168,76,0.2)'}`, position:'relative', transition:'all 0.2s', flexShrink:0 }}>
          <div style={{ width:14, height:14, borderRadius:'50%', background:form.pinToHome?GOLD:'rgba(201,168,76,0.3)', position:'absolute', top:2, left:form.pinToHome?19:3, transition:'left 0.2s' }}/>
        </div>
        <span style={{ color:'rgba(201,168,76,0.6)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.1em' }}>Lisää Eliel-aloitusnäytölle</span>
      </label>

      <button onClick={save} style={{ width:'100%', padding:'12px', background:BURGUNDY, border:`1.5px solid ${GOLD}88`, borderRadius:12, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>
        {editId ? 'Päivitä' : 'Tallenna'}
      </button>
    </div>
  );

  return (
    <div>
      <button onClick={() => setView('new')} style={{ width:'100%', padding:'11px', marginBottom:16, background:'rgba(107,29,46,0.2)', border:`1px solid ${GOLD}55`, borderRadius:12, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>
        + Uusi muistiinpano
      </button>

      {notes.length === 0 ? (
        <p style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:20 }}>Ei muistiinpanoja vielä.</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {notes.map(note => (
            <div key={note.id} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${TYPE_COLORS[note.type]||GOLD}33`, borderRadius:12, padding:'12px 14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:TYPE_COLORS[note.type]||GOLD, display:'inline-block', flexShrink:0 }}/>
                  <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, letterSpacing:'0.06em' }}>{note.title || '—'}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => { setEditId(note.id); setForm({title:note.title,content:note.content,type:note.type,pinToHome:note.pinToHome}); setView('edit'); }}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.35)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em' }}>Muokkaa</button>
                  <button onClick={() => del(note.id)}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,80,80,0.35)', fontSize:14, lineHeight:1 }}>×</button>
                </div>
              </div>
              {note.content && <p style={{ color:'rgba(201,168,76,0.6)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', margin:'0 0 6px', lineHeight:1.5, whiteSpace:'pre-wrap' }}>{note.content.slice(0,120)}{note.content.length>120?'…':''}</p>}
              <span style={{ color:`${TYPE_COLORS[note.type]}88`||'rgba(201,168,76,0.35)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase' }}>{TYPE_LABELS[note.type]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ALARM TOOL ───────────────────────────────────────────────────────────────
function AlarmTool() {
  const SOUNDS = [
    { id:'dawn',    name:'Duvaan Dawn',    desc:'Pehmeä aamuvaloherätys' },
    { id:'pulse',   name:'Golden Pulse',   desc:'Kultainen rytminen pulssi' },
    { id:'eliel',   name:'Eliel Whisper',  desc:'Eliel kuiskailee herätyksen' },
    { id:'deep',    name:'Deep Resonance', desc:'Syvä värähtely' },
  ];
  const [alarms, setAlarms] = useState(() => { try { return JSON.parse(localStorage.getItem('duvaan_alarms')||'[]') } catch { return [] } });
  const [form, setForm] = useState({ time:'07:00', sound:'dawn', label:'', repeat:false });
  const [adding, setAdding] = useState(false);

  const saveAlarm = () => {
    if (!form.time) return;
    const a = { id:Date.now(), ...form };
    const updated = [...alarms, a];
    setAlarms(updated);
    localStorage.setItem('duvaan_alarms', JSON.stringify(updated));
    setAdding(false);
    setForm({ time:'07:00', sound:'dawn', label:'', repeat:false });
  };

  return (
    <div>
      <button onClick={() => setAdding(!adding)} style={{ width:'100%', padding:'11px', marginBottom:14, background:'rgba(107,29,46,0.2)', border:`1px solid rgba(255,140,0,0.4)`, borderRadius:12, color:'#FF8C00', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>
        + Uusi herätys
      </button>

      {adding && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,140,0,0.2)', borderRadius:12, padding:'14px', marginBottom:14, animation:'toolExpand 0.25s ease both' }}>
          <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,140,0,0.3)', borderRadius:10, padding:'10px 14px', color:'#FF8C00', fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:700, outline:'none', marginBottom:10, textAlign:'center', colorScheme:'dark' }}/>

          <input value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="Muistutus (valinnainen)"
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,140,0,0.2)', borderRadius:10, padding:'9px 14px', color:'rgba(255,140,0,0.8)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:'none', marginBottom:12 }}/>

          <p style={{ color:'rgba(255,140,0,0.5)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', margin:'0 0 8px' }}>Duvaan Sound</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
            {SOUNDS.map(s => (
              <button key={s.id} onClick={() => setForm(f=>({...f,sound:s.id}))} style={{ display:'flex', alignItems:'center', gap:10, background:form.sound===s.id?'rgba(255,140,0,0.1)':'rgba(255,255,255,0.02)', border:`1px solid ${form.sound===s.id?'rgba(255,140,0,0.5)':'rgba(255,140,0,0.15)'}`, borderRadius:9, padding:'8px 12px', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
                <span style={{ color:form.sound===s.id?'#FF8C00':'rgba(255,140,0,0.4)', fontSize:12 }}>♪</span>
                <div>
                  <p style={{ color:form.sound===s.id?'#FF8C00':'rgba(255,140,0,0.6)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.08em', margin:'0 0 1px' }}>{s.name}</p>
                  <p style={{ color:'rgba(255,140,0,0.35)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button onClick={saveAlarm} style={{ width:'100%', padding:'11px', background:'rgba(255,140,0,0.15)', border:'1px solid rgba(255,140,0,0.5)', borderRadius:11, color:'#FF8C00', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>Tallenna herätys</button>
        </div>
      )}

      {alarms.length === 0 ? (
        <p style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:8 }}>Ei herätyksiä.</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {alarms.map(a => (
            <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,140,0,0.2)', borderRadius:11, padding:'12px 14px' }}>
              <div>
                <p style={{ color:'#FF8C00', fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:700, margin:'0 0 2px' }}>{a.time}</p>
                <p style={{ color:'rgba(255,140,0,0.5)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>{a.label || a.sound}</p>
              </div>
              <button onClick={() => { const u=alarms.filter(x=>x.id!==a.id); setAlarms(u); localStorage.setItem('duvaan_alarms',JSON.stringify(u)); }}
                style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,80,80,0.4)', fontSize:18, lineHeight:1 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CALENDAR TOOL ─────────────────────────────────────────────────────────────
function CalendarTool() {
  return (
    <div>
      <p style={{ color:'rgba(201,168,76,0.5)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', margin:'0 0 20px', lineHeight:1.6 }}>
        Yhdistä olemassa oleva kalenterisi. Tulevat tapahtumat näkyvät feedissä.
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {[
          { name:'Apple Kalenteri', icon:'🍎', color:'#55CCFF', url:'webcal://calendar.apple.com' },
          { name:'Google Kalenteri', icon:'📅', color:'#6EFFA0', url:'https://calendar.google.com' },
        ].map(cal => (
          <button key={cal.name} onClick={() => window.open(cal.url, '_blank')} style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,0.02)', border:`1px solid ${cal.color}33`, borderRadius:12, padding:'14px 16px', cursor:'pointer', textAlign:'left' }}>
            <span style={{ fontSize:24 }}>{cal.icon}</span>
            <div>
              <p style={{ color:cal.color, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, letterSpacing:'0.06em', margin:'0 0 2px' }}>{cal.name}</p>
              <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>Avaa yhdistämistä varten</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TOOLBOX VIEW ─────────────────────────────────────────────────────────────
export default function ToolboxView({ onClose, onAddTool, activeTools, onAddHomeNote }) {
  const [openTool, setOpenTool] = useState(null);
  const [homeNotes, setHomeNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('duvaan_home_notes')||'[]') } catch { return [] }
  });

  const addHomeNote = (note) => {
    const updated = [...homeNotes, note].slice(-3); // max 3
    setHomeNotes(updated);
    localStorage.setItem('duvaan_home_notes', JSON.stringify(updated));
    onAddHomeNote?.(updated);
  };

  const tool = TOOLS.find(t => t.id === openTool);

  return (
    <>
      <style>{css}</style>
      <div style={{ position:'fixed', inset:0, zIndex:500, background:'#0d0406', overflowY:'auto', display:'flex', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:480 }}>

          {/* Header */}
          <div style={{ position:'sticky', top:0, background:'rgba(13,4,6,0.97)', backdropFilter:'blur(12px)', zIndex:10, padding:'62px 20px 12px', borderBottom:'0.5px solid rgba(201,168,76,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {openTool ? (
              <button onClick={() => setOpenTool(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', padding:0 }}>← Takaisin</button>
            ) : (
              <h2 style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:700, letterSpacing:'0.1em', margin:0 }}>Toolbox</h2>
            )}
            {openTool && <h2 style={{ color:tool?.color||GOLD, fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:700, letterSpacing:'0.1em', margin:0 }}>{tool?.icon} {tool?.name}</h2>}
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.35)', fontSize:22, lineHeight:1 }}>×</button>
          </div>

          <div style={{ padding:'20px 20px 80px', animation:'toolboxIn 0.35s ease both' }}>

            {/* Tool list */}
            {!openTool && TOOLS.map((t, i) => (
              <div key={t.id} className="tool-row" style={{ animationDelay:`${i*0.06}s` }} onClick={() => setOpenTool(t.id)}>
                <span style={{ fontSize:28, flexShrink:0 }}>{t.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ color:t.color, fontFamily:"'Cinzel',serif", fontSize:14, fontWeight:700, letterSpacing:'0.06em' }}>{t.name}</span>
                    {activeTools?.includes(t.id) && <span style={{ color:'#6effa0', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em' }}>✓ Lisätty</span>}
                  </div>
                  <p style={{ color:'rgba(201,168,76,0.5)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', margin:0 }}>{t.tagline}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button
                    className={`add-btn ${activeTools?.includes(t.id) ? 'added' : ''}`}
                    onClick={e => { e.stopPropagation(); onAddTool?.(t.id); }}
                  >
                    {activeTools?.includes(t.id) ? '✓' : '+'}
                  </button>
                  <span style={{ color:'rgba(201,168,76,0.3)', fontSize:16 }}>›</span>
                </div>
              </div>
            ))}

            {/* Open tool content */}
            {openTool && (
              <div className="tool-detail">
                {/* Description */}
                <p style={{ color:'rgba(201,168,76,0.5)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', margin:'0 0 20px', lineHeight:1.6 }}>
                  {tool?.desc}
                </p>

                {openTool === 'gym' && (
                  <div>
                    <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', margin:'0 0 16px' }}>
                      Gym-työkalu löytyy Personal → Training-välilehdeltä. Voit rakentaa ohjelman itse tai Elielin kanssa.
                    </p>
                    {[
                      { icon:'🍎', name:'Apple Health', desc:'Yhdistä terveysdata' },
                      { icon:'⚡', name:'Coti App', desc:'Tulossa pian' },
                    ].map(item => (
                      <div key={item.name} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
                        <span style={{ fontSize:22 }}>{item.icon}</span>
                        <div>
                          <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, margin:'0 0 2px' }}>{item.name}</p>
                          <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {openTool === 'notes' && <NotesTool onAddToHome={addHomeNote} homeNotes={homeNotes} setHomeNotes={setHomeNotes} />}
                {openTool === 'alarm' && <AlarmTool />}
                {openTool === 'calendar' && <CalendarTool />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── CHEST BUTTON ─────────────────────────────────────────────────────────────
export function ChestButton({ onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        background:'none', border:'none', cursor:'pointer', padding:0,
        display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        opacity: hover ? 1 : 0.7, transition:'opacity 0.2s, transform 0.2s',
        transform: hover ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      <ChestIcon isOpen={hover} size={44} />
      <span style={{ color:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase' }}>Toolbox</span>
    </button>
  );
}