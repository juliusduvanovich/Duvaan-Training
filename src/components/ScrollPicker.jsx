import { useRef, useState, useEffect, useCallback } from "react";

const ITEM_H = 36;
const VISIBLE = 5;

function SinglePicker({ items, value, onChange, fmt, unit = "" }) {
  const getIdx = (val) => {
    const c = items.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
    return Math.max(0, items.indexOf(c));
  };

  const [idx, setIdx] = useState(() => getIdx(value));
  const [offset, setOffset] = useState(0);
  const drag = useRef({ active: false, startY: 0, startIdx: 0, lastY: 0, vel: 0, lastT: 0 });
  const raf = useRef(null);
  const ref = useRef(null);
  const pad = Math.floor(VISIBLE / 2);
  const H = ITEM_H * VISIBLE;

  const commit = useCallback((i) => {
    const c = Math.max(0, Math.min(items.length - 1, i));
    setOffset(0); setIdx(c); onChange(items[c]);
  }, [items, onChange]);

  const onDown = useCallback((e) => {
    cancelAnimationFrame(raf.current);
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    drag.current = { active: true, startY: y, startIdx: idx, lastY: y, vel: 0, lastT: Date.now() };
    e.preventDefault();
  }, [idx]);

  const onMove = useCallback((e) => {
    if (!drag.current.active) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dt = Math.max(1, Date.now() - drag.current.lastT);
    drag.current.vel = (y - drag.current.lastY) / dt * 16;
    drag.current.lastY = y; drag.current.lastT = Date.now();
    const dy = y - drag.current.startY;
    const raw = drag.current.startIdx - dy / ITEM_H;
    const ni = Math.max(0, Math.min(items.length - 1, Math.round(raw)));
    setOffset(-(raw - ni) * ITEM_H); setIdx(ni);
    e.preventDefault();
  }, [items.length]);

  const onUp = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    let vel = drag.current.vel; let cur = idx;
    if (Math.abs(vel) > 1.5) {
      const coast = () => {
        vel *= 0.78;
        if (Math.abs(vel) < 0.4) { commit(cur); return; }
        cur = Math.max(0, Math.min(items.length - 1, Math.round(cur - vel / ITEM_H)));
        setIdx(cur); raf.current = requestAnimationFrame(coast);
      };
      raf.current = requestAnimationFrame(coast);
    } else commit(idx);
  }, [idx, items.length, commit]);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener('touchstart', onDown, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onUp);
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onDown, onMove, onUp]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const translateY = -idx * ITEM_H + pad * ITEM_H + offset;

  return (
    <div ref={ref} style={{ height:H, overflow:"hidden", position:"relative", flex:1, cursor:"ns-resize", userSelect:"none", touchAction:"none" }}>
      <div style={{ position:"absolute", top:pad*ITEM_H, left:0, right:0, height:ITEM_H, background:"rgba(201,168,76,0.1)", borderTop:"0.5px solid rgba(201,168,76,0.5)", borderBottom:"0.5px solid rgba(201,168,76,0.5)", pointerEvents:"none", zIndex:2 }} />
      <div style={{ position:"absolute", top:0, left:0, right:0, height:pad*ITEM_H, background:"linear-gradient(to bottom,rgba(8,8,8,0.95),rgba(8,8,8,0.1))", pointerEvents:"none", zIndex:3 }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:pad*ITEM_H, background:"linear-gradient(to top,rgba(8,8,8,0.95),rgba(8,8,8,0.1))", pointerEvents:"none", zIndex:3 }} />
      <div style={{ transform:`translateY(${translateY}px)`, willChange:"transform" }}>
        {items.map((item, i) => {
          const dist = Math.abs(i - idx); const sel = dist === 0;
          return (
            <div key={i} onClick={() => commit(i)} style={{
              height:ITEM_H, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Cinzel',serif", letterSpacing:"0.04em", cursor:"pointer",
              fontSize: sel ? 17 : dist === 1 ? 14 : 12,
              fontWeight: sel ? 700 : 400,
              color: sel ? "#C9A84C" : dist === 1 ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.2)",
            }}>
              {fmt ? fmt(item) : item}{unit}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCROLL PICKER (number) ──────────────────────────────────────────────────
export default function ScrollPicker({ value, onChange, min = 0, max = 100, step = 1, unit = "", label = "" }) {
  const items = [];
  for (let v = min; v <= max; v = Math.round((v + step) * 1000) / 1000) items.push(v);
  const fmt = (v) => step < 1 ? v.toFixed(1) : String(v);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flex:1 }}>
      {label && <p style={{ color:"rgba(201,168,76,0.7)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", margin:0 }}>{label}</p>}
      <div style={{ width:"100%", borderRadius:12, background:"rgba(255,255,255,0.03)", overflow:"hidden" }}>
        <SinglePicker items={items} value={value} onChange={onChange} fmt={fmt} unit={unit} />
      </div>
    </div>
  );
}

// ─── TIME PICKER ─────────────────────────────────────────────────────────────
export function TimePicker({ value = "12:00", onChange, label = "" }) {
  const [open, setOpen] = useState(false);
  const parts = value.split(':');
  const [h, setH] = useState(parseInt(parts[0]) || 12);
  const [m, setM] = useState(parseInt(parts[1]) || 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const mins  = Array.from({ length: 12 }, (_, i) => i * 5);

  const fmt2 = (v) => String(v).padStart(2, '0');

  const handleH = (v) => { setH(v); onChange(`${fmt2(v)}:${fmt2(m)}`); };
  const handleM = (v) => { setM(v); onChange(`${fmt2(h)}:${fmt2(v)}`); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
      {label && <p style={{ color:"rgba(201,168,76,0.7)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", margin:0 }}>{label}</p>}

      {/* Display value - tap to open */}
      <button onClick={() => setOpen(!open)} style={{
        background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(201,168,76,0.5)",
        borderRadius:12, padding:"12px 16px", color:"#C9A84C",
        fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:600,
        letterSpacing:"0.06em", cursor:"pointer", width:"100%", textAlign:"center",
      }}>
        {fmt2(h)}:{fmt2(m)}
      </button>

      {/* Picker panel */}
      {open && (
        <div style={{
          background:"rgba(12,12,12,0.97)", border:"1px solid rgba(201,168,76,0.35)",
          borderRadius:14, padding:"8px 12px", overflow:"hidden",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:0 }}>
            <SinglePicker items={hours} value={h} onChange={handleH} fmt={fmt2} />
            <div style={{ color:"#C9A84C", fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:700, padding:"0 4px", flexShrink:0 }}>:</div>
            <SinglePicker items={mins} value={mins.includes(m) ? m : 0} onChange={handleM} fmt={fmt2} />
          </div>
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