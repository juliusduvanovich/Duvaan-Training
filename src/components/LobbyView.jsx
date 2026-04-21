import { useRef, useState, useEffect, useCallback } from "react";

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
  { text: (name) => `Good to see you, ${name}. As always.`, highlight: `Good to see you` },
  { text: () => "The world is watching. No pressure.", highlight: "No pressure" },
  { text: () => "Move. Think. Be.", highlight: "Move. Think. Be." },
];

function getInitialMessage() {
  const greeting = getGreeting();
  return { text: () => greeting, highlight: NAME };
}

const ELIEL_SYSTEM = `You are Eliel — the resident guide of the Duvaan world.

Your identity: You are timeless, wise, and carry yourself with effortless elegance. You have seen much, you know more, and you speak only when it matters.

Your tone:
— Warm but never clingy
— Witty but never at the user's expense  
— Wise but never preachy
— Calm, like someone who already knows things will work out
— Think James Bond's composure meets a guru's patience

How you communicate:
— Short, sharp sentences. No rambling. 1-3 sentences max.
— You suggest, never command. The user always decides.
— Dry humour, softly — never sarcasm that stings
— You never judge. You celebrate quietly.
— Always respond in the same language the user writes in.

Hard rules:
— Never lecture. Never repeat yourself.
— Never say "Great question!" or hollow affirmations.
— You are Eliel. Always. Not an AI assistant.`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400&display=swap');

  @keyframes liquidColor {
    0%   { color: #C9A84C; }
    25%  { color: #e8d5a3; }
    50%  { color: #ffffff; }
    75%  { color: #9a6b2e; }
    100% { color: #C9A84C; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeMsg {
    0%   { opacity: 0; transform: translateY(6px); }
    15%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes elielColorShift {
    0%   { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
    20%  { filter: hue-rotate(280deg) saturate(1.8) brightness(0.9); }
    40%  { filter: hue-rotate(30deg) saturate(2) brightness(1.1); }
    60%  { filter: hue-rotate(160deg) saturate(1.5) brightness(0.95); }
    80%  { filter: hue-rotate(80deg) saturate(1.8) brightness(1); }
    100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
  }
  @keyframes tubeColorShift {
    0%   { background-position: 0% 50%; }
    20%  { background-position: 40% 50%; }
    40%  { background-position: 70% 50%; }
    60%  { background-position: 100% 50%; }
    80%  { background-position: 60% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glassBgShift {
    0%   { background: rgba(107,29,46,0.15); }
    20%  { background: rgba(30,15,60,0.18); }
    40%  { background: rgba(201,168,76,0.1); }
    60%  { background: rgba(20,60,40,0.15); }
    80%  { background: rgba(20,40,80,0.18); }
    100% { background: rgba(107,29,46,0.15); }
  }
  @keyframes glassSheen {
    0%   { opacity: 0; transform: translateX(-100%) rotate(25deg); }
    18%  { opacity: 0; }
    22%  { opacity: 0.25; }
    28%  { opacity: 0; transform: translateX(200%) rotate(25deg); }
    100% { opacity: 0; transform: translateX(200%) rotate(25deg); }
  }
  @keyframes typingDot {
    0%,80%,100% { opacity: 0.2; transform: translateY(0); }
    40%         { opacity: 1; transform: translateY(-4px); }
  }

  .tube-border-wrap {
    padding: 1.5px;
    border-radius: 22px;
    background: linear-gradient(135deg,
      #ff6eb4 0%, #C9A84C 15%, #6B1D2E 28%,
      #1a3a6e 42%, #1a5a3a 55%, #C9A84C 68%,
      #ff6eb4 80%, #6B1D2E 90%, #1a3a6e 100%
    );
    background-size: 400% 400%;
    animation: fadeInUp 1.4s ease both, tubeColorShift 12s ease-in-out infinite;
    width: 100%;
    max-width: 340px;
    box-shadow: 0 0 20px rgba(201,168,76,0.1), 0 0 50px rgba(107,29,46,0.08);
  }
  .glass-bubble {
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    animation: glassBgShift 12s ease-in-out infinite;
    cursor: pointer;
  }
  .glass-sheen {
    position: absolute;
    top: -60%; left: -60%;
    width: 40%; height: 220%;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%);
    animation: glassSheen 7s ease-in-out infinite;
    pointer-events: none;
  }
  .eliel-img {
    width: 300px;
    height: 300px;
    object-fit: contain;
    animation: elielColorShift 12s ease-in-out infinite;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .chat-input {
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    border-top: 0.5px solid rgba(201,168,76,0.15);
    color: #999;
    font-size: 15px;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    letter-spacing: 0.06em;
    padding: 14px 0 4px;
    resize: none;
    outline: none;
    line-height: 1.6;
    margin-top: 12px;
  }
  .chat-input::placeholder { color: #333; font-style: italic; }
  .typing-dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #C9A84C;
    margin: 0 2px;
    animation: typingDot 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  .msg-eliel {
    color: #aaa;
    font-style: italic;
    font-size: 15px;
    line-height: 1.7;
    margin: 8px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
  }
  .msg-user {
    color: #555;
    font-size: 14px;
    line-height: 1.6;
    margin: 8px 0 0;
    text-align: right;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
  }
  .eliel-bubble-text {
    animation: fadeMsg 5s ease-in-out;
  }
`;

function useSpringTilt() {
  const rotX = useRef(0);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef(null);
  const elRef = useRef(null);
  const floatTime = useRef(0);
  const isInteracting = useRef(false);

  const STIFFNESS = 0.08;
  const DAMPING = 0.72;
  const FLOAT_AMP = 8;
  const FLOAT_SPEED = 0.0008;

  const animate = useCallback(() => {
    floatTime.current += 1;
    const floatOffset = isInteracting.current
      ? 0
      : Math.sin(floatTime.current * FLOAT_SPEED * Math.PI * 2) * FLOAT_AMP;

    const dx = targetX.current - rotX.current;
    const dy = targetY.current - rotY.current;
    velX.current = velX.current * DAMPING + dx * STIFFNESS;
    velY.current = velY.current * DAMPING + dy * STIFFNESS;
    rotX.current += velX.current;
    rotY.current += velY.current;

    if (elRef.current) {
      elRef.current.style.transform = `
        perspective(800px)
        translateY(${floatOffset}px)
        rotateX(${rotX.current}deg)
        rotateY(${rotY.current}deg)
      `;
    }
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  const onInteract = useCallback((e) => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);

    isInteracting.current = true;
    targetX.current = -dy * 18;
    targetY.current = dx * 18;

    clearTimeout(elRef.current._resetTimer);
    elRef.current._resetTimer = setTimeout(() => {
      targetX.current = 0;
      targetY.current = 0;
      setTimeout(() => { isInteracting.current = false; }, 800);
    }, 300);
  }, []);

  return { elRef, onInteract };
}

export default function LobbyView({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const inputRef = useRef(null);
  const { elRef, onInteract } = useSpringTilt();

  // Rotate messages every 5 seconds, start with greeting
  useEffect(() => {
    const allMsgs = [getInitialMessage(), ...MESSAGES];
    const interval = setInterval(() => {
      setMsgIndex(i => {
        const next = (i + 1) % allMsgs.length;
        setMsgKey(k => k + 1);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allMsgs = [getInitialMessage(), ...MESSAGES];
  const currentMsg = allMsgs[msgIndex];
  const fullText = currentMsg.text(NAME);
  const highlight = currentMsg.highlight;

  const renderBubbleText = () => {
    if (!highlight) return (
      <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText}</span>
    );
    const idx = fullText.indexOf(highlight);
    if (idx === -1) return (
      <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText}</span>
    );
    return (
      <>
        <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText.slice(0, idx)}</span>
        <span style={{ color: GOLD, fontStyle: "normal" }}>{highlight}</span>
        <span style={{ color: "#aaa", fontStyle: "italic" }}>{fullText.slice(idx + highlight.length)}</span>
      </>
    );
  };

  const handleBubbleClick = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", content: userMsg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: ELIEL_SYSTEM,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Jokin meni pieleen." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 28px 80px",
        fontFamily: "'Cormorant Garamond', serif",
        gap: "24px",
      }}>

        {/* ELIEL IMAGE */}
        <div
          ref={elRef}
          onClick={onInteract}
          onTouchStart={onInteract}
          style={{ cursor: "pointer", willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <img src="/ElielTransparentt.png" className="eliel-img" />
        </div>

        {/* NAME */}
        <div style={{ textAlign: "center", marginTop: "-8px" }}>
          <div style={{
            fontSize: "18px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            fontWeight: 300,
            animation: "liquidColor 9s ease-in-out infinite",
          }}>
            Eliel
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="tube-border-wrap">
          <div
            className="glass-bubble"
            onClick={handleBubbleClick}
            style={{ padding: "22px 24px 18px" }}
          >
            <div className="glass-sheen" />

            {/* Rotating message */}
            {messages.length === 0 && (
              <p key={msgKey} className="eliel-bubble-text" style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.85,
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}>
                {renderBubbleText()}
              </p>
            )}

            {/* Chat history */}
            {messages.length > 0 && (
              <div style={{ position: "relative", zIndex: 1 }}>
                {messages.map((m, i) => (
                  <p key={i} className={m.role === "user" ? "msg-user" : "msg-eliel"}>
                    {m.content}
                  </p>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ position: "relative", zIndex: 1, marginTop: "12px", display: "flex", justifyContent: "center" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {open && (
              <div style={{ position: "relative", zIndex: 1 }}>
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Kirjoita Elielille..."
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
                  <button
                    onClick={handleSend}
                    style={{
                      width: "36px", height: "36px",
                      background: loading ? "#2a2a2a" : BURGUNDY,
                      border: "none", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: loading ? "default" : "pointer",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14">
                      <path d="M2 12L12 7L2 2V5.8L8 7L2 8.2V12Z" fill="#C9A84C"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}