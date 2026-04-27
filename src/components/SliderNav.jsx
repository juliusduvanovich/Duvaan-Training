import { useRef, useEffect, useState, useCallback } from "react";

/**
 * SliderNav — animated sliding underline with electric streak effect.
 *
 * Props:
 *   tabs        – array of { id, label }
 *   active      – current active tab id
 *   onChange    – (id) => void
 *   auraColor   – hex string for active color
 *   rightSlot   – optional React node rendered to the right (e.g. gear icon)
 */
export default function SliderNav({ tabs, active, onChange, auraColor = "#C9A84C", rightSlot }) {
  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const [lineState, setLineState] = useState({ x: 0, w: 0 });
  const [prevLineState, setPrevLineState] = useState(null);
  const [streaking, setStreaking] = useState(false);
  const streakTimer = useRef(null);
  const initialized = useRef(false);

  const measureActive = useCallback(() => {
    const container = containerRef.current;
    const el = tabRefs.current[active];
    if (!container || !el) return null;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - containerRect.left,
      w: elRect.width,
    };
  }, [active]);

  useEffect(() => {
    const next = measureActive();
    if (!next) return;

    if (!initialized.current) {
      // First render — no animation, just place it
      setLineState(next);
      initialized.current = true;
      return;
    }

    // Save prev for streak source
    setPrevLineState(lineState);

    // Trigger streak
    clearTimeout(streakTimer.current);
    setStreaking(true);
    streakTimer.current = setTimeout(() => setStreaking(false), 420);

    setLineState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Recalculate on resize
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const next = measureActive();
      if (next) setLineState(next);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureActive]);

  // Streak travels from prev center to next center
  const streakStyle = streaking && prevLineState
    ? {
        position: "absolute",
        bottom: 0,
        height: 1,
        left: prevLineState.x + prevLineState.w / 2,
        width: 0,
        background: `linear-gradient(90deg, transparent, ${auraColor}, ${auraColor}ff, transparent)`,
        boxShadow: `0 0 8px 2px ${auraColor}cc`,
        transform: `translateX(${lineState.x + lineState.w / 2 - (prevLineState.x + prevLineState.w / 2)}px)`,
        transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.42s ease",
        opacity: 0,
        pointerEvents: "none",
      }
    : null;

  // Animate streak expansion: start thin at source, expand toward target
  const streakActiveStyle = streaking && prevLineState
    ? {
        position: "absolute",
        bottom: 0,
        height: 1.5,
        left: Math.min(prevLineState.x + prevLineState.w / 2, lineState.x + lineState.w / 2),
        width: Math.abs(
          (lineState.x + lineState.w / 2) - (prevLineState.x + prevLineState.w / 2)
        ),
        background: `linear-gradient(90deg, transparent, ${auraColor}88, ${auraColor}, ${auraColor}88, transparent)`,
        boxShadow: `0 0 10px 2px ${auraColor}99`,
        pointerEvents: "none",
        borderRadius: 2,
        animation: "streakFade 0.38s ease-out forwards",
      }
    : null;

  return (
    <>
      <style>{`
        @keyframes streakFade {
          0%   { opacity: 1; transform: scaleX(0.1); }
          40%  { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(1); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          marginBottom: 0,
          position: "relative",
          paddingBottom: 6,
        }}
      >
        {/* Full-width curved blade underline — gold base */}
        <svg
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: 7,
            overflow: "visible",
            pointerEvents: "none",
          }}
          viewBox="0 0 100 7"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="navLineGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0"/>
              <stop offset="10%"  stopColor="#C9A84C" stopOpacity="0.5"/>
              <stop offset="50%"  stopColor="#C9A84C" stopOpacity="0.7"/>
              <stop offset="90%"  stopColor="#C9A84C" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Gold base curve */}
          <path
            d="M0,6 Q50,2 100,6"
            fill="none"
            stroke="url(#navLineGoldGrad)"
            strokeWidth="1.5"
            strokeLinecap="butt"
          />
        </svg>
        {/* Tab buttons */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flex: 1,
            position: "relative",
            overflow: "visible",
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => { if (el) tabRefs.current[tab.id] = el; }}
                onClick={() => onChange(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 18px 12px 0",
                  fontFamily: "'Cinzel', serif",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  color: isActive ? auraColor : "rgba(201,168,76,0.55)",
                  textShadow: isActive ? `0 0 12px ${auraColor}88` : "none",
                  transition: "color 0.25s, text-shadow 0.25s, font-weight 0.15s",
                  position: "relative",
                }}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Aura hot spot — follows active tab */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              height: 2.5,
              left: lineState.x,
              width: lineState.w,
              background: `linear-gradient(90deg, transparent, ${auraColor}99, ${auraColor}, ${auraColor}99, transparent)`,
              boxShadow: `0 0 10px ${auraColor}aa`,
              transition: "left 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: "none",
            }}
          />

          {/* Electric streak */}
          {streaking && prevLineState && streakActiveStyle && (
            <div style={streakActiveStyle} />
          )}
        </div>

        {/* Right slot (e.g. settings gear) */}
        {rightSlot && (
          <div style={{ paddingBottom: 8, paddingLeft: 12, flexShrink: 0 }}>
            {rightSlot}
          </div>
        )}
      </div>
    </>
  );
}