import { useState, useRef } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

// Tier points (must match PersonalView FREQ_LEVELS)
export const TIER_THRESHOLDS = { member:0, builder:1000, masterbuilder:5000 }

export function getUserTier(points) {
  if (points >= 5000) return 'masterbuilder'
  if (points >= 1000) return 'builder'
  return 'member'
}

// Eliel visual per tier — CSS filter applied to the image
export const ELIEL_TIER_FILTERS = {
  member:        'sepia(0.8) saturate(0.4) brightness(1.1) hue-rotate(180deg) drop-shadow(0 0 18px rgba(160,180,220,0.6))',
  builder:       'drop-shadow(0 0 18px rgba(201,168,76,0.55))',
  masterbuilder: 'sepia(0.05) saturate(0.6) brightness(1.4) contrast(1.1) drop-shadow(0 0 24px rgba(220,240,255,0.9))',
}

export const ELIEL_TIER_GLOW = {
  member:        '#A0B4DC',
  builder:       '#C9A84C',
  masterbuilder: '#DCF0FF',
}

// Aura unlock requirements
export const AURAS = [
  { id:"gold",     name:"Gold",     color:"#C9A84C", shadow:"rgba(201,168,76,0.8)",  desc:"Viisaus · Luottamus",   unlockedAt:'member'        },
  { id:"arctic",   name:"Arctic",   color:"#6EB4FF", shadow:"rgba(110,180,255,0.8)", desc:"Rauha · Selkeys",       unlockedAt:'member'        },
  { id:"ember",    name:"Ember",    color:"#FF6B35", shadow:"rgba(255,107,53,0.8)",  desc:"Energia · Intohimo",    unlockedAt:'member'        },
  { id:"jade",     name:"Jade",     color:"#6EFFA0", shadow:"rgba(110,255,160,0.8)", desc:"Kasvu · Tasapaino",     unlockedAt:'builder'       },
  { id:"amethyst", name:"Amethyst", color:"#C06EFF", shadow:"rgba(192,110,255,0.8)", desc:"Mystiikka · Luovuus",   unlockedAt:'builder'       },
  { id:"crimson",  name:"Crimson",  color:"#FF4060", shadow:"rgba(255,64,96,0.8)",   desc:"Voima · Intensiteetti", unlockedAt:'masterbuilder' },
];

const TIER_LABELS = { member:'Member', builder:'Builder', masterbuilder:'MasterBuilder' }

