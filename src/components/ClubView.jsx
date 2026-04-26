import { useState, useRef, useEffect } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

export const TIER_LIMITS = {
  member:        { maxClubs:1,  maxMembers:10,   canPublic:false },
  builder:       { maxClubs:3,  maxMembers:50,   canPublic:true  },
  masterbuilder: { maxClubs:10, maxMembers:1500, canPublic:true  },
};

const ALL_TAGS = ['Sports','Gastronomy','Philosophy','Business','Music','Wellness','Art','Technology','Finance','Travel','Mindfulness','Nutrition','Running','Film','Fashion'];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes msgIn  { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

  .club-tab {
    background:none; border:none; cursor:pointer; flex:1; text-align:center;
    padding:8px 0; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:0.14em; text-transform:uppercase;
    color:rgba(201,168,76,0.45); border-bottom:1px solid transparent;
    transition:all 0.25s;
  }
  .club-tab.active { color:#C9A84C; border-bottom:1px solid #C9A84C; }
  .club-chat-input {
    flex:1; background:transparent; border:none; outline:none;
    color:#C9A84C; font-family:'Cormorant Garamond',serif;
    font-size:14px; letter-spacing:0.04em;
  }
  .club-chat-input::placeholder { color:rgba(201,168,76,0.3); font-style:italic; }
  .member-row {
    display:flex; align-items:center; gap:12px; padding:10px 0;
    border-bottom:0.5px solid rgba(201,168,76,0.07);
  }
  .member-row:last-child { border-bottom:none; }
  .perm-toggle {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 0; border-bottom:0.5px solid rgba(201,168,76,0.07);
  }
  .perm-toggle:last-child { border-bottom:none; }
`;

function Avatar({ name, photo, size=36, color=GOLD }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${BURGUNDY},${color})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', border:`1px solid ${color}44` }}>
      {photo
        ? <img src={photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
        : <span style={{ color:'#fff', fontFamily:"'Cinzel',serif", fontSize:size*0.4, fontWeight:700 }}>{name?.[0]?.toUpperCase()||'?'}</span>
      }
    </div>
  );
}

function Toggle({ value, onChange, color=GOLD }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:38, height:20, borderRadius:10, background:value?`${color}22`:'rgba(255,255,255,0.05)', border:`1px solid ${value?color:'rgba(201,168,76,0.2)'}`, position:'relative', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
      <div style={{ width:14, height:14, borderRadius:'50%', background:value?color:'rgba(201,168,76,0.25)', position:'absolute', top:2, left:value?21:3, transition:'left 0.2s, background 0.2s' }}/>
    </div>
  );
}

// ── QR CODE (simple SVG grid) ─────────────────────────────────────────────────
function QRCode({ value, size=140 }) {
  // Simple deterministic QR-like pattern from string hash
  const hash = value.split('').reduce((a,c) => ((a<<5)-a)+c.charCodeAt(0), 0);
  const cells = 11;
  const cell = size / cells;
  const grid = Array.from({length:cells}, (_,r) =>
    Array.from({length:cells}, (_,c) => {
      // Finder patterns
      if ((r<3&&c<3)||(r<3&&c>cells-4)||(r>cells-4&&c<3)) return true;
      // Data from hash
      return ((hash >> ((r*cells+c)%31)) & 1) === 1;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background:'#fff', borderRadius:8, padding:4 }}>
      {grid.map((row,r) => row.map((on,c) => on ? (
        <rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#080808" />
      ) : null))}
    </svg>
  );
}

// ── UNIFIED FEED + CHAT ───────────────────────────────────────────────────────
function ClubFeed({ club, canChat }) {
  const [msgs, setMsgs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`club_feed_${club.id}`)||'[]') } catch { return [] }
  });
  const [text, setText] = useState('');
  const [dmMember, setDmMember] = useState(null); // for DM from members tab
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs]);

  const send = (content, type='text', imageData=null) => {
    if (!content.trim() && !imageData) return;
    const m = {
      id: Date.now(),
      author: 'Julius',
      text: content.trim(),
      image: imageData,
      type,
      time: new Date().toLocaleTimeString('fi-FI',{hour:'2-digit',minute:'2-digit'}),
    };
    const updated = [...msgs, m];
    setMsgs(updated);
    localStorage.setItem(`club_feed_${club.id}`, JSON.stringify(updated));
    setText('');
  };

  const handleImage = e => {
    const file = e.target.files?.[0]; if(!file) return;
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const max=800; const ratio=Math.min(max/img.width,max/img.height,1);
      canvas.width=Math.round(img.width*ratio); canvas.height=Math.round(img.height*ratio);
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      send('', 'image', canvas.toDataURL('image/jpeg',0.75));
    };
    img.src=url;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 240px)' }}>
      {/* Message stream */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
        {msgs.length === 0 && (
          <p style={{ color:'rgba(201,168,76,0.25)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:32 }}>
            Aloita keskustelu klubisi kanssa.
          </p>
        )}
        {msgs.map((m,i) => (
          <div key={m.id} style={{ marginBottom:12, animation:'msgIn 0.25s ease both', animationDelay:`${Math.min(i*0.03,0.3)}s` }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
              <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:600, letterSpacing:'0.06em' }}>{m.author}</span>
              <span style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:11 }}>{m.time}</span>
            </div>
            {m.image && (
              <img src={m.image} alt="" style={{ maxWidth:'100%', borderRadius:10, marginBottom:m.text?6:0, display:'block' }}/>
            )}
            {m.text && (
              <p style={{ color:'rgba(255,255,255,0.75)', fontFamily:"'Cormorant Garamond',serif", fontSize:15, margin:0, lineHeight:1.6 }}>{m.text}</p>
            )}
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      {canChat ? (
        <div style={{ borderTop:'0.5px solid rgba(201,168,76,0.1)', paddingTop:10, display:'flex', gap:10, alignItems:'flex-end' }}>
          <button onClick={() => fileRef.current?.click()} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.35)', fontSize:18, lineHeight:1, flexShrink:0, paddingBottom:6 }}>📎</button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }}/>
          <textarea
            value={text} onChange={e=>setText(e.target.value)} placeholder="Kirjoita viesti..."
            rows={1}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(text);}}}
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'rgba(201,168,76,0.8)', fontFamily:"'Cormorant Garamond',serif", fontSize:15, resize:'none', lineHeight:1.5 }}
          />
          <button onClick={() => send(text)} style={{ width:30, height:30, background:BURGUNDY, border:'none', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="11" height="11" viewBox="0 0 14 14"><path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill={GOLD}/></svg>
          </button>
        </div>
      ) : (
        <p style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', textAlign:'center', padding:'10px 0', borderTop:'0.5px solid rgba(201,168,76,0.08)' }}>
          Ei chat-oikeuksia
        </p>
      )}
    </div>
  );
}

// ── DM VIEW ───────────────────────────────────────────────────────────────────
function DMView({ member, clubId, onBack }) {
  const [msgs, setMsgs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`dm_${clubId}_${member.id}`)||'[]') } catch { return [] }
  });
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    const m = { id:Date.now(), author:'Julius', text:text.trim(), time:new Date().toLocaleTimeString('fi-FI',{hour:'2-digit',minute:'2-digit'}) };
    const updated = [...msgs, m];
    setMsgs(updated);
    localStorage.setItem(`dm_${clubId}_${member.id}`, JSON.stringify(updated));
    setText('');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 200px)', animation:'fadeUp 0.25s ease both' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:12, borderBottom:'0.5px solid rgba(201,168,76,0.1)', marginBottom:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', padding:0 }}>←</button>
        <Avatar name={member.name} size={32}/>
        <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:600 }}>{member.name}</span>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {msgs.length===0 && <p style={{ color:'rgba(201,168,76,0.25)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:24 }}>Aloita keskustelu.</p>}
        {msgs.map(m => (
          <div key={m.id} style={{ marginBottom:10, textAlign:m.author==='Julius'?'right':'left' }}>
            <span style={{ display:'inline-block', background:m.author==='Julius'?BURGUNDY:'rgba(255,255,255,0.04)', border:`1px solid ${m.author==='Julius'?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.12)'}`, borderRadius:12, padding:'7px 12px', color:'rgba(255,255,255,0.8)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, maxWidth:'80%', lineHeight:1.5 }}>{m.text}</span>
            <p style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:10, margin:'3px 0 0' }}>{m.time}</p>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div style={{ borderTop:'0.5px solid rgba(201,168,76,0.1)', paddingTop:10, display:'flex', gap:10, alignItems:'center' }}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Viesti..." onKeyDown={e=>{if(e.key==='Enter')send();}}
          style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'rgba(201,168,76,0.8)', fontFamily:"'Cormorant Garamond',serif", fontSize:15 }}/>
        <button onClick={send} style={{ width:30, height:30, background:BURGUNDY, border:'none', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="11" height="11" viewBox="0 0 14 14"><path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill={GOLD}/></svg>
        </button>
      </div>
    </div>
  );
}

