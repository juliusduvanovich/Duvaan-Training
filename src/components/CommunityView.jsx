import { useState } from "react";
import ScrollPicker, { TimePicker } from "./ScrollPicker";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');

  @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes todayText {
    0% { color:#C9A84C; } 25% { color:#e8d5a3; }
    50% { color:#ff6eb4; } 75% { color:#6eb4ff; } 100% { color:#C9A84C; }
  }
  @keyframes breatheBtn {
    0%,100% { transform:translateY(0) scale(1); }
    50%     { transform:translateY(-3px) scale(1.012); }
  }
  @keyframes pulseDot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.5; transform:scale(0.7); }
  }

  .community-tab {
    background: none; border: none; cursor: pointer;
    padding: 8px 0; flex: 1; text-align: center;
    font-family: 'Cinzel', serif; font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #C9A84C;
    border-bottom: 1px solid transparent;
    transition: all 0.3s;
  }
  .community-tab.active {
    color: #C9A84C;
    border-bottom: 1px solid #C9A84C;
    animation: todayText 8s ease-in-out infinite;
  }
  .post-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.45);
    border-radius: 16px; overflow: hidden;
    animation: breatheBtn 6s ease-in-out infinite;
  }
  .comment-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: #C9A84C; font-family: 'Cormorant Garamond', serif;
    font-size: 14px; letter-spacing: 0.04em;
  }
  .comment-input::placeholder { color: #C9A84C; font-style: italic; }
  .chat-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: #C9A84C; font-family: 'Cormorant Garamond', serif;
    font-size: 14px; letter-spacing: 0.04em;
  }
  .chat-input::placeholder { color: #C9A84C; font-style: italic; }
  .chat-msg {
    padding: 8px 0;
    border-bottom: 0.5px solid rgba(201,168,76,0.35);
    animation: fadeInUp 0.3s ease both;
  }
  .text-field {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.03);
    border: 1.5px solid #C9A84C;
    border-radius: 12px; padding: 12px 16px;
    color: #C9A84C; font-family: 'Cinzel', serif;
    font-size: 13px; outline: none; letter-spacing: 0.04em;
  }
  .text-field::placeholder { color: #C9A84C; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; }
  .text-field:focus { border-color: #C9A84C; }
  .tag-btn {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.6);
    border-radius: 20px; padding: 6px 14px; cursor: pointer;
    color: rgba(201,168,76,0.9); font-family: 'Cinzel', serif;
    font-size: 9px; letter-spacing: 0.1em; transition: all 0.2s;
  }
  .tag-btn.selected {
    background: rgba(201,168,76,0.35);
    border-color: #C9A84C;
    color: #C9A84C; transform: scale(1.04);
  }
  .club-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.45);
    border-radius: 14px; padding: 14px 16px;
    animation: breatheBtn 6s ease-in-out infinite;
  }
