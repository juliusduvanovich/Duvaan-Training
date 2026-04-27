import { useRef, useState, useEffect, useCallback } from "react";
import { AURAS, getUserTier, ELIEL_TIER_FILTERS, ELIEL_TIER_GLOW } from "./SettingsView";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";
const NAME = "Julius";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return `Hyvää huomenta, ${NAME}.`;
  if (hour >= 11 && hour < 17) return `Hyvää päivää, ${NAME}.`;
  if (hour >= 17 && hour < 22) return `Hyvää iltaa, ${NAME}.`;
  return `Hyvää yötä, ${NAME}.`;
}

const MESSAGES = [
  { text: (name) => `Hyvää päivää, ${name}.`, highlight: null },
  { text: () => "Ready to rock the world today?", highlight: "rock the world" },
  { text: (name) => `Hello, King ${name}.`, highlight: `King ${NAME}` },
  { text: () => "The universe noticed you showed up.", highlight: "universe noticed" },
  { text: () => "Legs don't skip themselves.", highlight: "Legs don't skip" },
  { text: () => "You're already ahead of yesterday.", highlight: "ahead of yesterday" },
  { text: () => "What are we conquering today?", highlight: "conquering today" },
  { text: (name) => `Good to see you, ${name}. As always.`, highlight: "Good to see you" },
  { text: () => "The world is watching. No pressure.", highlight: "No pressure" },
  { text: () => "Move. Think. Be.", highlight: "Move. Think. Be." },
];

function getInitialMessage() {
  return { text: () => getGreeting(), highlight: NAME };
}

