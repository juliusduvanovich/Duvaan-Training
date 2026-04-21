import { useState, useRef, useEffect, useCallback } from "react";

const GOLD = "#C9A84C";
const STORAGE_KEY = "duvaan_profile";

const PROGRAM = [
  { day: 0, name: 'Maanantai', focus: 'Chest · Shoulder · Tricep', exercises: [
    { id: 'mon1', name: 'Pushups', sets: 3, reps: '20', weight: null },
    { id: 'mon2', name: 'OH Pushups', sets: 3, reps: '10', weight: null },
    { id: 'mon3', name: 'Dips', sets: 3, reps: '10', weight: null },
    { id: 'mon4', name: 'Arnold Press', sets: 3, reps: '10', weight: '9.5 kg' },
    { id: 'mon5', name: 'Lateral Raise', sets: 3, reps: '10', weight: '7 kg' },
    { id: 'mon6', name: 'Tricep Talja', sets: 3, reps: '10', weight: '15 kg' },
    { id: 'mon7', name: 'Tricep Paino', sets: 3, reps: '10', weight: '9.5 kg' },
  ]},
  { day: 1, name: 'Tiistai', focus: 'Back · Biceps · Arms', exercises: [
    { id: 'tue1', name: 'Pullup', sets: 3, reps: '5', weight: null },
    { id: 'tue2', name: 'Barbell Row', sets: 3, reps: '8', weight: '50 kg' },
    { id: 'tue3', name: 'Dumbbell Row', sets: 3, reps: '12', weight: '20 kg' },
    { id: 'tue4', name: 'Sivutaivutus', sets: 3, reps: '10', weight: '20 kg' },
    { id: 'tue5', name: 'Hyperextension', sets: 3, reps: '12', weight: '15 kg' },
    { id: 'tue6', name: 'Superman', sets: 3, reps: '12', weight: null },
    { id: 'tue7', name: 'Bicep Curl', sets: 3, reps: '8', weight: '12 kg' },
    { id: 'tue8', name: 'Hammer Curl', sets: 3, reps: '8', weight: '12 kg' },
    { id: 'tue9', name: 'Wrist Curl', sets: 3, reps: '20', weight: '7 kg' },
  ]},
  { day: 2, name: 'Keskiviikko', focus: 'Legs', exercises: [
    { id: 'wed1', name: 'Kyykkyhypyt', sets: 3, reps: '20', weight: null },
    { id: 'wed2', name: 'Kyykyt', sets: 3, reps: '8', weight: '50 kg' },
    { id: 'wed3', name: 'Front Thigh', sets: 3, reps: '12', weight: '6a' },
    { id: 'wed4', name: 'Back Thigh', sets: 3, reps: '12', weight: '7y' },
    { id: 'wed5', name: 'One Calf Raise', sets: 3, reps: '12', weight: '40 kg' },
    { id: 'wed6', name: 'Glute Pump', sets: 3, reps: '15', weight: null },
    { id: 'wed7', name: 'Side Glutes', sets: 3, reps: '15', weight: null },
  ]},
  { day: 3, name: 'Torstai', focus: 'Core · Chest', exercises: [
    { id: 'thu1', name: 'Pushups', sets: 3, reps: '20', weight: null },
    { id: 'thu2', name: 'OH Pushups', sets: 3, reps: '10', weight: null },
    { id: 'thu3', name: 'Dips', sets: 3, reps: '10', weight: null },
    { id: 'thu4', name: 'Dragon Flag', sets: 3, reps: '12', weight: null },
    { id: 'thu5', name: 'Leg Raises', sets: 3, reps: '12', weight: null },
    { id: 'thu6', name: 'Dead Bug', sets: 3, reps: '12', weight: '15 kg' },
    { id: 'thu7', name: 'Oblique Crunch', sets: 3, reps: '20', weight: null },
    { id: 'thu8', name: 'Side Plank Dip', sets: 3, reps: '20', weight: null },
    { id: 'thu9', name: 'Plank', sets: 1, reps: '1.5 min', weight: null },
    { id: 'thu10', name: 'Plank (3. round)', sets: 1, reps: '2 min', weight: null },
  ]},
  { day: 4, name: 'Perjantai', focus: 'Cardio', exercises: [
    { id: 'fri1', name: '10km lenkki', sets: 1, reps: '10 km', weight: null },
  ]},
  { day: 5, name: 'Lauantai', focus: 'Core · HIIT', exercises: [
    { id: 'sat1', name: 'Dragon Flag', sets: 3, reps: '12', weight: null },
    { id: 'sat2', name: 'Leg Raises', sets: 3, reps: '12', weight: null },
    { id: 'sat3', name: 'Dead Bug', sets: 3, reps: '12', weight: '15 kg' },
    { id: 'sat4', name: 'Oblique Crunch', sets: 3, reps: '20', weight: null },
    { id: 'sat5', name: 'Side Plank Dip', sets: 3, reps: '20', weight: null },
    { id: 'sat6', name: 'Plank', sets: 1, reps: '1.5 min', weight: null },
    { id: 'sat7', name: 'Plank (3. round)', sets: 1, reps: '2 min', weight: null },
    { id: 'sat8', name: 'Lämmittely juoksu', sets: 1, reps: '10 min', weight: null },
    { id: 'sat9', name: 'Sprintti-intervallit', sets: 8, reps: '30s / 90s lepo', weight: null },
  ]},
  { day: 6, name: 'Sunnuntai', focus: 'Rest', exercises: [], rest: true },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');

  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes elielColorShift {
    0%   { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
    20%  { filter: hue-rotate(280deg) saturate(1.8) brightness(0.9); }
    40%  { filter: hue-rotate(30deg) saturate(2) brightness(1.1); }
    60%  { filter: hue-rotate(160deg) saturate(1.5) brightness(0.95); }
    80%  { filter: hue-rotate(80deg) saturate(1.8) brightness(1); }
    100% { filter: hue-rotate(0deg) saturate(1.2) brightness(1); }
  }
  @keyframes progressShift {
    0% { background:#C9A84C; } 25% { background:#e8d5a3; }
    50% { background:#ff6eb4; } 75% { background:#6eb4ff; } 100% { background:#C9A84C; }
  }
  @keyframes btnLiquid {
    0%   { color:#C9A84C; border-color:rgba(201,168,76,0.9); }
    25%  { color:#e8d5a3; border-color:rgba(232,213,163,0.9); }
    50%  { color:#ff6eb4; border-color:rgba(255,110,180,0.9); }
    75%  { color:#6eb4ff; border-color:rgba(110,180,255,0.9); }
    100% { color:#C9A84C; border-color:rgba(201,168,76,0.9); }
  }
  @keyframes breatheSlow { 0%,100% { opacity:0.9; transform:translateY(0); } 50% { opacity:1; transform:translateY(-2px); } }
  @keyframes breatheBtn { 0%,100% { transform:translateY(0px) scale(1); } 50% { transform:translateY(-4px) scale(1.015); } }
  @keyframes breatheArrow { 0%,100% { transform:translateY(0); opacity:0.9; } 50% { transform:translateY(-3px); opacity:1; } }
  @keyframes todayGlow {
    0%   { border-color:rgba(201,168,76,0.95); box-shadow:0 0 28px rgba(201,168,76,0.25); }
    25%  { border-color:rgba(232,213,163,0.95); box-shadow:0 0 28px rgba(232,213,163,0.2); }
    50%  { border-color:rgba(255,110,180,0.9);  box-shadow:0 0 28px rgba(255,110,180,0.2); }
    75%  { border-color:rgba(110,180,255,0.9);  box-shadow:0 0 28px rgba(110,180,255,0.2); }
    100% { border-color:rgba(201,168,76,0.95); box-shadow:0 0 28px rgba(201,168,76,0.25); }
  }
  @keyframes todayBg {
    0%   { background:rgba(107,29,46,0.35); }
    25%  { background:rgba(80,60,10,0.3); }
    50%  { background:rgba(80,20,60,0.3); }
    75%  { background:rgba(20,50,90,0.3); }
    100% { background:rgba(107,29,46,0.35); }
  }
  @keyframes todayText {
    0% { color:#C9A84C; } 25% { color:#e8d5a3; }
    50% { color:#ff6eb4; } 75% { color:#6eb4ff; } 100% { color:#C9A84C; }
  }

  .option-btn {
    background:rgba(255,255,255,0.03); border:2px solid rgba(201,168,76,0.7);
    border-radius:14px; padding:14px 16px; color:#C9A84C;
    font-family:'Cinzel',serif; font-size:13px; font-weight:600; letter-spacing:0.06em;
    cursor:pointer; text-align:center; animation:breatheBtn 4s ease-in-out infinite; will-change:transform;
  }
  .option-btn.selected {
    background:rgba(201,168,76,0.1); border:2px solid rgba(201,168,76,0.95);
    box-shadow:0 0 20px rgba(201,168,76,0.15); animation:btnLiquid 5s ease-in-out infinite;
  }
  .day-btn {
    width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.03);
    border:2px solid rgba(201,168,76,0.65); color:#C9A84C;
    font-family:'Cinzel',serif; font-size:14px; font-weight:600; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    animation:breatheBtn 4s ease-in-out infinite; will-change:transform;
  }
  .day-btn.selected {
    background:rgba(201,168,76,0.1); border:2px solid rgba(201,168,76,0.95);
    box-shadow:0 0 16px rgba(201,168,76,0.15); animation:btnLiquid 5s ease-in-out infinite;
  }
  .nav-arrow {
    background:none; border:none; cursor:pointer; padding:8px 20px;
    display:flex; align-items:center; justify-content:center;
    animation:breatheArrow 3.5s ease-in-out infinite; will-change:transform;
  }
  .nav-arrow:disabled { opacity:0; pointer-events:none; }
  .arrow-svg { width:56px; height:34px; }
  .continue-btn {
    width:100%; padding:16px; background:rgba(107,29,46,0.8);
    border:2px solid rgba(201,168,76,0.65); border-radius:16px; color:#C9A84C;
    font-family:'Cinzel',serif; font-size:12px; font-weight:600; letter-spacing:0.18em;
    text-transform:uppercase; cursor:pointer; animation:breatheBtn 4s ease-in-out infinite;
  }
  .text-input {
    width:100%; box-sizing:border-box; background:rgba(255,255,255,0.03);
    border:2px solid rgba(201,168,76,0.65); border-radius:14px; padding:14px 16px;
    color:#C9A84C; font-family:'Cinzel',serif; font-size:13px; outline:none; letter-spacing:0.04em;
  }
  .text-input::placeholder { color:rgba(201,168,76,0.35); font-style:italic; font-family:'Cormorant Garamond',serif; font-size:14px; }
  .text-input:focus { border-color:rgba(201,168,76,0.9); }
  .num-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
  .num-label { font-family:'Cinzel',serif; font-size:9px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(201,168,76,0.65); }
  .num-input {
    width:100%; background:rgba(255,255,255,0.03); border:2px solid rgba(201,168,76,0.65);
    border-radius:14px; padding:13px 8px; color:#C9A84C;
    font-family:'Cinzel',serif; font-size:14px; font-weight:700;
    outline:none; text-align:center; -moz-appearance:textfield; box-sizing:border-box;
  }
  .num-input::placeholder { color:rgba(201,168,76,0.3); font-family:'Cormorant Garamond',serif; font-style:italic; font-size:13px; font-weight:300; }
  .num-input::-webkit-outer-spin-button, .num-input::-webkit-inner-spin-button { -webkit-appearance:none; }
  .num-input:focus { border-color:rgba(201,168,76,0.9); }

  .day-card {
    background:rgba(255,255,255,0.03); border:1.5px solid rgba(201,168,76,0.5);
    border-radius:14px; overflow:hidden; animation:breatheBtn 5s ease-in-out infinite; will-change:transform;
  }
  .day-card.today {
    border:2px solid rgba(201,168,76,0.95);
    animation:breatheBtn 5s ease-in-out infinite, todayGlow 8s ease-in-out infinite, todayBg 8s ease-in-out infinite;
  }
  .today-name { animation:todayText 8s ease-in-out infinite; }
  .day-header { padding:16px 20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
  .exercise-row { padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(201,168,76,0.12); }
  .edit-input {
    background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.4);
    border-radius:8px; padding:6px 10px; color:#C9A84C;
    font-family:'Cormorant Garamond',serif; font-size:13px; outline:none;
  }
  .edit-input:focus { border-color:rgba(201,168,76,0.8); }
`;

function useSpringScale() {
  const ref = useRef(null), scale = useRef(1), vel = useRef(0), target = useRef(1), raf = useRef(null);
  const animate = useCallback(() => {
    const dx = target.current - scale.current;
    vel.current = vel.current * 0.65 + dx * 0.18;
    scale.current += vel.current;
    if (ref.current) ref.current.style.transform = `scale(${scale.current})`;
    if (Math.abs(dx) > 0.001 || Math.abs(vel.current) > 0.001) raf.current = requestAnimationFrame(animate);
  }, []);
  const bounce = useCallback(() => {
    cancelAnimationFrame(raf.current); target.current = 1.1;
    raf.current = requestAnimationFrame(animate);
    setTimeout(() => { target.current = 1; raf.current = requestAnimationFrame(animate); }, 100);
  }, [animate]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { ref, bounce };
}

function useSpringTilt() {
  const rotX = useRef(0), rotY = useRef(0), velX = useRef(0), velY = useRef(0);
  const targetX = useRef(0), targetY = useRef(0), rafId = useRef(null);
  const elRef = useRef(null), floatTime = useRef(0), isInteracting = useRef(false);
  const animate = useCallback(() => {
    floatTime.current += 1;
    const fo = isInteracting.current ? 0 : Math.sin(floatTime.current * 0.0008 * Math.PI * 2) * 8;
    velX.current = velX.current * 0.72 + (targetX.current - rotX.current) * 0.08;
    velY.current = velY.current * 0.72 + (targetY.current - rotY.current) * 0.08;
    rotX.current += velX.current; rotY.current += velY.current;
    if (elRef.current) elRef.current.style.transform = `perspective(800px) translateY(${fo}px) rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
    rafId.current = requestAnimationFrame(animate);
  }, []);
  useEffect(() => { rafId.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(rafId.current); }, [animate]);
  const onInteract = useCallback((e) => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    isInteracting.current = true;
    targetX.current = -((cy - rect.top - rect.height / 2) / (rect.height / 2)) * 18;
    targetY.current = ((cx - rect.left - rect.width / 2) / (rect.width / 2)) * 18;
    clearTimeout(elRef.current._t);
    elRef.current._t = setTimeout(() => { targetX.current = 0; targetY.current = 0; setTimeout(() => { isInteracting.current = false; }, 800); }, 300);
  }, []);
  return { elRef, onInteract };
}

function SpringBtn({ children, className, onClick, disabled, style }) {
  const { ref, bounce } = useSpringScale();
  return (
    <button ref={ref} className={className} disabled={disabled}
      style={{ ...style, transformOrigin: 'center' }}
      onClick={(e) => { if (!disabled) { bounce(); onClick?.(e); } }}>
      {children}
    </button>
  );
}

const STEPS = [
  { eliel: "Kerrotko ensin hiukan itsestäsi?" },
  { eliel: "Kuinka monta päivää viikossa treenaat?" },
  { eliel: "Mikä on kokemustasosi?" },
  { eliel: "Missä treenaat?" },
  { eliel: "Mikä on tavoitteesi?" },
  { eliel: "Haluatko kertoa jotain muuta?" },
];

export default function TrainView() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } })();
  const [mode, setMode] = useState(saved ? 'program' : 'onboarding');
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(saved || { gender: null, age: '', height: '', weight: '', frequency: null, level: null, equipment: null, goal: null, extra: '' });
  const [expanded, setExpanded] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [drafts, setDrafts] = useState({});
  const { elRef, onInteract } = useSpringTilt();

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const basicsComplete = answers.gender && answers.age && answers.height && answers.weight;
  const prevBasics = useRef(false);

  const goNext = useCallback((s) => {
    setTimeout(() => {
      if (s < STEPS.length - 1) setStep(s + 1);
      else { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); setMode('program'); setIsEditing(false); }
    }, 350);
  }, [answers]);

  useEffect(() => {
    if (step === 0 && !isEditing && basicsComplete && !prevBasics.current) { prevBasics.current = true; goNext(0); }
    if (!basicsComplete) prevBasics.current = false;
  }, [basicsComplete, step, isEditing, goNext]);

  const pick = (field, value) => {
    setAnswers(a => ({ ...a, [field]: value }));
    if (!isEditing) {
      setTimeout(() => {
        setStep(s => {
          if (s < STEPS.length - 1) return s + 1;
          setAnswers(a => { const u = { ...a, [field]: value }; localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); return u; });
          setMode('program');
          return s;
        });
      }, 350);
    }
  };

  const canProceed = () => {
    if (step === 0) return answers.gender && answers.age && answers.height && answers.weight;
    if (step === 1) return answers.frequency !== null;
    if (step === 2) return answers.level !== null;
    if (step === 3) return answers.equipment !== null;
    if (step === 4) return answers.goal !== null;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); setMode('program'); setIsEditing(false); }
  };

  const formatSets = (ex) => {
    let s = `${ex.sets} × ${ex.reps}`;
    if (ex.weight) s += ` · ${ex.weight}`;
    return s;
  };

  const startEditDay = (i) => {
    const d = {};
    PROGRAM[i].exercises.forEach(ex => { d[ex.id] = { name: ex.name, sets: String(ex.sets), reps: ex.reps, weight: ex.weight || '' }; });
    setDrafts(d); setEditingDay(i);
  };

  if (mode === 'program') {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", padding: "48px 24px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", animation: "fadeInUp 0.6s ease both" }}>
            <div>
              <h2 style={{ color: GOLD, fontSize: "22px", fontWeight: 700, letterSpacing: "0.1em", margin: 0, fontFamily: "'Cinzel', serif", animation: "todayText 8s ease-in-out infinite" }}>Training</h2>
              <p style={{ color: "rgba(201,168,76,0.5)", fontSize: "10px", fontFamily: "'Cinzel', serif", letterSpacing: "0.14em", margin: "4px 0 0", textTransform: "uppercase" }}>
                {new Date().toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <button onClick={() => { setIsEditing(true); setMode('onboarding'); setStep(0); }} style={{
              background: "none", border: "1.5px solid rgba(201,168,76,0.55)", borderRadius: "10px",
              padding: "7px 14px", color: "rgba(201,168,76,0.8)", fontFamily: "'Cinzel', serif",
              fontSize: "9px", letterSpacing: "0.12em", cursor: "pointer", fontWeight: 600,
            }}>Muokkaa</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "fadeInUp 0.8s ease both" }}>
            {PROGRAM.map((day, i) => {
              const isToday = i === todayIdx;
              const isOpen = expanded === i;
              const isEditingThis = editingDay === i;
              return (
                <div key={i} className={`day-card ${isToday ? 'today' : ''}`}>
                  <div className="day-header" onClick={() => !isEditingThis && setExpanded(isOpen ? null : i)}>
                    <div>
                      <p className={isToday ? "today-name" : ""} style={{
                        color: isToday ? GOLD : "#C9A84C",
                        fontSize: "14px", fontWeight: isToday ? 700 : 600,
                        letterSpacing: "0.08em", margin: 0, marginBottom: "4px",
                        fontFamily: "'Cinzel', serif",
                      }}>
                        {day.name}
                        {isToday && <span style={{ fontSize: "9px", marginLeft: "10px", opacity: 0.7, fontWeight: 400 }}>— tänään</span>}
                      </p>
                      <p style={{ color: "rgba(201,168,76,0.65)", fontSize: "12px", fontStyle: "italic", margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                        {day.focus}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {day.exercises.length > 0 && (
                        <span style={{ color: "rgba(201,168,76,0.7)", fontSize: "12px", fontFamily: "'Cinzel', serif", fontWeight: 600 }}>
                          {day.exercises.length}
                        </span>
                      )}
                      <span style={{ color: "rgba(201,168,76,0.6)", fontSize: "12px", transition: "transform 0.3s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>↓</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                      {day.rest ? (
                        <div style={{ padding: "16px 20px" }}>
                          <p style={{ color: "rgba(201,168,76,0.5)", fontSize: "14px", fontStyle: "italic", margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>It's A Lifestyle</p>
                        </div>
                      ) : isEditingThis ? (
                        <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {PROGRAM[i].exercises.map(ex => (
                            <div key={ex.id} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <input className="edit-input" style={{ flex: 2 }} value={drafts[ex.id]?.name || ''} onChange={e => setDrafts(d => ({ ...d, [ex.id]: { ...d[ex.id], name: e.target.value } }))} placeholder="Liike" />
                              <input className="edit-input" style={{ width: 40 }} value={drafts[ex.id]?.sets || ''} onChange={e => setDrafts(d => ({ ...d, [ex.id]: { ...d[ex.id], sets: e.target.value } }))} placeholder="S" />
                              <input className="edit-input" style={{ width: 52 }} value={drafts[ex.id]?.reps || ''} onChange={e => setDrafts(d => ({ ...d, [ex.id]: { ...d[ex.id], reps: e.target.value } }))} placeholder="T" />
                              <input className="edit-input" style={{ width: 60 }} value={drafts[ex.id]?.weight || ''} onChange={e => setDrafts(d => ({ ...d, [ex.id]: { ...d[ex.id], weight: e.target.value } }))} placeholder="Paino" />
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                            <button onClick={() => setEditingDay(null)} style={{ flex: 1, padding: "10px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.5)", borderRadius: "10px", color: GOLD, fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer" }}>Tallenna</button>
                            <button onClick={() => setEditingDay(null)} style={{ padding: "10px 14px", background: "none", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "10px", color: "rgba(201,168,76,0.5)", fontFamily: "'Cinzel', serif", fontSize: "10px", cursor: "pointer" }}>Peruuta</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {day.exercises.map(ex => (
                            <div key={ex.id} className="exercise-row">
                              <span style={{ color: "#C9A84C", fontSize: "16px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>{ex.name}</span>
                              <span style={{ color: GOLD, fontSize: "15px", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>{formatSets(ex)}</span>
                            </div>
                          ))}
                          <button onClick={e => { e.stopPropagation(); startEditDay(i); }} style={{ width: "100%", padding: "10px", background: "none", border: "none", borderTop: "1px solid rgba(201,168,76,0.1)", color: "rgba(201,168,76,0.5)", fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>Muokkaa päivää</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 100px", fontFamily: "'Cormorant Garamond', serif", gap: "24px" }}>

        <div style={{ width: "100%", animation: "fadeInUp 0.6s ease both" }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ height: "2px", flex: 1, borderRadius: "2px", background: i < step ? "rgba(201,168,76,0.6)" : i === step ? "#C9A84C" : "rgba(255,255,255,0.06)", animation: i === step ? "progressShift 5s ease-in-out infinite" : "none", transition: "background 0.4s ease" }} />
            ))}
          </div>
          <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", fontFamily: "'Cinzel', serif", textAlign: "right", margin: 0 }}>{step + 1} / {STEPS.length}</p>
        </div>

        <div ref={elRef} onClick={onInteract} onTouchStart={onInteract} style={{ cursor: "pointer", willChange: "transform", transformStyle: "preserve-3d" }}>
          <img src="/ElielTransparentt.png" style={{ width: "120px", height: "120px", objectFit: "contain", animation: "elielColorShift 12s ease-in-out infinite", display: "block", pointerEvents: "none" }} />
        </div>

        <p key={step} style={{ fontSize: "17px", lineHeight: 1.7, color: "#ccc", fontStyle: "italic", fontWeight: 300, margin: 0, textAlign: "center", animation: "fadeInUp 0.5s ease both, breatheSlow 6s ease-in-out infinite" }}>
          {STEPS[step].eliel}
        </p>

        <div style={{ width: "100%", animation: "fadeInUp 0.7s ease both" }}>
          {step === 0 && <StepBasics answers={answers} setAnswers={setAnswers} />}
          {step === 1 && <StepFrequency answers={answers} pick={pick} />}
          {step === 2 && <StepLevel answers={answers} pick={pick} />}
          {step === 3 && <StepEquipment answers={answers} pick={pick} />}
          {step === 4 && <StepGoal answers={answers} pick={pick} />}
          {step === 5 && <StepExtra answers={answers} setAnswers={setAnswers} onDone={() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); setMode('program'); setIsEditing(false); }} />}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginTop: "8px", minHeight: "60px" }}>
          {step > 0 && (
            <button className="nav-arrow" onClick={() => setStep(s => s - 1)}>
              <svg className="arrow-svg" viewBox="0 0 56 34" fill="none"><path d="M52 17H4M4 17L18 4M4 17L18 30" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
          {isEditing && (
            <button className="nav-arrow" onClick={handleNext} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.25 }}>
              <svg className="arrow-svg" viewBox="0 0 56 34" fill="none"><path d="M4 17H52M52 17L38 4M52 17L38 30" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function StepBasics({ answers, setAnswers }) {
  const set = (f, v) => setAnswers(a => ({ ...a, [f]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        {["Mies", "Nainen", "Muu"].map(g => (
          <SpringBtn key={g} className={`option-btn ${answers.gender === g ? "selected" : ""}`} style={{ flex: 1 }} onClick={() => set("gender", g)}>{g}</SpringBtn>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        {[["age","Ikä","—"], ["height","Pituus","— cm"], ["weight","Paino","— kg"]].map(([f, label, ph]) => (
          <div key={f} className="num-wrap">
            <span className="num-label">{label}</span>
            <input className="num-input" type="number" placeholder={ph} value={answers[f]} onChange={e => set(f, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepFrequency({ answers, pick }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {[1,2,3,4,5,6,7].map(n => (
        <SpringBtn key={n} className={`day-btn ${answers.frequency === n ? "selected" : ""}`} onClick={() => pick("frequency", n)}>{n}</SpringBtn>
      ))}
    </div>
  );
}

function StepLevel({ answers, pick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[["beginner","Beginner","Alle 1 vuosi"],["intermediate","Intermediate","1–3 vuotta"],["advanced","Advanced","3+ vuotta"]].map(([id, label, sub]) => (
        <SpringBtn key={id} className={`option-btn ${answers.level === id ? "selected" : ""}`} style={{ display: "flex", justifyContent: "space-between" }} onClick={() => pick("level", id)}>
          <span>{label}</span><span style={{ fontSize: "11px", opacity: 0.5, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>{sub}</span>
        </SpringBtn>
      ))}
    </div>
  );
}

function StepEquipment({ answers, pick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[["gym","Kuntosali"],["home","Kotitreeni"],["both","Molemmat"]].map(([id, label]) => (
        <SpringBtn key={id} className={`option-btn ${answers.equipment === id ? "selected" : ""}`} onClick={() => pick("equipment", id)}>{label}</SpringBtn>
      ))}
    </div>
  );
}

function StepGoal({ answers, pick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {[["muscle","Muscle Growth"],["weightloss","Weight Loss"],["cardio","Cardio"],["maintenance","Maintenance"]].map(([id, label]) => (
        <SpringBtn key={id} className={`option-btn ${answers.goal === id ? "selected" : ""}`} onClick={() => pick("goal", id)}>{label}</SpringBtn>
      ))}
    </div>
  );
}

function StepExtra({ answers, setAnswers, onDone }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <textarea className="text-input" placeholder="Loukkaantumiset, erityistoiveet, muuta Elielille..." rows={4} value={answers.extra} onChange={e => setAnswers(a => ({ ...a, extra: e.target.value }))} style={{ resize: "none" }} />
      <SpringBtn className="continue-btn" onClick={onDone}>Rakenna ohjelma →</SpringBtn>
    </div>
  );
}