`;

const ALL_TAGS = [
  'Sports','Gastronomy','Philosophy','Business','Music',
  'Wellness','Art','Technology','Finance','Travel',
  'Mindfulness','Nutrition','Running','Film','Fashion',
];

const MOCK_POSTS = [
  {
    id: 1, author: "Duvaan", verified: true, time: "2h",
    text: "Studio session 3. Uusi biisi alkaa hahmottua — se on jotain mitä ette odota. 🔥",
    likes: 142, liked: false,
    comments: [
      { id: 1, author: "Maria K.", text: "Ei voi odottaa enää 🙏", time: "1h" },
      { id: 2, author: "Aleksi V.", text: "King 👑", time: "45min" },
    ]
  },
  {
    id: 2, author: "Duvaan", verified: true, time: "1d",
    text: "Helsinki City Run — ilmoittautumiset auki. Voittaja saa liput Duvaan-keikalle + Coti-paketti.",
    likes: 287, liked: false,
    comments: [
      { id: 1, author: "Joonas H.", text: "Olen mukana 💪", time: "20h" },
      { id: 2, author: "Elisa M.", text: "Juoksen sen sinulle 🏃‍♀️", time: "18h" },
    ]
  },
  {
    id: 3, author: "Julius", verified: true, time: "3d",
    text: "Aamulenkki 6km. Pää selkeni. Nämä hetket ovat pyhiä.",
    likes: 198, liked: false,
    comments: [{ id: 1, author: "Samu T.", text: "Inspiroivaa 🌅", time: "3d" }]
  },
];

const MOCK_CHAT = [
  { id: 1, author: "Maria K.", text: "Koska seuraava keikka? 🔥", time: "14:22" },
  { id: 2, author: "Aleksi V.", text: "Tää appi on sick", time: "14:24" },
  { id: 3, author: "Duvaan", text: "Pian. Pysykää kuulolla 👀", time: "14:31", verified: true },
  { id: 4, author: "Joonas H.", text: "King 👑", time: "14:32" },
];

const MOCK_SERVICES = {
  10: [ // Helsinki Runners
    { id: 1, name: "Guided City Run", desc: "10km ohjattu kaupunkilenkki, kaikki tasot", duration: "90 min", price: 15, spots: 12, spotsLeft: 4, category: "Running" },
    { id: 2, name: "Interval Training", desc: "Tehokas intervallitreeni Kaivopuistossa", duration: "60 min", price: 12, spots: 8, spotsLeft: 8, category: "Sports" },
  ],
  11: [ // Sound & Soul
    { id: 3, name: "Yksityinen kitaratunti", desc: "1-1 tunti kokeneen muusikon kanssa", duration: "60 min", price: 55, spots: 1, spotsLeft: 1, category: "Music" },
    { id: 4, name: "Yhteissoitto-sessio", desc: "Pienryhmä jam-sessio, max 5 henkilöä", duration: "120 min", price: 25, spots: 5, spotsLeft: 2, category: "Music" },
  ],
  12: [ // Good Food Club
    { id: 5, name: "Private Dining Experience", desc: "Eksklusiivinen illallinen kokki-isännän kanssa", duration: "3h", price: 85, spots: 6, spotsLeft: 3, category: "Gastronomy" },
    { id: 6, name: "Ruoanlaittotunti", desc: "Opi uusi keittiön taito", duration: "2h", price: 45, spots: 4, spotsLeft: 4, category: "Gastronomy" },
  ],
  13: [ // Mind & Body
    { id: 7, name: "Yksityinen tanssitunti", desc: "1-1 sessio ammattitanssijan kanssa", duration: "60 min", price: 65, spots: 1, spotsLeft: 1, category: "Wellness" },
    { id: 8, name: "Ryhmäjoogaclass", desc: "Max 8 henkilön aamu-joogasessio", duration: "75 min", price: 18, spots: 8, spotsLeft: 5, category: "Mindfulness" },
    { id: 9, name: "Personal Training", desc: "Henkilökohtainen treeniohjelma + sessio", duration: "60 min", price: 70, spots: 1, spotsLeft: 1, category: "Sports" },
  ],
  14: [ // Builders
    { id: 10, name: "Bisnes-mentoring", desc: "1h strateginen sparrailu kokeneen yrittäjän kanssa", duration: "60 min", price: 120, spots: 1, spotsLeft: 1, category: "Business" },
  ],
}

const MOCK_PUBLIC_CLUBS = [
  { id: 10, name: 'Helsinki Runners', desc: 'Kaupunkilenkit ja juoksuhaasteet', tags: ['Running','Sports','Wellness'], members: 142, active: true },
  { id: 11, name: 'Sound & Soul', desc: 'Musiikki, luovuus ja yhteistyö', tags: ['Music','Art','Philosophy'], members: 89, active: false },
  { id: 12, name: 'Good Food Club', desc: 'Gastronomia, reseptit ja pop-upit', tags: ['Gastronomy','Travel','Business'], members: 214, active: true },
  { id: 13, name: 'Mind & Body', desc: 'Mindfulness, meditaatio ja hyvinvointi', tags: ['Mindfulness','Wellness','Nutrition'], members: 67, active: false },
  { id: 14, name: 'Builders', desc: 'Yrittäjät, rakentajat ja unelmoijat', tags: ['Business','Technology','Finance'], members: 301, active: true },
  { id: 15, name: 'Visual Art Collective', desc: 'Taide, valokuvaus ja estetiikka', tags: ['Art','Fashion','Film'], members: 55, active: false },
];

const SECTIONS = ['Duvaan Club', 'Private', 'Clubs', 'Events'];

export default function CommunityView({ onNavigate }) {
  const [section, setSection] = useState(0);
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", paddingBottom: 80, fontFamily: "'Cinzel', serif" }}>
        <div style={{ padding: "48px 24px 0", animation: "fadeInUp 0.6s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h2 style={{ color: GOLD, fontSize: "22px", fontWeight: 700, letterSpacing: "0.1em", margin: 0, animation: "todayText 8s ease-in-out infinite" }}>Community</h2>
              <p style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "0.14em", margin: "4px 0 0", textTransform: "uppercase" }}>
                {new Date().toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6effa0", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ color: "rgba(110,255,160,0.7)", fontSize: "9px", letterSpacing: "0.14em" }}>LIVE</span>
            </div>
          </div>
          <div style={{ display: "flex", borderBottom: "0.5px solid rgba(201,168,76,0.35)" }}>
            {SECTIONS.map((s, i) => (
              <button key={i} className={`community-tab ${section === i ? 'active' : ''}`} onClick={() => setSection(i)}>{s}</button>
            ))}
          </div>
        </div>

        {section === 0 && <DuvaanClub />}
        {section === 1 && <Private />}
        {section === 2 && <PublicClubs />}
        {section === 3 && <Events />}
      </div>
    </>
  );
}

// ─── DUVAAN ROOM ────────────────────────────────────────────────────────────
function DuvaanClub() {
  const [view, setView] = useState('feed');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [chat, setChat] = useState(MOCK_CHAT);
  const [chatMsg, setChatMsg] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChat(c => [...c, { id: Date.now(), author: "Julius", text: chatMsg.trim(), time: new Date().toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMsg('');
  };

  const addComment = (postId) => {
    if (!commentText.trim()) return;
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author: "Julius", text: commentText.trim(), time: "juuri nyt" }] } : p));
    setCommentText('');
  };

  const likePost = (postId) => setPosts(ps => ps.map(p => p.id === postId ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));

  return (
    <div style={{ padding: "0 0 20px" }}>
      <div style={{ display: "flex", gap: 0, padding: "16px 24px 0", marginBottom: "16px" }}>
        {['Feed', 'Chat'].map(v => (
          <button key={v} onClick={() => setView(v.toLowerCase())} style={{
            background: "none", border: "none", cursor: "pointer", padding: "6px 16px 6px 0",
            color: view === v.toLowerCase() ? GOLD : "#C9A84C",
            fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase",
            borderBottom: view === v.toLowerCase() ? `1px solid ${GOLD}` : "1px solid transparent", transition: "all 0.3s",
          }}>{v}</button>
        ))}
      </div>

      {view === 'feed' && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 16px" }}>
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6B1D2E, #C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontFamily: "'Cinzel', serif", fontWeight: 700, marginRight: 10 }}>
                  {post.author[0]}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: GOLD, fontSize: 13, fontFamily: "'Cinzel', serif", fontWeight: 600, letterSpacing: "0.06em" }}>{post.author}</span>
                    {post.verified && <span style={{ color: "#6eb4ff", fontSize: 10 }}>✦</span>}
                  </div>
                  <span style={{ color: "#C9A84C", fontSize: 10, fontFamily: "'Cormorant Garamond', serif" }}>{post.time} sitten</span>
                </div>
              </div>
              <div style={{ padding: "0 16px 12px" }}>
                <p style={{ color: "#C9A84C", fontSize: 15, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.65, margin: 0 }}>{post.text}</p>
              </div>
              <div style={{ padding: "10px 16px", borderTop: "0.5px solid rgba(201,168,76,0.25)", display: "flex", gap: 20, alignItems: "center" }}>
                <button onClick={() => likePost(post.id)} style={{ background: "none", border: "none", cursor: "pointer", color: post.liked ? "#ff6eb4" : "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.1em" }}>♥ {post.likes}</button>
                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.1em" }}>◇ {post.comments.length}</button>
              </div>
              {expandedPost === post.id && (
                <div style={{ borderTop: "0.5px solid rgba(201,168,76,0.25)" }}>
                  {post.comments.map(c => (
                    <div key={c.id} style={{ padding: "10px 16px", borderBottom: "0.5px solid rgba(201,168,76,0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ color: GOLD, fontSize: 11, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>{c.author}</span>
                        <span style={{ color: "#C9A84C", fontSize: 10, fontFamily: "'Cormorant Garamond', serif" }}>{c.time}</span>
                      </div>
                      <p style={{ color: "#C9A84C", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", margin: 0, lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  ))}
                  <div style={{ padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                    <input className="comment-input" placeholder="Kommentoi..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addComment(post.id)} />
                    <button onClick={() => addComment(post.id)} style={{ background: BURGUNDY, border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 14 14"><path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill="#C9A84C"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === 'chat' && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 240px)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
            {chat.map(msg => (
              <div key={msg.id} className="chat-msg">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: GOLD, fontSize: 11, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>{msg.author}</span>
                    {msg.verified && <span style={{ color: "#6eb4ff", fontSize: 9 }}>✦</span>}
                  </div>
                  <span style={{ color: "#C9A84C", fontSize: 10, fontFamily: "'Cormorant Garamond', serif" }}>{msg.time}</span>
                </div>
                <p style={{ color: "#C9A84C", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(201,168,76,0.12)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.6)", borderRadius: 24, padding: "8px 8px 8px 16px" }}>
              <input className="chat-input" placeholder="Kirjoita viesti..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} />
              <button onClick={sendChat} style={{ background: BURGUNDY, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill="#C9A84C"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOMIES ─────────────────────────────────────────────────────────────────
function Private() {
  const [view, setView] = useState('list'); // list | create
  const [clubs, setClubs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('duvaan_my_clubs') || '[]') } catch { return [] }
  });
  const [form, setForm] = useState({ name: '', desc: '', tags: [] });
  const [created, setCreated] = useState(false);

  const toggleTag = tag => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));

  const handleCreate = () => {
    if (!form.name.trim() || form.tags.length === 0) return;
    const newClub = { id: Date.now(), name: form.name.trim(), desc: form.desc.trim(), tags: form.tags, members: 1, active: false, createdAt: new Date().toLocaleDateString('fi-FI') };
    const updated = [...clubs, newClub];
    setClubs(updated);
    localStorage.setItem('duvaan_my_clubs', JSON.stringify(updated));
    setCreated(true);
    setTimeout(() => { setView('list'); setCreated(false); setForm({ name: '', desc: '', tags: [] }); }, 1500);
  };

  const deleteClub = (id) => {
    const updated = clubs.filter(c => c.id !== id);
    setClubs(updated);
    localStorage.setItem('duvaan_my_clubs', JSON.stringify(updated));
  };

  if (view === 'create') return (
    <div style={{ padding: "16px 16px 40px", animation: "fadeInUp 0.4s ease both" }}>
      <button onClick={() => setView('list')} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,76,0.9)", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.14em", marginBottom: 20, padding: 0 }}>← Takaisin</button>
      <h3 style={{ color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 4px" }}>Create a Club</h3>
      <p style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", margin: "0 0 24px" }}>Yksityinen tila sinulle ja kavereillesi — vain kutsulla.</p>

      <div style={{ marginBottom: 14 }}>
        <p style={{ color: "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 7px" }}>Nimi</p>
        <input className="text-field" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Club name..." />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 7px" }}>Kuvaus</p>
        <textarea className="text-field" value={form.desc} onChange={e => setForm(f => ({...f, desc: e.target.value}))} placeholder="Mistä klubissa on kyse..." rows={2} style={{ resize: "none" }} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ color: "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>Aiheet</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {ALL_TAGS.map(tag => (
            <button key={tag} className={`tag-btn ${form.tags.includes(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
          ))}
        </div>
        {form.tags.length > 0 && (
          <p style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", margin: "10px 0 0" }}>
            Klubisi resonoi: {form.tags.join(', ')}
          </p>
        )}
      </div>

      {created ? (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <p style={{ color: "#6effa0", fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: "0.1em" }}>✓ Klubi luotu</p>
        </div>
      ) : (
        <button onClick={handleCreate} disabled={!form.name.trim() || form.tags.length === 0} style={{
          width: "100%", padding: 16, background: form.name.trim() && form.tags.length > 0 ? BURGUNDY : "rgba(107,29,46,0.2)",
          border: "1.5px solid rgba(201,168,76,0.9)", borderRadius: 16,
          color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
          cursor: form.name.trim() && form.tags.length > 0 ? "pointer" : "default",
          opacity: form.name.trim() && form.tags.length > 0 ? 1 : 0.35,
        }}>Create Club</button>
      )}
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 40px", animation: "fadeInUp 0.4s ease both" }}>
      <button onClick={() => setView('create')} style={{
        width: "100%", padding: "14px 0", marginBottom: 24,
        background: "rgba(107,29,46,0.2)", border: "1.5px solid #C9A84C",
        borderRadius: 14, color: GOLD, fontFamily: "'Cinzel', serif",
        fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer",
      }}>+ Create a Club</button>

      {clubs.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <p style={{ color: "rgba(201,168,76,0.6)", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic" }}>
            Ei klubeja vielä. Luo oma tai kutsu kaveri.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {clubs.map(club => (
            <div key={club.id} className="club-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>{club.name}</span>
                <button onClick={() => deleteClub(club.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,76,0.6)", fontSize: 14, padding: "0 0 0 8px" }}>×</button>
              </div>
              {club.desc && <p style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", margin: "0 0 10px" }}>{club.desc}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                {club.tags.map(t => (
                  <span key={t} style={{ background: "rgba(201,168,76,0.35)", border: "0.5px solid rgba(201,168,76,0.45)", borderRadius: 20, padding: "3px 10px", color: "#C9A84C", fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: "0.1em" }}>{t}</span>
                ))}
              </div>
              <p style={{ color: "rgba(201,168,76,0.6)", fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: "0.1em", margin: 0 }}>Luotu {club.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PUBLIC CLUBS ────────────────────────────────────────────────────────────
function LocationPicker({ location, setLocation }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(location);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <span style={{ color:"rgba(201,168,76,0.6)", fontSize:13, fontFamily:"'Cormorant Garamond',serif" }}>📍</span>
      {editing ? (
        <>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if(e.key==='Enter'){ setLocation(draft); setEditing(false); } }}
            autoFocus
            placeholder="Kaupunki tai maa..."
            style={{
              flex:1, background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(201,168,76,0.5)", borderRadius:20,
              padding:"6px 14px", color:GOLD,
              fontFamily:"'Cormorant Garamond',serif", fontSize:13, outline:"none",
            }}
          />
          <button onClick={() => { setLocation(draft); setEditing(false); }} style={{
            background:BURGUNDY, border:"none", borderRadius:20,
            padding:"6px 14px", color:GOLD,
            fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.1em", cursor:"pointer",
          }}>OK</button>
        </>
      ) : (
        <button onClick={() => { setDraft(location); setEditing(true); }} style={{
          background:"none", border:"1px solid rgba(201,168,76,0.25)",
          borderRadius:20, padding:"5px 14px", cursor:"pointer",
          color:"rgba(201,168,76,0.8)", fontFamily:"'Cormorant Garamond',serif", fontSize:13,
        }}>
          {location || 'Valitse sijainti'} <span style={{ opacity:0.5, marginLeft:4 }}>✎</span>
        </button>
      )}
    </div>
  );
}


// ─── CLUB SERVICE VIEW ───────────────────────────────────────────────────────
function ClubServiceView({ club, services, onBack, onPurchase }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setDone(true);
    setTimeout(() => {
      // Add frequency points
      const current = parseInt(localStorage.getItem('duvaan_frequency') || '0');
      localStorage.setItem('duvaan_frequency', String(current + 20));
      onPurchase(selected);
    }, 1800);
  };

  if (confirming && selected) return (
    <div style={{ padding:"16px 16px 40px", animation:"fadeInUp 0.4s ease both" }}>
      <button onClick={() => setConfirming(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.7)", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.14em", marginBottom:20, padding:0 }}>← Takaisin</button>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,168,76,0.4)", borderRadius:20, padding:"24px 20px", marginBottom:16 }}>
        <p style={{ color:"rgba(201,168,76,0.6)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 6px" }}>Varauksen yhteenveto</p>
        <h3 style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:700, margin:"0 0 4px" }}>{selected.name}</h3>
        <p style={{ color:"rgba(201,168,76,0.75)", fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:"italic", margin:"0 0 20px" }}>{club.name}</p>

        <div style={{ borderTop:"0.5px solid rgba(201,168,76,0.15)", borderBottom:"0.5px solid rgba(201,168,76,0.15)", padding:"14px 0", marginBottom:20 }}>
          {[
            ["Kesto", selected.duration],
            ["Hinta", selected.price + "€"],
            ["Frequency", "+20 pistettä"],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"rgba(201,168,76,0.6)", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.1em" }}>{label}</span>
              <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:600 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Payment method mock */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:12, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:24, background:"linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", border:"0.5px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color:"#fff", fontSize:7, fontWeight:700, letterSpacing:"0.05em" }}>VISA</span>
              </div>
              <span style={{ color:"rgba(201,168,76,0.8)", fontFamily:"'Cinzel',serif", fontSize:11 }}>•••• 4242</span>
            </div>
            <span style={{ color:"rgba(201,168,76,0.5)", fontFamily:"'Cinzel',serif", fontSize:9 }}>Vaihda</span>
          </div>
        </div>

        {done ? (
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <p style={{ color:"#6effa0", fontFamily:"'Cinzel',serif", fontSize:14, letterSpacing:"0.1em", margin:0 }}>✓ Varattu — tervetuloa!</p>
            <p style={{ color:"rgba(110,255,160,0.6)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"6px 0 0" }}>+20 Frequency-pistettä lisätty</p>
          </div>
        ) : (
          <button onClick={handleConfirm} style={{
            width:"100%", padding:"16px 0",
            background:GOLD, border:"none", borderRadius:14,
            color:"#080808", fontFamily:"'Cinzel',serif",
            fontSize:12, fontWeight:700, letterSpacing:"0.18em",
            textTransform:"uppercase", cursor:"pointer",
          }}>
            Vahvista — {selected.price}€
          </button>
        )}

        <p style={{ color:"rgba(201,168,76,0.35)", fontFamily:"'Cormorant Garamond',serif", fontSize:11, textAlign:"center", margin:"10px 0 0", fontStyle:"italic" }}>
          Maksunkäsittely suojattu · Stripe
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"16px 16px 40px", animation:"fadeInUp 0.4s ease both" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.7)", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.14em", marginBottom:16, padding:0 }}>← Takaisin</button>

      <div style={{ marginBottom:20 }}>
        <h3 style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:700, letterSpacing:"0.08em", margin:"0 0 4px" }}>{club.name}</h3>
        <p style={{ color:"rgba(201,168,76,0.65)", fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:"italic", margin:0 }}>{club.desc}</p>
      </div>

      <p style={{ color:"rgba(201,168,76,0.6)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 12px" }}>Palvelut</p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {services.map(service => (
          <div key={service.id} style={{
            background: selected?.id === service.id ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
            border: selected?.id === service.id ? "1px solid rgba(201,168,76,0.6)" : "1px solid rgba(201,168,76,0.25)",
            borderRadius:16, padding:"16px 18px",
            cursor:"pointer", transition:"all 0.2s",
            animation:"breatheBtn 6s ease-in-out infinite",
          }} onClick={() => setSelected(service)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:600, letterSpacing:"0.06em" }}>{service.name}</span>
              <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700 }}>{service.price}€</span>
            </div>
            <p style={{ color:"rgba(201,168,76,0.8)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"0 0 10px" }}>{service.desc}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ color:"rgba(201,168,76,0.6)", fontFamily:"'Cinzel',serif", fontSize:9, background:"rgba(201,168,76,0.08)", padding:"3px 10px", borderRadius:20 }}>{service.duration}</span>
                <span style={{ color: service.spotsLeft < 3 ? "#ff9a6e" : "rgba(201,168,76,0.6)", fontFamily:"'Cinzel',serif", fontSize:9, background:"rgba(201,168,76,0.08)", padding:"3px 10px", borderRadius:20 }}>
                  {service.spotsLeft} paikkaa
                </span>
              </div>
              {selected?.id === service.id && (
                <span style={{ color:"#6effa0", fontFamily:"'Cinzel',serif", fontSize:9 }}>✓ Valittu</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <button onClick={() => setConfirming(true)} style={{
          width:"100%", padding:"15px 0", marginTop:16,
          background:GOLD, border:"none", borderRadius:14,
          color:"#080808", fontFamily:"'Cinzel',serif",
          fontSize:12, fontWeight:700, letterSpacing:"0.18em",
          textTransform:"uppercase", cursor:"pointer",
        }}>
          Varaa — {selected.price}€
        </button>
      )}
    </div>
  );
}

