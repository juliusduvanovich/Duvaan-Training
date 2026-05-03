import { useState, useRef, useEffect } from "react";

const GOLD    = "#C9A84C";
const BURGUNDY = "#6B1D2E";
const CREAM   = "#f5f0e8";

export const TIER_LIMITS = {
  member:  { maxClubs:1,  maxMembers:10,   canPublic:false },
  builder: { maxClubs:3,  maxMembers:50,   canPublic:true  },
  creator: { maxClubs:10, maxMembers:1500, canPublic:true  },
};

const CLUB_TYPES = {
  open:    { label:'Avoin',        icon:'◯', desc:'Kaikki voivat liittyä vapaasti' },
  private: { label:'Yksityinen',   icon:'◈', desc:'Vain kutsulla' },
  invite:  { label:'Hakemusklubi', icon:'✦', desc:'Hae jäsenyyttä — admin hyväksyy' },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes msgIn  { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:translateY(0)} }

  .cv-tab {
    flex:1; background:none; border:none; cursor:pointer;
    font-family:'Cinzel',serif; font-size:11px; font-weight:600;
    letter-spacing:0.14em; text-transform:uppercase;
    color:rgba(107,29,46,0.5);
    padding:10px 0; transition:all 0.25s;
  }
  .cv-tab.active {
    color:#6B1D2E; font-weight:800; font-size:13px;
    text-shadow: 0 0 18px rgba(201,168,76,0.5), 0 0 32px rgba(201,168,76,0.3);
  }
  .cv-input {
    width:100%; box-sizing:border-box;
    background:rgba(255,255,255,0.7);
    border:1.5px solid rgba(107,29,46,0.3);
    border-radius:10px; padding:10px 14px;
    color:#2a1008; font-family:'Cormorant Garamond',serif;
    font-size:14px; outline:none;
  }
  .cv-input::placeholder { color:rgba(107,29,46,0.35); font-style:italic; }
  .cv-input:focus { border-color:#6B1D2E; }
  .cv-label {
    color:#6B1D2E; font-family:'Cinzel',serif;
    font-size:8px; font-weight:700; letter-spacing:0.2em;
    text-transform:uppercase; margin:0 0 6px; display:block;
  }
`;

function Avatar({ name, photo, size=40, color=GOLD }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${BURGUNDY},${color})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', border:`1.5px solid ${color}55` }}>
      {photo ? <img src={photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/> : <span style={{ color:'#fff', fontFamily:"'Cinzel',serif", fontSize:size*0.38, fontWeight:700 }}>{name?.[0]?.toUpperCase()||'?'}</span>}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:42, height:22, borderRadius:11, background:value?BURGUNDY:'rgba(255,255,255,0.5)', border:`1.5px solid ${value?GOLD:'rgba(107,29,46,0.3)'}`, position:'relative', cursor:'pointer', transition:'all 0.22s', flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:'50%', background:value?GOLD:BURGUNDY, position:'absolute', top:2, left:value?23:2, transition:'left 0.22s' }}/>
    </div>
  );
}

// ── FEED ─────────────────────────────────────────────────────────────────────
function ClubFeed({ club, isAdmin, currentUser='Julius' }) {
  const [msgs, setMsgs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`club_feed_${club.id}`)||'[]') } catch { return [] }
  });
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs]);

  const send = (content, imageData=null) => {
    if (!content.trim() && !imageData) return;
    const m = { id:Date.now(), author:currentUser, text:content.trim(), image:imageData, time:new Date().toLocaleTimeString('fi-FI',{hour:'2-digit',minute:'2-digit'}) };
    const updated = [...msgs, m];
    setMsgs(updated);
    localStorage.setItem(`club_feed_${club.id}`, JSON.stringify(updated));
    setText('');
  };

  const deleteMsg = (id) => {
    const updated = msgs.filter(m => m.id !== id);
    setMsgs(updated);
    localStorage.setItem(`club_feed_${club.id}`, JSON.stringify(updated));
    setDeleting(null);
  };

  const handleImage = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const max=800; const ratio=Math.min(max/img.width,max/img.height,1);
      canvas.width=Math.round(img.width*ratio); canvas.height=Math.round(img.height*ratio);
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      send('', canvas.toDataURL('image/jpeg',0.75));
    };
    img.src=url;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 280px)', minHeight:300 }}>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {msgs.length === 0 && (
          <p style={{ color:'rgba(107,29,46,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:40 }}>Ei viestejä vielä. Aloita keskustelu.</p>
        )}
        {msgs.map((m, i) => {
          const isOwn = m.author === currentUser;
          const canDelete = isOwn || isAdmin;
          return (
            <div key={m.id}
              style={{ marginBottom:16, animation:'msgIn 0.25s ease both', animationDelay:`${Math.min(i*0.02,0.2)}s`, position:'relative' }}
              onMouseEnter={() => canDelete && setDeleting(m.id)}
              onMouseLeave={() => setDeleting(null)}
            >
              {/* Author row */}
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:5 }}>
                <span style={{
                  color: BURGUNDY,
                  fontFamily:"'Cinzel',serif",
                  fontSize:12,
                  fontWeight:700,
                  letterSpacing:'0.08em',
                }}>
                  {m.author}
                </span>
                <span style={{
                  color: 'rgba(107,29,46,0.65)',
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:12,
                  fontWeight:500,
                }}>
                  {m.time}
                </span>
                {deleting===m.id && canDelete && (
                  <button onClick={() => deleteMsg(m.id)} style={{ background:'rgba(200,50,50,0.1)', border:'1px solid rgba(200,50,50,0.3)', borderRadius:6, padding:'2px 8px', cursor:'pointer', color:'rgba(200,50,50,0.8)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em', marginLeft:'auto' }}>Poista</button>
                )}
              </div>
              {/* Image */}
              {m.image && <img src={m.image} alt="" style={{ maxWidth:'100%', borderRadius:10, marginBottom:m.text?6:0, display:'block', border:'1px solid rgba(107,29,46,0.15)' }}/>}
              {/* Message text */}
              {m.text && (
                <p style={{
                  color: '#1a0810',
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:16,
                  fontWeight:500,
                  margin:0,
                  lineHeight:1.6,
                }}>
                  {m.text}
                </p>
              )}
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input row */}
      <div style={{ borderTop:'1px solid rgba(107,29,46,0.2)', paddingTop:10, display:'flex', gap:8, alignItems:'flex-end' }}>
        <button onClick={() => fileRef.current?.click()} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(107,29,46,0.5)', fontSize:18, lineHeight:1, flexShrink:0, padding:'4px 2px' }}>📎</button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }}/>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Kirjoita viesti..." rows={1}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(text);}}}
          style={{ flex:1, background:'rgba(255,255,255,0.7)', border:'1.5px solid rgba(107,29,46,0.3)', borderRadius:10, padding:'8px 12px', color:'#1a0810', fontFamily:"'Cormorant Garamond',serif", fontSize:15, resize:'none', outline:'none', lineHeight:1.5 }}/>
        <button onClick={() => send(text)} style={{ width:32, height:32, background:BURGUNDY, border:'none', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill={GOLD}/></svg>
        </button>
      </div>
    </div>
  );
}

// ── EVENTS ───────────────────────────────────────────────────────────────────
function ClubEvents({ club, canCreate }) {
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`club_events_${club.id}`)||'[]') } catch { return [] }
  });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name:'', date:'', time:'', location:'', desc:'', free:true });

  const save = () => {
    if (!form.name.trim() || !form.date) return;
    const ev = { id:Date.now(), ...form, attending:[], host:'Julius' };
    const updated = [...events, ev];
    setEvents(updated);
    localStorage.setItem(`club_events_${club.id}`, JSON.stringify(updated));
    setCreating(false);
    setForm({ name:'', date:'', time:'', location:'', desc:'', free:true });
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
    <div style={{ padding:'8px 0', animation:'fadeUp 0.25s ease both' }}>
      <button onClick={() => setCreating(false)} style={{ background:'none', border:'none', cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.14em', marginBottom:16, padding:0 }}>← Takaisin</button>
      {[['Nimi','name','Tapahtuman nimi'],['Sijainti','location','Missä?'],['Kuvaus','desc','Kerro lisää...']].map(([label,field,ph]) => (
        <div key={field} style={{ marginBottom:12 }}>
          <span className="cv-label">{label}</span>
          <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph} className="cv-input"/>
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        {[['Päivä','date','date'],['Kello','time','time']].map(([label,field,type]) => (
          <div key={field} style={{ flex:1 }}>
            <span className="cv-label">{label}</span>
            <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} className="cv-input"/>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[[true,'Ilmainen'],[false,'Maksullinen']].map(([val,label]) => (
          <button key={String(val)} onClick={() => setForm(f=>({...f,free:val}))} style={{ flex:1, padding:'9px', background:form.free===val?BURGUNDY:'rgba(255,255,255,0.6)', border:`1.5px solid ${form.free===val?BURGUNDY:'rgba(107,29,46,0.3)'}`, borderRadius:9, cursor:'pointer', color:form.free===val?GOLD:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700 }}>{label}</button>
        ))}
      </div>
      <button onClick={save} style={{ width:'100%', padding:'12px', background:BURGUNDY, border:'none', borderRadius:11, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>Luo tapahtuma</button>
    </div>
  );

  return (
    <div style={{ padding:'8px 0' }}>
      {canCreate && <button onClick={() => setCreating(true)} style={{ width:'100%', padding:'11px', marginBottom:14, background:BURGUNDY, border:'none', borderRadius:11, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>+ Luo tapahtuma</button>}
      {events.length === 0
        ? <p style={{ color:'rgba(107,29,46,0.4)', fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', textAlign:'center', marginTop:24 }}>Ei tapahtumia.</p>
        : events.map(ev => {
          const going = ev.attending.includes('Julius');
          return (
            <div key={ev.id} style={{ background:'rgba(255,255,255,0.65)', border:'1.5px solid rgba(107,29,46,0.2)', borderRadius:14, padding:'14px 16px', marginBottom:10, backdropFilter:'blur(8px)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:700 }}>{ev.name}</span>
                <span style={{ color:ev.free?'#2a9a50':BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:700 }}>{ev.free?'Ilmainen':ev.price}</span>
              </div>
              {ev.desc && <p style={{ color:'rgba(107,29,46,0.7)', fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:'italic', margin:'0 0 8px' }}>{ev.desc}</p>}
              <p style={{ color:'#1a0810', fontFamily:"'Cormorant Garamond',serif", fontSize:14, margin:'0 0 10px' }}>{ev.date}{ev.time?` · klo ${ev.time}`:''}{ev.location?` · ${ev.location}`:''}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, opacity:0.6 }}>{ev.attending.length} ilmoittautunut</span>
                <button onClick={() => attend(ev.id)} style={{ background:going?'rgba(42,154,80,0.1)':BURGUNDY, border:`1.5px solid ${going?'rgba(42,154,80,0.5)':BURGUNDY}`, borderRadius:20, padding:'6px 16px', cursor:'pointer', color:going?'#2a9a50':GOLD, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700 }}>
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

// ── MEMBERS ───────────────────────────────────────────────────────────────────
function ClubMembers({ club, isAdmin, onUpdateClub }) {
  const [editing, setEditing] = useState(null);
  const [dmMember, setDmMember] = useState(null);
  const members = club.members || [{ id:'julius', name:'Julius', role:'admin' }];
  const ROLE_COLORS = { admin:GOLD, moderator:'#55CCFF', member:BURGUNDY };
  const ROLE_LABELS = { admin:'Admin', moderator:'Mod', member:'Jäsen' };

  const remove = (id) => onUpdateClub({ ...club, members: members.filter(m => m.id !== id) });
  const promote = (id) => onUpdateClub({ ...club, members: members.map(m => m.id===id ? {...m,role:'moderator'} : m) });
  const demote  = (id) => onUpdateClub({ ...club, members: members.map(m => m.id===id ? {...m,role:'member'} : m) });

  return (
    <div style={{ padding:'8px 0' }}>
      <p style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:12, opacity:0.6 }}>{members.length} jäsentä</p>
      {members.map(m => (
        <div key={m.id}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'0.5px solid rgba(107,29,46,0.1)' }}>
            <Avatar name={m.name} size={38}/>
            <div style={{ flex:1 }}>
              <p style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, margin:'0 0 2px' }}>{m.name}</p>
              <span style={{ color:ROLE_COLORS[m.role], fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em' }}>{ROLE_LABELS[m.role]}</span>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {m.role !== 'admin' && <button onClick={() => setDmMember(m)} style={{ background:'none', border:'1px solid rgba(107,29,46,0.3)', borderRadius:7, padding:'4px 10px', cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:8, fontWeight:700 }}>DM</button>}
              {isAdmin && m.role !== 'admin' && <button onClick={() => setEditing(editing===m.id?null:m.id)} style={{ background:'none', border:'1px solid rgba(107,29,46,0.3)', borderRadius:7, padding:'4px 10px', cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:8 }}>{editing===m.id?'↑':'···'}</button>}
            </div>
          </div>
          {isAdmin && editing===m.id && (
            <div style={{ background:'rgba(255,255,255,0.5)', border:'1.5px solid rgba(107,29,46,0.2)', borderRadius:10, padding:'12px', margin:'6px 0 8px', animation:'fadeUp 0.2s ease both' }}>
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <button onClick={() => promote(m.id)} style={{ flex:1, padding:'7px', background:m.role==='moderator'?BURGUNDY:'rgba(255,255,255,0.5)', border:`1.5px solid ${m.role==='moderator'?BURGUNDY:'rgba(107,29,46,0.3)'}`, borderRadius:8, cursor:'pointer', color:m.role==='moderator'?GOLD:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, fontWeight:700 }}>Moderaattori</button>
                <button onClick={() => demote(m.id)} style={{ flex:1, padding:'7px', background:m.role==='member'?BURGUNDY:'rgba(255,255,255,0.5)', border:`1.5px solid ${m.role==='member'?BURGUNDY:'rgba(107,29,46,0.3)'}`, borderRadius:8, cursor:'pointer', color:m.role==='member'?GOLD:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, fontWeight:700 }}>Jäsen</button>
              </div>
              <button onClick={() => { remove(m.id); setEditing(null); }} style={{ width:'100%', padding:'8px', background:'rgba(200,50,50,0.05)', border:'1px solid rgba(200,50,50,0.25)', borderRadius:8, cursor:'pointer', color:'rgba(200,50,50,0.8)', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase' }}>Poista klubista</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function ClubSettings({ club, onUpdateClub, onDeleteClub, onBack }) {
  const [form, setForm] = useState({ name:club.name, desc:club.desc||'', location:club.location||'', isPublic:club.isPublic||false, type:club.type||'private', tags:club.tags||[] });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const coverRef = useRef(null);
  const photoRef = useRef(null);

  const handleCover = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const w=800, h=320; const ratio=Math.max(w/img.width,h/img.height);
      canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(img,(w-img.width*ratio)/2,(h-img.height*ratio)/2,img.width*ratio,img.height*ratio);
      onUpdateClub({ ...club, coverPhoto:canvas.toDataURL('image/jpeg',0.8) });
    };
    img.src=url;
  };

  const ALL_TAGS = ['Sports','Gastronomy','Philosophy','Business','Music','Wellness','Art','Technology','Finance','Travel','Mindfulness','Nutrition','Running','Film','Fashion'];
  const inviteLink = `https://duvaan.app/join/${club.id}`;

  const save = () => {
    onUpdateClub({ ...club, ...form });
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 800);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const max=400; const ratio=Math.min(max/img.width,max/img.height,1);
      canvas.width=Math.round(img.width*ratio); canvas.height=Math.round(img.height*ratio);
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      onUpdateClub({ ...club, photo:canvas.toDataURL('image/jpeg',0.75) });
    };
    img.src=url;
  };

  return (
    <div style={{ padding:'8px 0 40px', animation:'fadeUp 0.25s ease both' }}>
      {/* Cover photo */}
      <div style={{ marginBottom:18 }}>
        <span className="cv-label">Taustakuva (hero)</span>
        <div onClick={() => coverRef.current?.click()} style={{ width:'100%', height:80, borderRadius:12, border:'1.5px dashed rgba(107,29,46,0.4)', overflow:'hidden', background:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
          {club.coverPhoto
            ? <img src={club.coverPhoto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
            : <span style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.1em', opacity:0.5 }}>+ Lisää taustakuva</span>
          }
          {club.coverPhoto && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#fff', fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.12em' }}>Vaihda</span></div>}
        </div>
        <input ref={coverRef} type="file" accept="image/*" onChange={handleCover} style={{ display:'none' }}/>
      </div>

      {/* Profile photo */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <div onClick={() => photoRef.current?.click()} style={{ width:60, height:60, borderRadius:'50%', border:'1.5px dashed rgba(107,29,46,0.4)', overflow:'hidden', background:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          {club.photo ? <img src={club.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/> : <span style={{ color:BURGUNDY, fontSize:22, opacity:0.4 }}>+</span>}
        </div>
        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:'none' }}/>
        <div>
          <p style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 4px' }}>Klubin kuva</p>
          <button onClick={() => photoRef.current?.click()} style={{ background:'none', border:'1.5px solid rgba(107,29,46,0.35)', borderRadius:7, padding:'4px 12px', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.1em', cursor:'pointer', fontWeight:700 }}>{club.photo?'Vaihda':'Lisää kuva'}</button>
        </div>
      </div>

      {[['Nimi','name'],['Bio','desc'],['Sijainti','location']].map(([label,field]) => (
        <div key={field} style={{ marginBottom:12 }}>
          <span className="cv-label">{label}</span>
          <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} className="cv-input"/>
        </div>
      ))}

      {/* Club type */}
      <div style={{ marginBottom:16 }}>
        <span className="cv-label">Klubin tyyppi</span>
        <div style={{ display:'flex', gap:7 }}>
          {Object.entries(CLUB_TYPES).map(([key, ct]) => (
            <button key={key} onClick={() => setForm(f=>({...f,type:key}))} style={{ flex:1, padding:'8px 4px', background:form.type===key?BURGUNDY:'rgba(255,255,255,0.6)', border:`1.5px solid ${form.type===key?BURGUNDY:'rgba(107,29,46,0.3)'}`, borderRadius:9, cursor:'pointer', color:form.type===key?GOLD:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:8, fontWeight:700, letterSpacing:'0.06em', textAlign:'center' }}>
              <div style={{ fontSize:14, marginBottom:2 }}>{ct.icon}</div>
              <div>{ct.label}</div>
            </button>
          ))}
        </div>
        <p style={{ color:'rgba(107,29,46,0.55)', fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:'italic', margin:'6px 0 0' }}>{CLUB_TYPES[form.type]?.desc}</p>
      </div>

      {/* Tags */}
      <div style={{ marginBottom:18 }}>
        <span className="cv-label">Tagit</span>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {ALL_TAGS.map(tag => {
            const sel = form.tags.includes(tag);
            return <button key={tag} onClick={() => setForm(f=>({...f,tags:sel?f.tags.filter(t=>t!==tag):[...f.tags,tag]}))} style={{ background:sel?BURGUNDY:'rgba(255,255,255,0.6)', border:`1.5px solid ${BURGUNDY}`, borderRadius:20, padding:'5px 12px', cursor:'pointer', color:sel?GOLD:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.08em', fontWeight:700 }}>{tag}</button>;
          })}
        </div>
      </div>

      <button onClick={save} style={{ width:'100%', padding:'12px', marginBottom:12, background:saved?'rgba(42,154,80,0.1)':BURGUNDY, border:`1.5px solid ${saved?'rgba(42,154,80,0.4)':'rgba(201,168,76,0.3)'}`, borderRadius:11, color:saved?'#2a9a50':GOLD, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.3s' }}>
        {saved ? '✓ Tallennettu' : 'Tallenna muutokset'}
      </button>

      {/* Invite */}
      <div style={{ background:'rgba(255,255,255,0.5)', border:'1.5px solid rgba(107,29,46,0.2)', borderRadius:12, padding:'14px', marginBottom:12 }}>
        <p style={{ color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', margin:'0 0 10px' }}>Kutsu jäseniä</p>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          <button onClick={() => { navigator.clipboard?.writeText(inviteLink); setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ padding:'10px', background:'rgba(255,255,255,0.6)', border:'1.5px solid rgba(107,29,46,0.3)', borderRadius:9, cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{copied?'✓ Kopioitu':'🔗 Kopioi kutsu-linkki'}</button>
          <button onClick={() => navigator.share?.({title:`Liity ${club.name}`,url:inviteLink})} style={{ padding:'10px', background:'rgba(255,255,255,0.6)', border:'1.5px solid rgba(107,29,46,0.3)', borderRadius:9, cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>📱 Jaa</button>
        </div>
      </div>

      <button onClick={() => { if(window.confirm('Poistetaanko klubi pysyvästi?')) onDeleteClub(); }} style={{ width:'100%', padding:'11px', background:'rgba(200,50,50,0.05)', border:'1px solid rgba(200,50,50,0.25)', borderRadius:11, cursor:'pointer', color:'rgba(200,50,50,0.8)', fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Poista klubi</button>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ClubView({ club, onClose, onUpdateClub, onDeleteClub, userTier='member' }) {
  const [tab, setTab] = useState('feed');
  const isAdmin = true;
  const clubType = CLUB_TYPES[club.type || 'private'];
  const memberCount = club.members?.length || 1;
  const isJoined = true;

  const TABS = [
    { id:'feed',     label:'Feed' },
    { id:'events',   label:'Eventit' },
    { id:'members',  label:'Jäsenet' },
    ...(isAdmin ? [{ id:'settings', label:'Asetukset' }] : []),
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{ position:'fixed', inset:0, zIndex:500, background:CREAM, overflowY:'auto', display:'flex', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:480, display:'flex', flexDirection:'column' }}>

          {/* ── HERO HEADER ── */}
          <div style={{ position:'relative', height:200, flexShrink:0, overflow:'hidden' }}>
            {club.coverPhoto
              ? <img src={club.coverPhoto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
              : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, rgba(107,29,46,0.85) 0%, rgba(30,18,6,0.95) 50%, rgba(60,40,80,0.8) 100%)` }}/>
            }
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(245,240,232,0) 60%, rgba(245,240,232,1) 100%)' }}/>
            <button onClick={onClose} style={{ position:'absolute', top:52, left:16, background:'rgba(245,240,232,0.85)', border:'none', borderRadius:20, padding:'6px 14px', cursor:'pointer', color:BURGUNDY, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.1em', backdropFilter:'blur(8px)' }}>← Takaisin</button>
            <div style={{ position:'absolute', bottom:16, left:16, display:'flex', alignItems:'flex-end', gap:12 }}>
              <div style={{ border:'2.5px solid rgba(245,240,232,0.9)', borderRadius:'50%', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
                <Avatar name={club.name} photo={club.photo} size={56}/>
              </div>
              <div style={{ paddingBottom:4 }}>
                <p style={{ color:'#fff', fontFamily:"'Cinzel',serif", fontSize:17, fontWeight:700, letterSpacing:'0.06em', margin:'0 0 3px', textShadow:'0 2px 8px rgba(0,0,0,0.5)' }}>{club.name}</p>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ background:'rgba(245,240,232,0.2)', backdropFilter:'blur(8px)', border:'1px solid rgba(245,240,232,0.4)', borderRadius:20, padding:'2px 8px', color:'rgba(255,255,255,0.9)', fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:'0.1em' }}>{clubType?.icon} {clubType?.label}</span>
                  <span style={{ color:'rgba(255,255,255,0.7)', fontFamily:"'Cormorant Garamond',serif", fontSize:12 }}>{memberCount} jäsentä</span>
                </div>
              </div>
            </div>
            {!isJoined && (
              <button style={{ position:'absolute', bottom:16, right:16, background:BURGUNDY, border:'none', borderRadius:20, padding:'8px 20px', cursor:'pointer', color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', boxShadow:'0 4px 16px rgba(107,29,46,0.4)' }}>Liity</button>
            )}
          </div>

          {/* ── BIO ── */}
          {club.desc && (
            <div style={{ padding:'12px 16px 0' }}>
              <p style={{ color:BURGUNDY, fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:'italic', margin:0, lineHeight:1.6 }}>{club.desc}</p>
            </div>
          )}

          {/* ── DOCK ── */}
          <div style={{ position:'sticky', top:0, zIndex:10, marginTop:12 }}>
            <svg style={{ display:'block', width:'100%', height:6, overflow:'visible' }} viewBox="0 0 100 6" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cvLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor={BURGUNDY} stopOpacity="0"/>
                  <stop offset="20%"  stopColor={BURGUNDY} stopOpacity="0.8"/>
                  <stop offset="50%"  stopColor={BURGUNDY} stopOpacity="1"/>
                  <stop offset="80%"  stopColor={BURGUNDY} stopOpacity="0.8"/>
                  <stop offset="100%" stopColor={BURGUNDY} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,5 Q50,1 100,5" fill="none" stroke="url(#cvLine)" strokeWidth="1.5"/>
            </svg>
            <div style={{ display:'flex', background:'rgba(245,240,232,0.97)', backdropFilter:'blur(12px)' }}>
              {TABS.map(t => (
                <button key={t.id} className={`cv-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div style={{ padding:'8px 16px 100px', flex:1 }}>
            {tab==='feed'     && <ClubFeed     club={club} isAdmin={isAdmin} />}
            {tab==='events'   && <ClubEvents   club={club} canCreate={isAdmin} />}
            {tab==='members'  && <ClubMembers  club={club} isAdmin={isAdmin} onUpdateClub={onUpdateClub} />}
            {tab==='settings' && <ClubSettings club={club} onUpdateClub={onUpdateClub} onDeleteClub={onDeleteClub} onBack={() => setTab('feed')} />}
          </div>
        </div>
      </div>
    </>
  );
}