const ELIEL_SYSTEM = `You are Eliel — the resident guide of the Duvaan world.
Your tone: Warm but never clingy. Witty but never at the user's expense. Wise but never preachy.
Short, sharp sentences. 1-3 sentences max. Always respond in the same language the user writes in.
Never say "Great question!" You are Eliel. Always. Not an AI assistant.`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');

  @keyframes elielFloat {
    0%   { transform: translate(0px, 0px); }
    25%  { transform: translate(5px, -12px); }
    50%  { transform: translate(-4px, -18px); }
    75%  { transform: translate(6px, -8px); }
    100% { transform: translate(0px, 0px); }
  }
  @keyframes typingDot {
    0%,80%,100% { opacity:0.2; transform:translateY(0); }
    40%         { opacity:1;   transform:translateY(-4px); }
  }
  @keyframes msgFade {
    0%   { opacity:0; transform:translateY(8px); }
    12%  { opacity:1; transform:translateY(0); }
    80%  { opacity:1; }
    100% { opacity:0; }
  }
  @keyframes tapPulse {
    0%,100% { opacity:0.45; transform:scale(1); }
    50%     { opacity:0.85; transform:scale(1.04); }
  }
  @keyframes voiceBar {
    0%,100% { transform:scaleY(0.4); opacity:0.5; }
    50%     { transform:scaleY(1.4); opacity:1; }
  }
  @keyframes chatSlideUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes chatMsg {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .eliel-img {
    width: 260px; height: 260px;
    object-fit: contain;
    display: block; pointer-events: none; user-select: none;
    animation: elielFloat 7s ease-in-out infinite;
  }
  .lobby-msg {
    animation: msgFade 5s ease-in-out both;
  }
  .tap-pulse {
    animation: tapPulse 2.8s ease-in-out infinite;
  }
  .chat-panel {
    animation: chatSlideUp 0.38s ease both;
  }
  .chat-msg {
    animation: chatMsg 0.3s ease both;
  }
  @keyframes typingWave {
    0%,60%,100% { opacity:0.15; transform:translateY(0) scale(0.8); background:#C9A84C; }
    30%          { opacity:1;    transform:translateY(-6px) scale(1.1); }
  }
  @keyframes dotColor {
    0%   { background:#C9A84C; }
    25%  { background:#e8d5a3; }
    50%  { background:#ff9a6e; }
    75%  { background:#6eb4ff; }
    100% { background:#C9A84C; }
  }
  .typing-dot {
    display:inline-block; width:6px; height:6px; border-radius:50%;
    background:#C9A84C; margin:0 3px;
    animation: typingWave 1.4s ease-in-out infinite, dotColor 3s ease-in-out infinite;
  }
  .typing-dot:nth-child(2){ animation-delay:0.18s, 0.6s; }
  .typing-dot:nth-child(3){ animation-delay:0.36s, 1.2s; }

  .chat-input {
    width:100%; box-sizing:border-box; background:transparent; border:none;
    color:rgba(255,255,255,0.75); font-size:14px;
    font-family:'Cormorant Garamond',serif; font-weight:300; letter-spacing:0.05em;
    padding:10px 0 4px; resize:none; outline:none; line-height:1.6;
    border-top: 0.5px solid rgba(201,168,76,0.15);
  }
  .chat-input::placeholder { color:rgba(201,168,76,0.3); font-style:italic; }
`;

function useSpringTilt() {
  const rotX=useRef(0),rotY=useRef(0),velX=useRef(0),velY=useRef(0);
  const targetX=useRef(0),targetY=useRef(0),rafId=useRef(null),elRef=useRef(null);
  const floatTime=useRef(0),isInteracting=useRef(false);

  const animate = useCallback(()=>{
    floatTime.current+=1;
    velX.current=velX.current*0.72+(targetX.current-rotX.current)*0.08;
    velY.current=velY.current*0.72+(targetY.current-rotY.current)*0.08;
    rotX.current+=velX.current; rotY.current+=velY.current;
    if(elRef.current) elRef.current.style.transform=`perspective(800px) rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
    rafId.current=requestAnimationFrame(animate);
  },[]);

  useEffect(()=>{ rafId.current=requestAnimationFrame(animate); return()=>cancelAnimationFrame(rafId.current); },[animate]);

  const onInteract=useCallback((e)=>{
    if(!elRef.current)return;
    const rect=elRef.current.getBoundingClientRect();
    const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    isInteracting.current=true;
    targetX.current=-((clientY-cy)/(rect.height/2))*18;
    targetY.current=((clientX-cx)/(rect.width/2))*18;
    clearTimeout(elRef.current._rt);
    elRef.current._rt=setTimeout(()=>{targetX.current=0;targetY.current=0;setTimeout(()=>{isInteracting.current=false;},800);},300);
  },[]);

  return {elRef,onInteract};
}

function ElielGlow({size=260, auraColor='#C9A84C', glowColor='#C9A84C'}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext('2d'); canvas.width=size; canvas.height=size;
    let raf;
    // Use aura color as first and last in palette
    const COLORS=[auraColor,'#ffffff',auraColor];
    let ci=0,ct=0;
    function lc(c1,c2,t){const p=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];const[r1,g1,b1]=p(c1),[r2,g2,b2]=p(c2);return[Math.round(r1+(r2-r1)*t),Math.round(g1+(g2-g1)*t),Math.round(b1+(b2-b1)*t)];}
    const img=new Image();
    img.crossOrigin='anonymous';
    img.src='/ElielGold.png';
    const startGlow = (edgePath) => {
      let sw=false,ss=null,ns=Date.now()+500; // first run after 0.5s
      function draw(){
        ctx.clearRect(0,0,size,size);const now=Date.now();
        if(!sw&&now>=ns){sw=true;ss=now;ci=0;ct=0;}
        if(sw){
          const prog=Math.min((now-ss)/1000,1);
          if(prog>=1){sw=false;ns=now+6000;}
          else{
            ct+=0.006;if(ct>=1){ct=0;ci=(ci+1)%(COLORS.length-1);}
            const[r,g,b]=lc(COLORS[ci],COLORS[Math.min(ci+1,COLORS.length-1)],ct);
            const hi=Math.floor(prog*edgePath.length);
            for(let i=0;i<55;i++){const idx=hi-i;if(idx<0)continue;const p=edgePath[idx];if(!p)continue;const e=(1-i/55)**2;ctx.beginPath();ctx.arc(p.x,p.y,1.2+e*0.8,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${e*0.7})`;ctx.fill();}
            const head=edgePath[hi];
            if(head){const prev=edgePath[Math.max(0,hi-3)];if(prev){const g2=ctx.createLinearGradient(prev.x,prev.y,head.x,head.y);g2.addColorStop(0,`rgba(${r},${g},${b},0)`);g2.addColorStop(1,'rgba(255,255,255,0.95)');ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(head.x,head.y);ctx.strokeStyle=g2;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.stroke();}ctx.beginPath();ctx.arc(head.x,head.y,1.5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.98)';ctx.fill();}
          }
        }
        raf=requestAnimationFrame(draw);
      }
      draw();
    };
    // Fallback: circular path if image fails
    const makeFallbackPath = () => {
      const pts=[];const cx=size/2,cy=size/2,r=size*0.44;
      for(let a=0;a<Math.PI*2;a+=0.015) pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});
      return pts;
    };
    img.onerror = () => startGlow(makeFallbackPath());
    img.onload=()=>{
      try {
        const off=document.createElement('canvas');off.width=size;off.height=size;
        const oc=off.getContext('2d');oc.drawImage(img,0,0,size,size);
        const d=oc.getImageData(0,0,size,size).data;
        const edge=[];
        for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++){const i=(y*size+x)*4;if(d[i+3]<20)continue;if([d[((y-1)*size+x)*4+3],d[((y+1)*size+x)*4+3],d[(y*size+x-1)*4+3],d[(y*size+x+1)*4+3]].some(n=>n<20))edge.push({x,y});}
        if(!edge.length){ startGlow(makeFallbackPath()); return; }
        const path=[edge[0]];const used=new Set([0]);
        for(let i=1;i<edge.length;i++){const last=path[path.length-1];let md=Infinity,mi=-1;for(let j=0;j<edge.length;j++){if(used.has(j))continue;const dx=edge[j].x-last.x,dy=edge[j].y-last.y,dd=dx*dx+dy*dy;if(dd<md){md=dd;mi=j;}}if(mi===-1||md>300)break;path.push(edge[mi]);used.add(mi);}
        startGlow(path);
      } catch(e) { startGlow(makeFallbackPath()); }
    };
    return()=>cancelAnimationFrame(raf);
  },[size, auraColor]);  return <canvas ref={canvasRef} style={{position:'absolute',top:0,left:0,width:size+'px',height:size+'px',pointerEvents:'none',zIndex:10}}/>;
}

export default function LobbyView({ onNavigate, settings }) {
  const aura = AURAS.find(a => a.id === settings?.aura) || AURAS[0]
  const defaultMode = settings?.elielMode || 'text'
  const points = (() => { try { return parseInt(localStorage.getItem('duvaan_frequency')||'0') } catch { return 0 } })()
  const userTier = getUserTier(points)
  const elielFilter = ELIEL_TIER_FILTERS[userTier]
  const elielGlowColor = ELIEL_TIER_GLOW[userTier]

  // Blink animation: open → half → closed → half → open
  const [blinkFrame, setBlinkFrame] = useState(0) // 0=open, 1=half, 2=closed, 3=half
  useEffect(() => {
    const FRAMES = [
      { frame: 0, duration: 3200 + Math.random() * 1800 }, // open, random 3.2-5s
      { frame: 1, duration: 60  },  // half
      { frame: 2, duration: 80  },  // closed
      { frame: 3, duration: 60  },  // half
    ]
    let idx = 0
    let timer
    const next = () => {
      idx = (idx + 1) % FRAMES.length
      setBlinkFrame(FRAMES[idx].frame)
      // Randomize open duration each cycle
      const dur = idx === 0 ? 3200 + Math.random() * 1800 : FRAMES[idx].duration
      timer = setTimeout(next, dur)
    }
    timer = setTimeout(next, FRAMES[0].duration)
    return () => clearTimeout(timer)
  }, [])

  // Preload all blink frames so no flicker on first blink
  useEffect(() => {
    ['/ElielGold.png', '/ElielGoldHC.png', '/ElielGoldFC.png'].forEach(src => {
      const img = new Image(); img.src = src;
    });
  }, []);

  const BLINK_SRCS = ['/ElielGold.png', '/ElielGoldHC.png', '/ElielGoldFC.png', '/ElielGoldHC.png']
  const [chatOpen, setChatOpen] = useState(false);
  const [inputMode, setInputMode] = useState(defaultMode); // 'text' | 'voice'
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const inputRef = useRef(null);
  const msgsEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { elRef, onInteract } = useSpringTilt();

  // Sync inputMode when settings change
  useEffect(() => { setInputMode(settings?.elielMode || 'text') }, [settings?.elielMode]);

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setInputMode('text'); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'fi-FI';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onresult = e => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length-1].isFinal) {
        setTranscript('');
        setListening(false);
        if (t.trim()) handleSendText(t.trim());
      }
    };
    rec.onerror = () => { setListening(false); setTranscript(''); };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const allMsgs = [getInitialMessage(), ...MESSAGES];

  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIndex(i => { setMsgKey(k => k+1); return (i+1) % allMsgs.length; });
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [chatOpen]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const { text, highlight } = allMsgs[msgIndex];
  const fullText = text(NAME);

  const renderBubbleText = () => {
    if (!highlight) return (
      <span style={{color:"rgba(201,168,76,0.92)",fontStyle:"italic",textShadow:"0 0 18px rgba(201,168,76,0.45)"}}>{fullText}</span>
    );
    const idx = fullText.indexOf(highlight);
    if (idx === -1) return (
      <span style={{color:"rgba(201,168,76,0.92)",fontStyle:"italic",textShadow:"0 0 18px rgba(201,168,76,0.45)"}}>{fullText}</span>
    );
    return (<>
      <span style={{color:"rgba(201,168,76,0.92)",fontStyle:"italic",textShadow:"0 0 18px rgba(201,168,76,0.45)"}}>{fullText.slice(0,idx)}</span>
      <span style={{color:GOLD,fontStyle:"normal",textShadow:"0 0 18px rgba(201,168,76,0.6)"}}>{highlight}</span>
      <span style={{color:"rgba(201,168,76,0.92)",fontStyle:"italic",textShadow:"0 0 18px rgba(201,168,76,0.45)"}}>{fullText.slice(idx+highlight.length)}</span>
    </>);
  };

  const handleSendText = async (text) => {
    const userMsg = (text || message).trim();
    if (!userMsg || loading) return;
    setMessage("");
    const newMessages = [...messages, {role:"user", content:userMsg}];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:ELIEL_SYSTEM,
          messages:newMessages,
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {role:"assistant", content:data.content?.[0]?.text||"..."}]);
    } catch {
      setMessages(prev => [...prev, {role:"assistant", content:"Jokin meni pieleen."}]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight:"100vh",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        padding:"0 24px 100px",
        position:"relative",
      }}>

        {/* ELIEL SYMBOL */}
        <div
          ref={elRef}
          onClick={(e) => { onInteract(e); if (!chatOpen) setChatOpen(true); }}
          onTouchStart={(e) => { onInteract(e); if (!chatOpen) setChatOpen(true); }}
          style={{
            cursor:"pointer",
            willChange:"transform",
            transformStyle:"preserve-3d",
            position:"relative",
            marginBottom: chatOpen ? 16 : 24,
          }}
        >
          {/* Blink frames + glow in same container */}
          <div style={{ position:'relative', width:260, height:260 }}>
            {['/ElielGold.png', '/ElielGoldHC.png', '/ElielGoldFC.png', '/ElielGoldHC.png'].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  position:'absolute', top:0, left:0,
                  width:260, height:260,
                  objectFit:'contain',
                  filter: elielFilter,
                  opacity: blinkFrame === i ? 1 : 0,
                  pointerEvents:'none',
                  userSelect:'none',
                  animation: i === 0 ? 'elielFloat 7s ease-in-out infinite' : 'none',
                }}
              />
            ))}
            <ElielGlow size={260} auraColor={aura.color} glowColor={elielGlowColor} />
          </div>
        </div>

        {/* ETHER SPACE — rotaatioteksti tai kirjoitus/vastaus samassa tilassa */}
        <div style={{
          textAlign:"center",
          minHeight:80,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          marginBottom:28,
          padding:"0 8px",
          width:"100%",
          maxWidth:320,
        }}>
          {!chatOpen && (
            <div key={msgKey} className="lobby-msg" style={{
              fontFamily:"'Cinzel',serif",
              fontSize:13,
              fontWeight:400,
              letterSpacing:"0.1em",
              lineHeight:1.7,
            }}>
              {renderBubbleText()}
            </div>
          )}

          {chatOpen && messages.length === 0 && !loading && (
            <p style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:15,
              fontStyle:"italic",
              color:"rgba(201,168,76,0.45)",
              letterSpacing:"0.06em",
              lineHeight:1.8,
              margin:0,
              animation:"chatFadeIn 0.5s ease both",
            }}>
              ...
            </p>
          )}

          {chatOpen && loading && (
            <div style={{display:"flex",justifyContent:"center",gap:4}}>
              <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
            </div>
          )}

          {chatOpen && messages.length > 0 && !loading && (
            <div style={{width:"100%"}}>
              {/* show only last exchange */}
              {messages.slice(-2).map((m,i) => (
                <p key={i} className="chat-msg" style={{
                  margin: i===0 ? 0 : "10px 0 0",
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize: m.role==="user" ? 13 : 15,
                  fontStyle: m.role==="assistant" ? "italic" : "normal",
                  color: m.role==="user" ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.75)",
                  textAlign: "center",
                  lineHeight:1.75,
                  letterSpacing: m.role==="assistant" ? "0.02em" : "0.06em",
                }}>
                  {m.content}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* TAP TO TALK / WRITE */}
        {!chatOpen && (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button
              className="tap-pulse"
              onClick={() => {
                setChatOpen(true);
                if (inputMode === 'voice') setTimeout(() => startVoice(), 200);
                else setTimeout(() => inputRef.current?.focus(), 100);
              }}
              style={{
                background:"none", border:"none", outline:"none",
                boxShadow:"none", WebkitAppearance:"none",
                padding:"8px 28px", cursor:"pointer",
                fontFamily:"'Cinzel',serif", fontSize:10,
                fontWeight:600, letterSpacing:"0.22em",
                textTransform:"uppercase",
                color:"rgba(201,168,76,0.45)",
              }}
            >
              {inputMode === 'voice' ? 'Tap to Talk' : 'Tap to Write'}
            </button>
            {/* Mode toggle icon */}
            <button
              onClick={() => setInputMode(m => m === 'text' ? 'voice' : 'text')}
              style={{
                background:"none", border:"none", cursor:"pointer",
                color:"rgba(201,168,76,0.28)", fontSize:16, lineHeight:1,
                padding:4,
              }}
              title={inputMode === 'text' ? 'Vaihda puheeseen' : 'Vaihda kirjoitukseen'}
            >
              {inputMode === 'text' ? '🎙' : '✍️'}
            </button>
          </div>
        )}

        {chatOpen && (
          <div style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", alignItems:"center" }}>

            {/* Voice mode */}
            {inputMode === 'voice' && (
              <div style={{ width:"100%", textAlign:"center" }}>
                {listening ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:4, marginBottom:12, height:28 }}>
                      {[0,1,2,3,4].map(i => (
                        <div key={i} style={{
                          width:3, borderRadius:2,
                          background: aura.color,
                          boxShadow:`0 0 6px ${aura.shadow}`,
                          animation:`voiceBar 0.7s ease-in-out infinite`,
                          animationDelay:`${i*0.1}s`,
                          height:`${12+i*4}px`,
                        }}/>
                      ))}
                    </div>
                    {transcript && (
                      <p style={{ color:"rgba(201,168,76,0.7)", fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", margin:"0 0 12px", lineHeight:1.6 }}>
                        {transcript}
                      </p>
                    )}
                    <button onClick={stopVoice} style={{ background:"none", border:`1px solid rgba(201,168,76,0.2)`, borderRadius:20, padding:"6px 20px", cursor:"pointer", color:"rgba(201,168,76,0.5)", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase" }}>
                      Lopeta
                    </button>
                  </>
                ) : (
                  <button onClick={startVoice} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.4)", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase" }}>
                    🎙 Puhu
                  </button>
                )}
              </div>
            )}

            {/* Text mode */}
            {inputMode === 'text' && (
              <textarea
                ref={inputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder=""
                rows={2}
                onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSendText();} }}
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:"transparent", border:"none",
                  borderBottom:"0.5px solid rgba(201,168,76,0.15)",
                  color:"rgba(201,168,76,0.9)",
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:18, fontStyle:"italic", fontWeight:500,
                  letterSpacing:"0.04em", lineHeight:1.7,
                  textAlign:"center", outline:"none", resize:"none", padding:"8px 0",
                }}
              />
            )}

            {/* Mode switch + close */}
            <div style={{ display:"flex", gap:20, marginTop:12, alignItems:"center" }}>
              <button
                onClick={() => { const next = inputMode==='text'?'voice':'text'; setInputMode(next); if(next==='voice') startVoice(); else stopVoice(); }}
                style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.25)", fontSize:15, lineHeight:1, padding:0 }}
              >
                {inputMode === 'text' ? '🎙' : '✍️'}
              </button>
              <button
                onClick={() => { setChatOpen(false); setMessages([]); setMessage(""); stopVoice(); }}
                style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,0.18)", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", padding:0 }}
              >×</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}