function PublicClubs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [location, setLocation] = useState(() => localStorage.getItem('duvaan_location') || 'Helsinki');
  const [selectedClub, setSelectedClub] = useState(null);
  const [purchasedService, setPurchasedService] = useState(null);

  const saveLocation = (loc) => { setLocation(loc); localStorage.setItem('duvaan_location', loc); };
  const allTags = [...new Set(MOCK_PUBLIC_CLUBS.flatMap(c => c.tags))];
  const filtered = MOCK_PUBLIC_CLUBS.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || c.tags.includes(filter))
  );

  if (selectedClub) return (
    <ClubServiceView
      club={selectedClub}
      services={MOCK_SERVICES[selectedClub.id] || []}
      onBack={() => setSelectedClub(null)}
      onPurchase={(service) => { setPurchasedService(service); setSelectedClub(null); }}
    />
  );

  return (
    <div style={{ padding:"16px 16px 40px", animation:"fadeInUp 0.4s ease both" }}>
      {purchasedService && (
        <div style={{ background:"rgba(110,255,160,0.06)", border:"1px solid rgba(110,255,160,0.3)", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:16 }}>✓</span>
          <div>
            <p style={{ color:"#6effa0", fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:600, margin:0 }}>{purchasedService.name} varattu</p>
            <p style={{ color:"rgba(110,255,160,0.7)", fontFamily:"'Cormorant Garamond',serif", fontSize:12, margin:"2px 0 0" }}>+20 Frequency-pistettä kirjattu</p>
          </div>
        </div>
      )}

      <p style={{ color:"rgba(201,168,76,0.7)", fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:"italic", margin:"0 0 10px" }}>
        Löydä klubeja ja ihmisiä jotka resonoivat.
      </p>

      <LocationPicker location={location} setLocation={saveLocation} />

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Etsi klubeja..." style={{
        width:"100%", boxSizing:"border-box", marginBottom:12,
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,168,76,0.3)",
        borderRadius:24, padding:"10px 16px", color:GOLD,
        fontFamily:"'Cormorant Garamond',serif", fontSize:14, outline:"none",
      }} />

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
        {allTags.map(t => (
          <button key={t} className={`tag-btn ${filter === t ? 'selected' : ''}`} onClick={() => setFilter(filter === t ? null : t)}>{t}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(club => (
          <div key={club.id} className="club-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div>
                <span style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:600, letterSpacing:"0.06em" }}>{club.name}</span>
                {club.active && <span style={{ marginLeft:8, fontSize:8, color:"#6effa0" }}>● LIVE</span>}
              </div>
              <span style={{ color:"rgba(201,168,76,0.8)", fontFamily:"'Cinzel',serif", fontSize:9 }}>{club.members} jäsentä</span>
            </div>
            <p style={{ color:"rgba(201,168,76,0.75)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", margin:"0 0 10px" }}>{club.desc}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
              {club.tags.map(t => (
                <span key={t} style={{ background:"rgba(201,168,76,0.08)", border:"0.5px solid rgba(201,168,76,0.35)", borderRadius:20, padding:"3px 10px", color:GOLD, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em" }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ background:"rgba(107,29,46,0.3)", border:"1px solid rgba(201,168,76,0.35)", borderRadius:20, padding:"7px 16px", cursor:"pointer", color:GOLD, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase" }}>
                Liity
              </button>
              {MOCK_SERVICES[club.id] && (
                <button onClick={() => setSelectedClub(club)} style={{
                  background:"rgba(201,168,76,0.1)", border:"1.5px solid rgba(201,168,76,0.6)",
                  borderRadius:20, padding:"7px 18px", cursor:"pointer",
                  color:GOLD, fontFamily:"'Cinzel',serif", fontSize:9,
                  letterSpacing:"0.14em", textTransform:"uppercase",
                }}>
                  Palvelut →
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color:"rgba(201,168,76,0.5)", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", textAlign:"center", marginTop:20 }}>
            Ei tuloksia — kokeile eri hakua.
          </p>
        )}
      </div>
    </div>
  );
}




const MOCK_EVENTS = [
  { id:1, name:'Duvaan Live — Helsinki', desc:'Eksklusiivinen keikka Duvaan-jäsenille.', date:'2025-05-15', time:'20:00', location:'Tavastia, Helsinki', capacity:300, attending:187, free:false, price:'15€', tags:['Music'], type:'public', dresscode:'Dark & elegant', deadline:'2025-05-10', host:'Duvaan', verified:true },
  { id:2, name:'Helsinki Runners — 10km', desc:'Yhteinen kaupunkilenkki. Kaikki tasot tervetulleita.', date:'2025-05-08', time:'07:00', location:'Esplanadi, Helsinki', capacity:50, attending:23, free:true, price:null, tags:['Running','Sports'], type:'public', dresscode:null, deadline:'2025-05-07', host:'Helsinki Runners', verified:false },
  { id:3, name:'Mind & Body — Jooga & Aamiainen', desc:'Aamu-jooga + terveellinen aamiainen yhteisön kanssa.', date:'2025-05-10', time:'08:30', location:'Studio Flow, Helsinki', capacity:20, attending:14, free:false, price:'22€', tags:['Mindfulness','Wellness'], type:'public', dresscode:null, deadline:'2025-05-09', host:'Mind & Body', verified:false },
]



function PricePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(value);
  const handleChange = (v) => { setVal(v); onChange(v); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
      <button onClick={() => setOpen(!open)} style={{
        background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(201,168,76,0.5)",
        borderRadius:12, padding:"12px 16px", color:"#C9A84C",
        fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:600,
        letterSpacing:"0.06em", cursor:"pointer", width:"100%", textAlign:"center",
      }}>{val}€</button>
      {open && (
        <div style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(201,168,76,0.35)", borderRadius:14, padding:"8px 12px" }}>
          <ScrollPicker value={val} onChange={handleChange} min={1} max={500} step={1} unit="€" />
          <button onClick={() => setOpen(false)} style={{
            width:"100%", marginTop:8, padding:"10px 0",
            background:"rgba(201,168,76,0.1)", border:"1px solid rgba(201,168,76,0.4)",
            borderRadius:10, color:"#C9A84C", fontFamily:"'Cinzel',serif",
            fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer",
          }}>Valmis</button>
        </div>
      )}
    </div>
  );
}

function CapacityPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(value);

  const handleChange = (v) => { setVal(v); onChange(v); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
      <button onClick={() => setOpen(!open)} style={{
        background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(201,168,76,0.5)",
        borderRadius:12, padding:"12px 16px", color:"#C9A84C",
        fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:600,
        letterSpacing:"0.06em", cursor:"pointer", width:"100%", textAlign:"center",
      }}>
        {val} hlö
      </button>
      {open && (
        <div style={{ background:"rgba(12,12,12,0.97)", border:"1px solid rgba(201,168,76,0.35)", borderRadius:14, padding:"8px 12px" }}>
          <ScrollPicker value={val} onChange={handleChange} min={1} max={500} step={1} unit=" hlö" />
          <button onClick={() => setOpen(false)} style={{
            width:"100%", marginTop:8, padding:"10px 0",
            background:"rgba(201,168,76,0.1)", border:"1px solid rgba(201,168,76,0.4)",
            borderRadius:10, color:"#C9A84C", fontFamily:"'Cinzel',serif",
            fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer",
          }}>Valmis</button>
        </div>
      )}
    </div>
  );
}

function Events() {
  const [view, setView] = useState('list')
  const [location, setLocation] = useState(() => localStorage.getItem('duvaan_location') || 'Helsinki')
  const saveLocation = (loc) => { setLocation(loc); localStorage.setItem('duvaan_location', loc) }
  const [events, setEvents] = useState(() => {
    try { return [...MOCK_EVENTS, ...JSON.parse(localStorage.getItem('duvaan_events') || '[]')] } catch { return MOCK_EVENTS }
  })
  const [form, setForm] = useState({ name:'', desc:'', date:'', time:'', location:'', capacity:'', free:true, price:'', tags:[], type:'public', dresscode:'', deadline:'' })
  const [created, setCreated] = useState(false)

  const toggleTag = tag => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t=>t!==tag) : [...f.tags, tag] }))

  const handleCreate = () => {
    if (!form.name.trim() || !form.date || !form.location) return
    const newEvent = { id:Date.now(), ...form, capacity:parseInt(form.capacity)||0, attending:0, host:'Julius', verified:true, price:form.free?null:form.price }
    const stored = JSON.parse(localStorage.getItem('duvaan_events')||'[]')
    localStorage.setItem('duvaan_events', JSON.stringify([...stored, newEvent]))
    setEvents([...MOCK_EVENTS, ...stored, newEvent])
    setCreated(true)
    setTimeout(() => { setView('list'); setCreated(false); setForm({ name:'',desc:'',date:'',time:'',location:'',capacity:'',free:true,price:'',tags:[],type:'public',dresscode:'',deadline:'' }) }, 1500)
  }

  const canCreate = form.name.trim() && form.date && form.location.trim()

  if (view === 'create') return (
    <div style={{ padding:"16px 16px 60px", animation:"fadeInUp 0.4s ease both" }}>
      <button onClick={()=>setView('list')} style={{ background:"none",border:"none",cursor:"pointer",color:GOLD,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.14em",marginBottom:20,padding:0 }}>← Takaisin</button>
      <h3 style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700,letterSpacing:"0.1em",margin:"0 0 4px" }}>Create Event</h3>
      <p style={{ color:"rgba(201,168,76,0.7)",fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontStyle:"italic",margin:"0 0 22px" }}>Luo tapahtuma klubillesi tai koko yhteisölle.</p>

      {[["Nimi *","name","Event name..."],["Sijainti *","location","Missä tapahtuu..."],["Dress Code","dresscode","Dark & elegant, casual..."]].map(([label,field,ph]) => (
        <div key={field} style={{ marginBottom:14 }}>
          <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>{label}</p>
          <input className="text-field" value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph} />
        </div>
      ))}

      <div style={{ marginBottom:14 }}>
        <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>Kuvaus</p>
        <textarea className="text-field" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Mistä on kyse..." rows={2} style={{ resize:"none" }} />
      </div>

      <div style={{ display:"flex",gap:10,marginBottom:14 }}>
        <div style={{ flex:1 }}>
          <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>Päivämäärä *</p>
          <input className="text-field" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ colorScheme:"dark" }} />
        </div>
        <div style={{ flex:1 }}>
          <TimePicker label="Kellonaika" value={form.time || "12:00"} onChange={v=>setForm(f=>({...f,time:v}))} />
        </div>
      </div>

      <div style={{ display:"flex",gap:10,marginBottom:14 }}>
        <div style={{ flex:1 }}>
          <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>Kapasiteetti</p>
          <CapacityPicker
            value={parseInt(form.capacity) || 20}
            onChange={v => setForm(f => ({...f, capacity: String(v)}))}
          />


        </div>
        <div style={{ flex:1 }}>
          <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>RSVP deadline</p>
          <input className="text-field" type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} style={{ colorScheme:"dark" }} />
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>Tyyppi</p>
        <div style={{ display:"flex",gap:8 }}>
          {[['public','Julkinen'],['private','Yksityinen']].map(([val,label]) => (
            <button key={val} onClick={()=>setForm(f=>({...f,type:val}))} style={{ flex:1,padding:"10px 8px",cursor:"pointer",background:form.type===val?"rgba(201,168,76,0.1)":"rgba(255,255,255,0.02)",border:form.type===val?"1.5px solid #C9A84C":"1px solid rgba(201,168,76,0.4)",borderRadius:12,color:form.type===val?GOLD:"rgba(201,168,76,0.7)",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.1em" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 7px" }}>Hinta</p>
        <div style={{ display:"flex",gap:8,marginBottom:8 }}>
          {[[true,'Ilmainen'],[false,'Maksullinen']].map(([val,label]) => (
            <button key={String(val)} onClick={()=>setForm(f=>({...f,free:val}))} style={{ flex:1,padding:"10px 8px",cursor:"pointer",background:form.free===val?"rgba(201,168,76,0.1)":"rgba(255,255,255,0.02)",border:form.free===val?"1.5px solid #C9A84C":"1px solid rgba(201,168,76,0.4)",borderRadius:12,color:form.free===val?GOLD:"rgba(201,168,76,0.7)",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.1em" }}>{label}</button>
          ))}
        </div>
        {!form.free && (
          <PricePicker
            value={parseFloat(form.price) || 10}
            onChange={v => setForm(f => ({...f, price: v + '€'}))}
          />


        )}
      </div>

      <div style={{ marginBottom:28 }}>
        <p style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 10px" }}>Kategoria</p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
          {ALL_TAGS.map(tag => (
            <button key={tag} className={`tag-btn ${form.tags.includes(tag)?'selected':''}`} onClick={()=>toggleTag(tag)}>{tag}</button>
          ))}
        </div>
      </div>

      {created ? (
        <div style={{ textAlign:"center",padding:"16px 0" }}>
          <p style={{ color:"#6effa0",fontFamily:"'Cinzel',serif",fontSize:13,letterSpacing:"0.1em" }}>✓ Tapahtuma luotu</p>
        </div>
      ) : (
        <button onClick={handleCreate} disabled={!canCreate} style={{ width:"100%",padding:16,background:canCreate?BURGUNDY:"rgba(107,29,46,0.2)",border:"1.5px solid rgba(201,168,76,0.5)",borderRadius:16,color:GOLD,fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",cursor:canCreate?"pointer":"default",opacity:canCreate?1:0.35 }}>Create Event</button>
      )}
    </div>
  )

  return (
    <div style={{ padding:"16px 16px 40px", animation:"fadeInUp 0.4s ease both" }}>
      <button onClick={()=>setView('create')} style={{ width:"100%",padding:"14px 0",marginBottom:14,background:"rgba(107,29,46,0.2)",border:"1.5px solid rgba(201,168,76,0.5)",borderRadius:14,color:GOLD,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer" }}>+ Create Event</button>

      <LocationPicker location={location} setLocation={saveLocation} />

      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {events.map(ev => {
          const spotsLeft = ev.capacity ? ev.capacity - ev.attending : null
          const full = spotsLeft !== null && spotsLeft <= 0
          const dateStr = new Date(ev.date).toLocaleDateString('fi-FI', { weekday:'short', day:'numeric', month:'long' })
          return (
            <div key={ev.id} className="club-card">
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                <div>
                  <span style={{ color:GOLD,fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,letterSpacing:"0.06em" }}>{ev.name}</span>
                  {ev.verified && <span style={{ color:"#6eb4ff",fontSize:10,marginLeft:6 }}>✦</span>}
                </div>
                <span style={{ color:ev.free?"#6effa0":GOLD,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:600 }}>{ev.free?'Ilmainen':ev.price}</span>
              </div>
              {ev.desc && <p style={{ color:GOLD,fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",margin:"0 0 10px",lineHeight:1.5 }}>{ev.desc}</p>}
              <div style={{ display:"flex",flexDirection:"column",gap:4,marginBottom:10 }}>
                <span style={{ color:GOLD,fontFamily:"'Cormorant Garamond',serif",fontSize:13 }}>📅 {dateStr}{ev.time?` · klo ${ev.time}`:''}</span>
                <span style={{ color:GOLD,fontFamily:"'Cormorant Garamond',serif",fontSize:13 }}>📍 {ev.location}</span>
                {ev.dresscode && <span style={{ color:"rgba(201,168,76,0.8)",fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontStyle:"italic" }}>👔 {ev.dresscode}</span>}
                {ev.deadline && <span style={{ color:"rgba(201,168,76,0.7)",fontFamily:"'Cormorant Garamond',serif",fontSize:12 }}>RSVP: {new Date(ev.deadline).toLocaleDateString('fi-FI',{day:'numeric',month:'long'})}</span>}
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
                {ev.tags.map(t => <span key={t} style={{ background:"rgba(201,168,76,0.08)",border:"0.5px solid rgba(201,168,76,0.35)",borderRadius:20,padding:"3px 10px",color:GOLD,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.1em" }}>{t}</span>)}
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                {spotsLeft!==null && <span style={{ color:full?"#ff6eb4":GOLD,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.1em" }}>{full?'Täynnä':`${spotsLeft} paikkaa jäljellä`}</span>}
                <button disabled={full} style={{ background:full?"rgba(255,255,255,0.03)":BURGUNDY,border:"1px solid rgba(201,168,76,0.5)",borderRadius:20,padding:"8px 20px",cursor:full?"default":"pointer",color:full?"rgba(201,168,76,0.4)":GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",opacity:full?0.5:1 }}>
                  {full?'Täynnä':'Ilmoittaudu'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
      <p style={{ color: "#C9A84C", fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label} — tulossa
      </p>
    </div>
  );
}