// ── CLUB EVENTS ───────────────────────────────────────────────────────────────
function ClubEvents({ club, canCreate }) {
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`club_events_${club.id}`)||'[]') } catch { return [] }
  });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name:'', date:'', time:'', location:'', desc:'', free:true, price:'' });

  const save = () => {
    if (!form.name.trim() || !form.date) return;
    const ev = { id:Date.now(), ...form, attending:[], host:'Julius' };
    const updated = [...events, ev];
    setEvents(updated);
    localStorage.setItem(`club_events_${club.id}`, JSON.stringify(updated));
    setCreating(false);
    setForm({ name:'', date:'', time:'', location:'', desc:'', free:true, price:'' });
  };

  const attend = (id) => {
    const updated = events.map(e => e.id===id
      ? { ...e, attending: e.attending.includes('Julius') ? e.attending.filter(a=>a!=='Julius') : [...e.attending,'Julius'] }
      : e
    );
    setEvents(updated);
    localStorage.setItem(`club_events_${club.id}`, JSON.stringify(updated));
  };

  if (creating) return (
    <div style={{ padding:'16px 0', animation:'fadeUp 0.3s ease both' }}>
      <button onClick={() => setCreating(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', marginBottom:16, padding:0 }}>← Takaisin</button>
      {[['Nimi','name','Tapahtuman nimi'],['Sijainti','location','Missä?'],['Kuvaus','desc','Mistä on kyse...']].map(([label,field,ph]) => (
        <div key={field} style={{ marginBottom:12 }}>
          <p style={{ color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 6px' }}>{label}</p>
          <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:9, padding:'9px 12px', color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:'none' }}/>
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <div style={{ flex:1 }}>
          <p style={{ color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 6px' }}>Päivämäärä</p>
          <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:9, padding:'9px 12px', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, outline:'none', colorScheme:'dark' }}/>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 6px' }}>Kellonaika</p>
          <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:9, padding:'9px 12px', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, outline:'none', colorScheme:'dark' }}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[[true,'Ilmainen'],[false,'Maksullinen']].map(([val,label]) => (
          <button key={String(val)} onClick={() => setForm(f=>({...f,free:val}))} style={{ flex:1, padding:'9px', background:form.free===val?'rgba(201,168,76,0.1)':'rgba(255,255,255,0.02)', border:`1px solid ${form.free===val?GOLD:'rgba(201,168,76,0.2)'}`, borderRadius:9, cursor:'pointer', color:form.free===val?GOLD:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.1em' }}>{label}</button>
        ))}
      </div>
      <button onClick={save} style={{ width:'100%', padding:'12px', background:BURGUNDY, border:`1px solid ${GOLD}88`, borderRadius:11, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>Luo tapahtuma</button>
    </div>
  );

  return (
    <div style={{ padding:'16px 0' }}>
      {canCreate && (
        <button onClick={() => setCreating(true)} style={{ width:'100%', padding:'11px', marginBottom:16, background:'rgba(107,29,46,0.2)', border:`1px solid ${GOLD}55`, borderRadius:11, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>+ Luo tapahtuma</button>
      )}
      {events.length === 0
        ? <p style={{ color:'rgba(201,168,76,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:16 }}>Ei tapahtumia.</p>
        : events.map(ev => {
          const going = ev.attending.includes('Julius');
          return (
            <div key={ev.id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:600 }}>{ev.name}</span>
                <span style={{ color:ev.free?'#6effa0':GOLD, fontFamily:"'Cinzel',serif", fontSize:11 }}>{ev.free?'Ilmainen':ev.price}</span>
              </div>
              {ev.desc && <p style={{ color:'rgba(201,168,76,0.6)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', margin:'0 0 8px' }}>{ev.desc}</p>}
              <p style={{ color:'rgba(201,168,76,0.7)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, margin:'0 0 10px' }}>📅 {ev.date}{ev.time?` · ${ev.time}`:''}{ev.location?` · ${ev.location}`:''}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cinzel',serif", fontSize:9 }}>{ev.attending.length} ilmoittautunut</span>
                <button onClick={() => attend(ev.id)} style={{ background:going?'rgba(110,255,160,0.1)':'rgba(107,29,46,0.3)', border:`1px solid ${going?'rgba(110,255,160,0.4)':'rgba(201,168,76,0.3)'}`, borderRadius:20, padding:'6px 16px', cursor:'pointer', color:going?'#6effa0':GOLD, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  {going ? '✓ Ilmoittautunut' : 'Ilmoittaudu'}
                </button>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

// ── CLUB MEMBERS ──────────────────────────────────────────────────────────────
function ClubMembers({ club, isAdmin, onUpdateClub }) {
  const [editingMember, setEditingMember] = useState(null);
  const [dmMember, setDmMember] = useState(null);
  const members = club.members || [{ id:'julius', name:'Julius', role:'admin', perms:{ invite:true, events:true, chat:true, settings:true } }];

  const ROLE_COLORS = { admin:'#C9A84C', moderator:'#55CCFF', member:'rgba(201,168,76,0.45)' };
  const ROLE_LABELS = { admin:'Admin', moderator:'Moderaattori', member:'Jäsen' };
  const PERMS = [
    { key:'invite',   label:'Kutsu jäseniä' },
    { key:'events',   label:'Luo tapahtumia' },
    { key:'chat',     label:'Chatti' },
    { key:'settings', label:'Muokkaa asetuksia' },
  ];

  const updatePerm = (memberId, perm, val) => {
    const updated = members.map(m => m.id===memberId ? { ...m, perms:{...m.perms,[perm]:val} } : m);
    onUpdateClub({ ...club, members:updated });
  };
  const promoteToMod = (memberId) => {
    onUpdateClub({ ...club, members: members.map(m => m.id===memberId ? { ...m, role:'moderator' } : m) });
  };
  const demote = (memberId) => {
    onUpdateClub({ ...club, members: members.map(m => m.id===memberId ? { ...m, role:'member', perms:{invite:false,events:false,chat:false,settings:false} } : m) });
  };
  const remove = (memberId) => {
    onUpdateClub({ ...club, members: members.filter(m => m.id!==memberId) });
  };

  if (dmMember) return <DMView member={dmMember} clubId={club.id} onBack={() => setDmMember(null)} />;

  return (
    <div style={{ padding:'16px 0' }}>
      <span style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase' }}>{members.length} jäsentä</span>
      {members.map(m => (
        <div key={m.id}>
          <div className="member-row">
            <Avatar name={m.name} size={38} />
            <div style={{ flex:1 }}>
              <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:600, margin:'0 0 2px' }}>{m.name}</p>
              <span style={{ color:ROLE_COLORS[m.role], fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em' }}>{ROLE_LABELS[m.role]}</span>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {m.role !== 'admin' && (
                <button onClick={() => setDmMember(m)}
                  style={{ background:'none', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'4px 10px', cursor:'pointer', color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em' }}>
                  DM
                </button>
              )}
              {isAdmin && m.role !== 'admin' && (
                <button onClick={() => setEditingMember(editingMember===m.id ? null : m.id)}
                  style={{ background:'none', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'4px 10px', cursor:'pointer', color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em' }}>
                  {editingMember===m.id ? '↑' : '···'}
                </button>
              )}
            </div>
          </div>
          {isAdmin && editingMember===m.id && m.role!=='admin' && (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:10, padding:'12px 14px', marginBottom:8, animation:'fadeUp 0.2s ease both' }}>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                {['member','moderator'].map(r => (
                  <button key={r} onClick={() => r==='moderator' ? promoteToMod(m.id) : demote(m.id)} style={{ flex:1, padding:'7px', background:m.role===r?'rgba(201,168,76,0.1)':'rgba(255,255,255,0.02)', border:`1px solid ${m.role===r?GOLD:'rgba(201,168,76,0.2)'}`, borderRadius:8, cursor:'pointer', color:m.role===r?GOLD:'rgba(201,168,76,0.4)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em' }}>
                    {r==='moderator'?'Moderaattori':'Jäsen'}
                  </button>
                ))}
              </div>
              {m.role === 'moderator' && (
                <div style={{ marginBottom:10 }}>
                  <p style={{ color:'rgba(201,168,76,0.35)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', margin:'0 0 8px' }}>Oikeudet</p>
                  {PERMS.map(perm => (
                    <div key={perm.key} className="perm-toggle">
                      <span style={{ color:'rgba(201,168,76,0.7)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.06em' }}>{perm.label}</span>
                      <Toggle value={m.perms?.[perm.key]||false} onChange={v => updatePerm(m.id, perm.key, v)} />
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => { remove(m.id); setEditingMember(null); }} style={{ width:'100%', padding:'8px', background:'rgba(255,50,50,0.05)', border:'1px solid rgba(255,60,60,0.2)', borderRadius:8, cursor:'pointer', color:'rgba(255,90,90,0.6)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                Poista klubista
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── CLUB SETTINGS (admin only) ────────────────────────────────────────────────
function ClubSettings({ club, onUpdateClub, onDeleteClub, onNavigateToFeed }) {
  const [form, setForm] = useState({ name:club.name, desc:club.desc||'', location:club.location||'', isPublic:club.isPublic||false, tags:club.tags||[] });
  const [showQR, setShowQR] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const photoRef = useRef(null);

  const inviteLink = `https://duvaan.app/join/${club.id}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(inviteLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const shareLink = () => {
    navigator.share?.({ title:`Liity ${club.name} -klubiin`, url:inviteLink }).catch(()=>{});
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const max = 400; const ratio = Math.min(max/img.width, max/img.height, 1);
      canvas.width = Math.round(img.width*ratio); canvas.height = Math.round(img.height*ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      onUpdateClub({ ...club, photo: canvas.toDataURL('image/jpeg', 0.75) });
    };
    img.src = url;
  };

  const [saved, setSaved] = useState(false);
  const save = () => {
    onUpdateClub({ ...club, name:form.name, desc:form.desc, location:form.location, isPublic:form.isPublic, tags:form.tags });
    setSaved(true);
    setTimeout(() => { setSaved(false); onNavigateToFeed?.(); }, 800);
  };
  const toggleTag = tag => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t=>t!==tag) : [...f.tags, tag] }));

  return (
    <div style={{ padding:'16px 0' }}>

      {/* Photo */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <div onClick={() => photoRef.current?.click()} style={{ width:60, height:60, borderRadius:'50%', border:'1.5px dashed rgba(201,168,76,0.3)', overflow:'hidden', background:'rgba(255,255,255,0.02)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          {club.photo ? <img src={club.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/> : <span style={{ color:'rgba(201,168,76,0.3)', fontSize:22 }}>+</span>}
        </div>
        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:'none' }}/>
        <div>
          <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 4px' }}>Klubin kuva</p>
          <button onClick={() => photoRef.current?.click()} style={{ background:'none', border:'1px solid rgba(201,168,76,0.25)', borderRadius:7, padding:'4px 12px', color:'rgba(201,168,76,0.5)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em', cursor:'pointer' }}>
            {club.photo ? 'Vaihda' : 'Lisää kuva'}
          </button>
        </div>
      </div>

      {/* Name & bio */}
      {[['Nimi','name'],['Bio','desc'],['Sijainti','location']].map(([label,field]) => (
        <div key={field} style={{ marginBottom:12 }}>
          <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 6px' }}>{label}</p>
          <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:9, padding:'9px 12px', color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:'none' }}/>
        </div>
      ))}

      {/* Public toggle */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:'0.07em', margin:'0 0 2px' }}>Julkinen klubi</p>
          <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>Kaikki voivat löytää ja liittyä</p>
        </div>
        <Toggle value={form.isPublic} onChange={v=>setForm(f=>({...f,isPublic:v}))} />
      </div>

      {/* Tags */}
      <div style={{ marginBottom:20 }}>
        <p style={{ color:'rgba(201,168,76,0.4)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 10px' }}>Tagit</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {ALL_TAGS.map(tag => {
            const sel = form.tags.includes(tag);
            return <button key={tag} onClick={() => toggleTag(tag)} style={{ background:sel?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.02)', border:`1px solid ${sel?GOLD:'rgba(201,168,76,0.18)'}`, borderRadius:20, padding:'5px 12px', cursor:'pointer', color:sel?GOLD:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em', transition:'all 0.15s' }}>{tag}</button>;
          })}
        </div>
      </div>

      <button onClick={save} style={{ width:'100%', padding:'12px', marginBottom:12, background:saved?'rgba(110,255,160,0.1)':BURGUNDY, border:`1px solid ${saved?'rgba(110,255,160,0.4)':`${GOLD}88`}`, borderRadius:11, color:saved?'#6effa0':GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.3s' }}>
        {saved ? '✓ Tallennettu' : 'Tallenna muutokset'}
      </button>

      {/* Invite section */}
      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, padding:'14px', marginBottom:12 }}>
        <p style={{ color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', margin:'0 0 12px' }}>Kutsu jäseniä</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={copyLink} style={{ padding:'10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:9, cursor:'pointer', color:copied?'#6effa0':GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            {copied ? '✓ Linkki kopioitu' : '🔗 Kopioi kutsu-linkki'}
          </button>
          <button onClick={shareLink} style={{ padding:'10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:9, cursor:'pointer', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            📱 Jaa puhelinnumerolla
          </button>
          <button onClick={() => setShowQR(!showQR)} style={{ padding:'10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:9, cursor:'pointer', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            {showQR ? 'Piilota QR' : '⬛ Näytä QR-koodi'}
          </button>
          {showQR && (
            <div style={{ display:'flex', justifyContent:'center', paddingTop:8, animation:'fadeUp 0.25s ease both' }}>
              <QRCode value={inviteLink} size={150} />
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <button onClick={() => { if(window.confirm('Poistetaanko klubi pysyvästi?')) onDeleteClub(); }} style={{ width:'100%', padding:'11px', background:'rgba(255,40,40,0.05)', border:'1px solid rgba(255,50,50,0.2)', borderRadius:11, cursor:'pointer', color:'rgba(255,80,80,0.6)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase' }}>
        Poista klubi
      </button>
    </div>
  );
}

// ── MAIN CLUB VIEW ────────────────────────────────────────────────────────────
export default function ClubView({ club, onClose, onUpdateClub, onDeleteClub, userTier }) {
  const [tab, setTab] = useState('feed');
  const isAdmin = true; // current user is always admin of their own clubs
  const isMod   = isAdmin || club.members?.find(m=>m.id==='julius')?.role==='moderator';
  const canChat    = isAdmin || club.members?.find(m=>m.id==='julius')?.perms?.chat;
  const canEvents  = isAdmin || club.members?.find(m=>m.id==='julius')?.perms?.events;

  const limits = TIER_LIMITS[userTier] || TIER_LIMITS.member;

  const TABS = [
    { id:'feed',     label:'Feed'     },
    { id:'events',   label:'Eventit'  },
    { id:'members',  label:'Jäsenet'  },
    { id:'settings', label:'Asetukset'},
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{ position:'fixed', inset:0, zIndex:500, background:'#0d0406', overflowY:'auto', display:'flex', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:480 }}>

          {/* Header */}
          <div style={{ position:'sticky', top:0, background:'rgba(13,4,6,0.97)', backdropFilter:'blur(12px)', zIndex:10, borderBottom:'0.5px solid rgba(201,168,76,0.1)' }}>
            <div style={{ padding:'52px 20px 0', display:'flex', alignItems:'center', gap:14 }}>
              <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(201,168,76,0.45)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', padding:0, flexShrink:0 }}>←</button>
              <Avatar name={club.name} photo={club.photo} size={42} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700, letterSpacing:'0.06em', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{club.name}</p>
                <p style={{ color:'rgba(201,168,76,0.45)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:0 }}>
                  {club.members?.length||1} jäsentä · {club.isPublic?'Julkinen':'Yksityinen'}
                </p>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display:'flex', padding:'8px 0 0' }}>
              {TABS.filter(t => t.id!=='settings' || isAdmin).map(t => (
                <button key={t.id} className={`club-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>

          <div style={{ padding:'0 20px 80px' }}>
            {tab==='feed'     && <ClubFeed    club={club} canChat={canChat} />}
            {tab==='events'   && <ClubEvents  club={club} canCreate={canEvents} />}
            {tab==='members'  && <ClubMembers club={club} isAdmin={isAdmin} onUpdateClub={onUpdateClub} />}
            {tab==='settings' && isAdmin && <ClubSettings club={club} onUpdateClub={onUpdateClub} onDeleteClub={onDeleteClub} onNavigateToFeed={() => setTab('feed')} />}
          </div>
        </div>
      </div>
    </>
  );
}