const NOTIF_ITEMS = [
  { key:"notifFrequency",  label:"Frequency-muistutus",        sub:"Muistuttaa jos treenistreak on vaarassa" },
  { key:"notifEliel",      label:"Elielin päivittäinen insight",sub:"Eliel lähettää aamuisin yhden lauseen" },
  { key:"notifNotes",      label:"Muistiinpanomuistutukset",    sub:"Muistuttaa avoimista muistiinpanoista" },
  { key:"notifClub",       label:"Klubiaktiivisuus",            sub:"Uutta toimintaa klubeissasi" },
  { key:"notifEvents",     label:"Tapahtumat lähistöllä",       sub:"Sinulle sopiva klubi tai tapahtuma lähellä" },
  { key:"notifMessages",   label:"Yksityisklubin viestit",      sub:"Viestit yksityisen klubisi jäseniltä" },
  { key:"notifContent",    label:"Uusi Duvaan-sisältö",         sub:"Musiikkia, artikkeleita ja julkaisuja" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes auraGlow { 0%,100%{box-shadow:0 0 20px var(--ac),0 0 40px var(--ac2)} 50%{box-shadow:0 0 32px var(--ac),0 0 64px var(--ac2)} }

  .s-section { border-bottom:0.5px solid rgba(201,168,76,0.08); padding-bottom:24px; margin-bottom:24px; animation:fadeUp 0.35s ease both; }
  .s-row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:0.5px solid rgba(201,168,76,0.06); }
  .s-row:last-child { border-bottom:none; }

  .toggle-track { width:42px; height:22px; border-radius:11px; position:relative; cursor:pointer; transition:background 0.22s; flex-shrink:0; }
  .toggle-thumb { width:16px; height:16px; border-radius:50%; position:absolute; top:3px; transition:left 0.22s,background 0.22s; }

  .aura-btn { display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px 6px; border-radius:12px; cursor:pointer; border:1.5px solid transparent; transition:all 0.2s; background:rgba(255,255,255,0.02); flex:1; min-width:0; }
  .aura-orb { width:32px; height:32px; border-radius:50%; flex-shrink:0; }

  .notif-sub { display:flex; flex-direction:column; padding-left:16px; border-left:1px solid rgba(201,168,76,0.08); margin-top:4px; }
  .danger-btn { width:100%; padding:11px 0; background:rgba(255,50,50,0.05); border:1px solid rgba(255,60,60,0.18); border-radius:11px; color:rgba(255,90,90,0.65); font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; margin-bottom:8px; transition:all 0.18s; }
  .danger-btn:last-child { margin-bottom:0; }

  .aura-preview-ring {
    width:100px; height:100px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    border:2px solid transparent;
    transition:all 0.4s ease;
    animation:auraGlow 3s ease-in-out infinite;
  }
`;

function Toggle({ value, onChange }) {
  return (
    <div className="toggle-track"
      style={{ background:value?"rgba(201,168,76,0.22)":"rgba(255,255,255,0.04)", border:`1px solid ${value?"rgba(201,168,76,0.4)":"rgba(201,168,76,0.15)"}` }}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-thumb" style={{ left:value?23:3, background:value?GOLD:"rgba(255,255,255,0.2)" }}/>
    </div>
  );
}

function SecTitle({ children, delay=0 }) {
  return <p style={{ color:"rgba(201,168,76,0.38)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.26em", textTransform:"uppercase", margin:"0 0 14px", animationDelay:`${delay}ms` }}>{children}</p>;
}

function RowLabel({ title, sub }) {
  return (
    <div style={{ flex:1, paddingRight:12 }}>
      <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.07em", margin:"0 0 2px" }}>{title}</p>
      {sub && <p style={{ color:"rgba(201,168,76,0.4)", fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:"italic", margin:0, lineHeight:1.4 }}>{sub}</p>}
    </div>
  );
}

export default function SettingsView({ onClose, settings, onSave }) {
  const [local, setLocal] = useState({ ...settings });
  const bgRef = useRef(null);
  const set = (key, val) => setLocal(s => ({ ...s, [key]:val }));

  // Get current user tier
  const points = (() => { try { return parseInt(localStorage.getItem('duvaan_frequency')||'0') } catch { return 0 } })()
  const userTier = getUserTier(points)
  const tierOrder = ['member','builder','masterbuilder']
  const isUnlocked = (requiredTier) => tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier)

  const handleBgPhoto = e => {
    const file = e.target.files?.[0]; if(!file) return;
    // Compress to max 800px wide before saving as base64
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const MAX = 800;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      set("bgImage", compressed);
    };
    img.src = url;
  };

  const handleSave = () => { onSave(local); onClose(); };
  const aura = AURAS.find(a => a.id === local.aura) || AURAS[0];

  return (
    <>
      <style>{css}</style>
      <div style={{
        position:"fixed", inset:0, zIndex:500,
        display:"flex", justifyContent:"center",
        background:"rgba(0,0,0,0.6)",
      }}>
        <div style={{
          width:"100%", maxWidth:"480px",
          background:"#0d0406",
          overflowY:"auto",
          position:"relative",
        }}>
          {/* Header */}
          <div style={{ position:"sticky", top:0, background:"rgba(13,4,6,0.97)", backdropFilter:"blur(12px)", zIndex:10, padding:"14px 20px 12px", borderBottom:"0.5px solid rgba(201,168,76,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:700, letterSpacing:"0.1em", margin:0 }}>Asetukset</h2>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.35)", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase" }}>Peruuta</button>
              <button onClick={handleSave} style={{ background:BURGUNDY, border:"1px solid rgba(201,168,76,0.4)", borderRadius:9, padding:"7px 16px", color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>Tallenna</button>
            </div>
          </div>

          <div style={{ padding:"24px 20px 80px" }}>

            {/* ── ULKOASU ── */}
            <div className="s-section">
              <SecTitle>Ulkoasu</SecTitle>

              <div className="s-row">
                <RowLabel title="Taustakuva" sub={local.bgImage ? "Kuva asetettu" : "Ei taustakuvaa"} />
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {local.bgImage && (
                    <>
                      <div style={{ width:32, height:32, borderRadius:7, overflow:"hidden", border:"1px solid rgba(201,168,76,0.25)" }}>
                        <img src={local.bgImage} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                      </div>
                      <button onClick={() => set("bgImage", null)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.3)", fontSize:18, lineHeight:1 }}>×</button>
                    </>
                  )}
                  <button onClick={() => bgRef.current?.click()} style={{ background:"none", border:"1px solid rgba(201,168,76,0.25)", borderRadius:8, padding:"6px 12px", color:"rgba(201,168,76,0.55)", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.12em", cursor:"pointer" }}>
                    {local.bgImage ? "Vaihda" : "Valitse"}
                  </button>
                </div>
                <input ref={bgRef} type="file" accept="image/*" onChange={handleBgPhoto} style={{ display:"none" }} />
              </div>

              <div className="s-row" style={{ borderBottom:"none" }}>
                <RowLabel title="Kello" sub="Aika vasemmassa yläkulmassa" />
                <Toggle value={local.showClock !== false} onChange={v => set("showClock", v)} />
              </div>
            </div>

            {/* ── ELIELIN AURA ── */}
            <div className="s-section">
              <SecTitle>Elielin Aura</SecTitle>
              <p style={{ color:"rgba(201,168,76,0.45)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"0 0 20px", lineHeight:1.6 }}>
                Eliel loistaa valitsemassasi sävyssä. Aura ei muuta hänen persoonaansa — vain sen miten hän näyttäytyy sinulle.
              </p>

              {/* Preview */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
                <div className="aura-preview-ring" style={{ "--ac":aura.shadow, "--ac2":aura.shadow.replace("0.8","0.3"), border:`1.5px solid ${aura.color}44`, boxShadow:`0 0 20px ${aura.shadow}, 0 0 40px ${aura.shadow.replace("0.8","0.3")}` }}>
                  <img src="/ElielGold.png" style={{ width:72, height:72, objectFit:"contain", filter:`${ELIEL_TIER_FILTERS[userTier]} drop-shadow(0 0 8px ${aura.color})` }} alt="Eliel" />
                </div>
              </div>

              {/* Current Eliel tier label */}
              <p style={{ color:"rgba(201,168,76,0.4)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", textAlign:"center", margin:"0 0 16px" }}>
                {userTier === 'member' ? '◈ Hopea — Member' : userTier === 'builder' ? '✦ Kulta — Builder' : '✸ Timantti — MasterBuilder'}
              </p>

              <div style={{ display:"flex", gap:5 }}>
                {AURAS.map(a => {
                  const locked = !isUnlocked(a.unlockedAt)
                  return (
                    <button key={a.id}
                      className={`aura-btn ${local.aura===a.id?"selected":""}`}
                      onClick={() => !locked && set("aura", a.id)}
                      style={{
                        border: local.aura===a.id ? `1.5px solid ${a.color}` : "1.5px solid rgba(201,168,76,0.08)",
                        opacity: locked ? 0.35 : 1,
                        cursor: locked ? "default" : "pointer",
                        position:"relative",
                      }}
                    >
                      <div className="aura-orb" style={{ background:`radial-gradient(circle at 35% 35%, ${a.color}, ${a.color}55)`, boxShadow:local.aura===a.id?`0 0 12px ${a.shadow}`:"none", filter:locked?"grayscale(1)":"none" }}/>
                      <span style={{ color:local.aura===a.id?a.color:"rgba(201,168,76,0.45)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em" }}>{a.name}</span>
                      {locked && (
                        <span style={{ color:"rgba(201,168,76,0.4)", fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:"0.08em", textAlign:"center", lineHeight:1.2 }}>
                          🔒 {TIER_LABELS[a.unlockedAt]}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── PIKAKOMENOT ── */}
            <div className="s-section">
              <SecTitle>Elielin pikakomenot</SecTitle>
              <p style={{ color:"rgba(201,168,76,0.45)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"0 0 14px", lineHeight:1.6 }}>
                Näkyvät Eliel-sivulla pikanapin alla. Paina nappia niin Eliel reagoi suoraan.
              </p>
              {[0,1,2].map(i => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ color:"rgba(201,168,76,0.25)", fontFamily:"'Cinzel',serif", fontSize:10, width:14, textAlign:"center", flexShrink:0 }}>{i+1}</span>
                  <input
                    value={local.shortcuts?.[i] || ""}
                    onChange={e => { const sc=[...(local.shortcuts||["","",""])]; sc[i]=e.target.value; set("shortcuts",sc); }}
                    placeholder={["Inspiroi minua","Miten meni päivä?","Mitä tänään?"][i]}
                    style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,168,76,0.18)", borderRadius:9, padding:"8px 12px", color:"rgba(201,168,76,0.8)", fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:"none", letterSpacing:"0.03em" }}
                  />
                  {(local.shortcuts?.[i]) && (
                    <button onClick={() => { const sc=[...(local.shortcuts||["","",""])]; sc[i]=""; set("shortcuts",sc); }} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.25)", fontSize:16, lineHeight:1 }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {/* ── ELIEL ASETUKSET ── */}
            <div className="s-section">
              <SecTitle>Eliel — Asetukset</SecTitle>

              {/* Communication mode */}
              <div style={{ marginBottom:16 }}>
                <p style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.07em", margin:"0 0 10px" }}>Kommunikoinnin oletus</p>
                <div style={{ display:"flex", gap:8 }}>
                  {[['text','✍ Kirjoitus'],['voice','🎙 Puhe']].map(([val,label]) => (
                    <button key={val} onClick={() => set("elielMode", val)} style={{
                      flex:1, padding:"11px 8px",
                      background: local.elielMode===val ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.02)",
                      border: local.elielMode===val ? `1.5px solid ${GOLD}` : "1px solid rgba(201,168,76,0.18)",
                      borderRadius:10, cursor:"pointer",
                      color: local.elielMode===val ? GOLD : "rgba(201,168,76,0.45)",
                      fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.08em",
                      transition:"all 0.2s",
                    }}>{label}</button>
                  ))}
                </div>
                <p style={{ color:"rgba(201,168,76,0.35)", fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:"italic", margin:"8px 0 0", lineHeight:1.5 }}>
                  Voit aina vaihtaa tapaa hetkellisesti Eliel-sivulla.
                </p>
              </div>

              {/* Mic permission */}
              <div className="s-row">
                <RowLabel title="Salli mikrofonin käyttö" sub="Tarvitaan puheella kommunikointiin" />
                <Toggle value={local.allowMic||false} onChange={async v => {
                  if(v) {
                    try {
                      await navigator.mediaDevices.getUserMedia({audio:true});
                      set("allowMic", true);
                    } catch { set("allowMic", false); }
                  } else { set("allowMic", false); }
                }}/>
              </div>

              {/* Camera permission */}
              <div className="s-row" style={{ borderBottom:"none" }}>
                <RowLabel title="Salli kameran käyttö" sub="Profiilikuva, klubikuvat, kuvat Elielille" />
                <Toggle value={local.allowCamera||false} onChange={async v => {
                  if(v) {
                    try {
                      await navigator.mediaDevices.getUserMedia({video:true});
                      set("allowCamera", true);
                    } catch { set("allowCamera", false); }
                  } else { set("allowCamera", false); }
                }}/>
              </div>
            </div>


            <div className="s-section">
              <SecTitle>Ilmoitukset</SecTitle>

              {/* Master toggle */}
              <div className="s-row" style={{ marginBottom:4 }}>
                <RowLabel title="Salli push-ilmoitukset" sub="Pääkytkin kaikille ilmoituksille" />
                <Toggle value={local.pushNotifications||false} onChange={v => set("pushNotifications", v)} />
              </div>

              {/* Sub-items — only visible when push is on */}
              {local.pushNotifications && (
                <div className="notif-sub">
                  {NOTIF_ITEMS.map(item => (
                    <div key={item.key} className="s-row">
                      <RowLabel title={item.label} sub={item.sub} />
                      <Toggle value={local[item.key]||false} onChange={v => set(item.key, v)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── YKSITYISYYS ── */}
            <div className="s-section">
              <SecTitle>Yksityisyys</SecTitle>
              <div className="s-row">
                <RowLabel title="Elielin muisti" sub="Eliel muistaa aiemmat keskustelusi" />
                <Toggle value={local.elielMemory!==false} onChange={v => set("elielMemory", v)} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0, marginTop:16 }}>
                <button className="danger-btn" onClick={() => { if(window.confirm("Tyhjentääkö Elielin muistin?")) set("elielMemoryCleared", true); }}>
                  Tyhjennä Elielin muisti
                </button>
                <button className="danger-btn" onClick={() => { if(window.confirm("Poistetaanko kaikki profiilidata? Toimintoa ei voi perua.")) { localStorage.clear(); window.location.reload(); } }}>
                  Poista kaikki data
                </button>
              </div>
            </div>

            {/* ── JÄSENYYS ── */}
            <div>
              <SecTitle>Jäsenyys</SecTitle>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:13, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em" }}>◈ Member</span>
                  <span style={{ color:"rgba(201,168,76,0.4)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.14em" }}>AKTIIVINEN</span>
                </div>
                <p style={{ color:"rgba(201,168,76,0.45)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"0 0 14px", lineHeight:1.5 }}>
                  Päivitä tasoa saadaksesi enemmän ominaisuuksia.
                </p>
                <button style={{ width:"100%", padding:"10px 0", background:"rgba(107,29,46,0.25)", border:"1px solid rgba(201,168,76,0.3)", borderRadius:10, color:GOLD, fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer" }}>
                  Katso tasot → Shop
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}