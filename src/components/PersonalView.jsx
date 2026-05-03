import { useState, useRef, useEffect, useCallback } from "react";
import ScrollPicker from "./ScrollPicker";
import NotesView from "./NotesView";
import { ELIEL_TIER_FILTERS } from "./SettingsView";
import ToolboxView, { ChestButton } from "./ToolboxView";
import CarouselNav from "./CarouselNav";

const TIER_ELIEL_FILTER = {
  member:        ELIEL_TIER_FILTERS.member,
  builder:       ELIEL_TIER_FILTERS.builder,
  creator: ELIEL_TIER_FILTERS.creator,
}
const TIER_NAME_MAP = {
  'Member':        'member',
  'Builder':       'builder',
  'Creator': 'creator',
}

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";
const STORAGE_KEY = "duvaan_profile";
const PROGRAM_KEY = "duvaan_program";

function loadProgram() {
  try { const s = JSON.parse(localStorage.getItem(PROGRAM_KEY)||'null'); if(s) return s } catch{} return null
}
function saveProgram(p) { try{localStorage.setItem(PROGRAM_KEY,JSON.stringify(p))}catch{} }

// Read completed directly from localStorage — always fresh
function readCompleted() {
  try { return JSON.parse(localStorage.getItem('duvaan_completed')||'{}') } catch { return {} }
}

const PROGRAM = [
  {day:0,name:'Maanantai',focus:'Chest · Shoulder · Tricep',exercises:[
    {id:'mon1',name:'Pushups',sets:3,reps:'20',weight:null},{id:'mon2',name:'OH Pushups',sets:3,reps:'10',weight:null},
    {id:'mon3',name:'Dips',sets:3,reps:'10',weight:null},{id:'mon4',name:'Arnold Press',sets:3,reps:'10',weight:'9.5 kg'},
    {id:'mon5',name:'Lateral Raise',sets:3,reps:'10',weight:'7 kg'},{id:'mon6',name:'Tricep Talja',sets:3,reps:'10',weight:'15 kg'},
    {id:'mon7',name:'Tricep Paino',sets:3,reps:'10',weight:'9.5 kg'},
  ]},
  {day:1,name:'Tiistai',focus:'Back · Biceps · Arms',exercises:[
    {id:'tue1',name:'Pullup',sets:3,reps:'5',weight:null},{id:'tue2',name:'Barbell Row',sets:3,reps:'8',weight:'50 kg'},
    {id:'tue3',name:'Dumbbell Row',sets:3,reps:'12',weight:'20 kg'},{id:'tue4',name:'Sivutaivutus',sets:3,reps:'10',weight:'20 kg'},
    {id:'tue5',name:'Hyperextension',sets:3,reps:'12',weight:'15 kg'},{id:'tue6',name:'Superman',sets:3,reps:'12',weight:null},
    {id:'tue7',name:'Bicep Curl',sets:3,reps:'8',weight:'12 kg'},{id:'tue8',name:'Hammer Curl',sets:3,reps:'8',weight:'12 kg'},
    {id:'tue9',name:'Wrist Curl',sets:3,reps:'20',weight:'7 kg'},
  ]},
  {day:2,name:'Keskiviikko',focus:'Legs',exercises:[
    {id:'wed1',name:'Kyykkyhypyt',sets:3,reps:'20',weight:null},{id:'wed2',name:'Kyykyt',sets:3,reps:'8',weight:'50 kg'},
    {id:'wed3',name:'Front Thigh',sets:3,reps:'12',weight:'6a'},{id:'wed4',name:'Back Thigh',sets:3,reps:'12',weight:'7y'},
    {id:'wed5',name:'One Calf Raise',sets:3,reps:'12',weight:'40 kg'},{id:'wed6',name:'Glute Pump',sets:3,reps:'15',weight:null},
    {id:'wed7',name:'Side Glutes',sets:3,reps:'15',weight:null},
  ]},
  {day:3,name:'Torstai',focus:'Core · Chest',exercises:[
    {id:'thu1',name:'Pushups',sets:3,reps:'20',weight:null},{id:'thu2',name:'OH Pushups',sets:3,reps:'10',weight:null},
    {id:'thu3',name:'Dips',sets:3,reps:'10',weight:null},{id:'thu4',name:'Dragon Flag',sets:3,reps:'12',weight:null},
    {id:'thu5',name:'Leg Raises',sets:3,reps:'12',weight:null},{id:'thu6',name:'Dead Bug',sets:3,reps:'12',weight:'15 kg'},
    {id:'thu7',name:'Oblique Crunch',sets:3,reps:'20',weight:null},{id:'thu8',name:'Side Plank Dip',sets:3,reps:'20',weight:null},
    {id:'thu9',name:'Plank',sets:1,reps:'1.5 min',weight:null},{id:'thu10',name:'Plank (3. round)',sets:1,reps:'2 min',weight:null},
  ]},
  {day:4,name:'Perjantai',focus:'Cardio',exercises:[{id:'fri1',name:'10km lenkki',sets:1,reps:'10 km',weight:null}]},
  {day:5,name:'Lauantai',focus:'Core · HIIT',exercises:[
    {id:'sat1',name:'Dragon Flag',sets:3,reps:'12',weight:null},{id:'sat2',name:'Leg Raises',sets:3,reps:'12',weight:null},
    {id:'sat3',name:'Dead Bug',sets:3,reps:'12',weight:'15 kg'},{id:'sat4',name:'Oblique Crunch',sets:3,reps:'20',weight:null},
    {id:'sat5',name:'Side Plank Dip',sets:3,reps:'20',weight:null},{id:'sat6',name:'Plank',sets:1,reps:'1.5 min',weight:null},
    {id:'sat7',name:'Plank (3. round)',sets:1,reps:'2 min',weight:null},{id:'sat8',name:'Lämmittely juoksu',sets:1,reps:'10 min',weight:null},
    {id:'sat9',name:'Sprintti-intervallit',sets:8,reps:'30s / 90s lepo',weight:null},
  ]},
  {day:6,name:'Sunnuntai',focus:'Rest',exercises:[],rest:true},
]

const PERSONAL_TAGS = [
  'Music','Art','Philosophy',
  'Sports','Wellness','Nutrition',
  'Business','Finance','Technology',
  'Gastronomy','Travel','Film','Fashion','Mindfulness',
]
const STEPS=[
  {eliel:"Kerrotko ensin hiukan itsestäsi?"},
  {eliel:"Kuinka monta päivää viikossa treenaat?"},
  {eliel:"Mikä on kokemustasosi?"},
  {eliel:"Missä treenaat?"},
  {eliel:"Mikä on tavoitteesi?"},
  {eliel:"Haluatko kertoa jotain muuta?"},
]

const css=`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes elielColorShift{0%{filter:hue-rotate(0deg) saturate(1.2) brightness(1)}100%{filter:hue-rotate(360deg) saturate(1.2) brightness(1)}}
  @keyframes progressShift{0%{background:#C9A84C}50%{background:#6B1D2E}100%{background:#C9A84C}}
  @keyframes btnLiquid{0%{color:#C9A84C}50%{color:#e8d5a3}100%{color:#C9A84C}}
  @keyframes breatheSlow{0%,100%{opacity:0.9;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
  @keyframes breatheArrow{0%,100%{transform:translateY(0);opacity:0.9}50%{transform:translateY(-3px);opacity:1}}
  @keyframes todayGlow{0%,100%{border-color:#6B1D2E}50%{border-color:#6B1D2E}}
  @keyframes todayText{0%,100%{color:#6B1D2E}50%{color:#C9A84C}}
  @keyframes titleGlow{0%,100%{opacity:1}50%{opacity:0.8}}

  .option-btn{background:rgba(255,255,255,0.6);border:2px solid #6B1D2E;border-radius:14px;padding:14px 16px;color:#6B1D2E;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:0.06em;cursor:pointer;text-align:center;backdrop-filter:blur(4px);}
  .option-btn.selected{background:#6B1D2E;color:#C9A84C;}
  .day-btn{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.5);border:2px solid #6B1D2E;color:#6B1D2E;font-family:'Cinzel',serif;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .day-btn.selected{background:#6B1D2E;color:#C9A84C;}
  .nav-arrow{background:none;border:none;cursor:pointer;padding:8px 20px;display:flex;align-items:center;justify-content:center;}
  .nav-arrow:disabled{opacity:0;pointer-events:none}
  .arrow-svg{width:56px;height:34px}
  .continue-btn{width:100%;padding:16px;background:#6B1D2E;border:none;border-radius:16px;color:#C9A84C;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 20px #6B1D2E;}
  .text-input{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.7);border:1.5px solid #6B1D2E;border-radius:14px;padding:14px 16px;color:#2a1008;font-family:'Cinzel',serif;font-size:13px;outline:none;letter-spacing:0.04em}
  .text-input::placeholder{color:#6B1D2E;font-style:italic;font-family:'Cormorant Garamond',serif;font-size:14px}
  .num-input{width:100%;background:rgba(255,255,255,0.7);border:1.5px solid #6B1D2E;border-radius:14px;padding:13px 8px;color:#2a1008;font-family:'Cinzel',serif;font-size:14px;font-weight:700;outline:none;text-align:center;-moz-appearance:textfield;box-sizing:border-box}
  .num-input::placeholder{color:#6B1D2E;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;font-weight:300}
  .num-input::-webkit-outer-spin-button,.num-input::-webkit-inner-spin-button{-webkit-appearance:none}
  .day-card{background:rgba(255,255,255,0.65);border:1.5px solid #6B1D2E;border-radius:14px;overflow:hidden;backdrop-filter:blur(8px);box-shadow:0 2px 12px #6B1D2E;}
  .day-card.today{border:2px solid #6B1D2E;background:rgba(255,255,255,0.85);}
  .today-name{color:#6B1D2E !important;}
  .day-header{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
  .exercise-row{padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(107,29,46,0.15)}
  .edit-input{background:rgba(255,255,255,0.8);border:1px solid #6B1D2E;border-radius:8px;padding:6px 10px;color:#2a1008;font-family:'Cormorant Garamond',serif;font-size:13px;outline:none}
`

const TIER_METAL = {
  member: {
    border: 'linear-gradient(135deg, #d0d8e8 0%, #8899bb 25%, #e8eef8 50%, #6677aa 75%, #c0cce0 100%)',
    shadow: '0 0 0 1px #8899bb, 0 0 20px rgba(160,180,220,0.3), inset 0 1px 0 rgba(240,245,255,0.5)',
  },
  builder: {
    border: 'linear-gradient(135deg, #f0d060 0%, #a07820 25%, #f8e878 50%, #c09030 75%, #e8c848 100%)',
    shadow: '0 0 0 1px #a07820, 0 0 24px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,240,180,0.5)',
  },
  creator: {
    border: 'linear-gradient(135deg, #fff8e0 0%, #d4b860 20%, #fff0a0 40%, #e8d070 60%, #fff8d8 80%, #c8a040 100%)',
    shadow: '0 0 0 1px #d4b860, 0 0 32px rgba(232,212,138,0.45), 0 0 60px rgba(232,212,138,0.2), inset 0 1px 0 rgba(255,252,230,0.8)',
  },
}

const FREQ_LEVELS = [
  { name:'Member',  icon:'◈', color:'#C8D8F0', borderColor:'#B0C4DE', glowRgb:'180,200,230',
    boxBg:'linear-gradient(135deg,rgba(100,120,170,0.85) 0%,rgba(50,60,100,0.95) 50%,rgba(80,90,130,0.8) 100%)',
    innerGlow:'rgba(180,200,230,0.2)',
    min:0,    max:999,  price:'4€/kk',  master:false, btnGold:false,
    features:[['Eliel Basic','Henkilökohtainen AI-opas — vastaa, ohjaa, sparraa'],['Training Builder','Rakenna oma treeniohjelma ja seuraa suorituksia'],['Eventit','Liity julkisiin tapahtumiin — et vielä luo omia'],['Klubit','1 yksityinen klubi · max 10 jäsentä'],['Frequency','Kerrytä pisteitä kohti Builder-tasoa']],
    btn:'Aktivoi Member' },
  { name:'Builder', icon:'✦', color:'#C9A84C', borderColor:'#C9A84C', glowRgb:'201,168,76',
    boxBg:'linear-gradient(135deg,rgba(90,60,15,0.9) 0%,rgba(30,18,6,0.97) 55%,rgba(60,80,140,0.35) 100%)',
    innerGlow:'rgba(201,168,76,0.18)',
    min:1000, max:4999, price:'9€/kk',  master:false, btnGold:false,
    features:[['Eliel Enhanced','Muistaa historian, tekee proaktiivisia ehdotuksia'],['Health Dashboard','Uni, makrot, HRV — kaikki yhdessä näkymässä'],['Luo eventtejä','Rakenna tapahtumia, kasvata yhteisöä'],['Builder-klubit','3 klubia · max 50 jäsentä per klubi'],['Edistymisdata','Syvempi analyysi treeneistä ja kehityksestä']],
    btn:'Aktivoi Builder' },
  { name:'Creator', icon:'✸', color:'#F0E8C0', borderColor:'#E8D48A', glowRgb:'232,212,138',
    boxBg:'linear-gradient(135deg,rgba(30,15,60,0.97) 0%,rgba(80,30,100,0.85) 35%,rgba(120,35,80,0.8) 65%,rgba(30,15,60,0.97) 100%)',
    innerGlow:'rgba(232,212,138,0.15)',
    min:5000, max:null, price:'16€/kk', master:true,  btnGold:true,
    features:[['Eliel Master','Viikoittaiset yhteenvedot, patternien tunnistus, täysi muisti'],['Creator-klubit','10 klubia · max 1500 jäsentä per klubi'],['Early Access','Uudet Duvaan-julkaisut ennen kaikkia muita'],['Suora yhteys tiimiin','Palautekanava — sinun äänesi rakentaa tuotetta'],['Duvaan Wrapped','Vuosittainen personoitu tarina kasvustasi'],['Sovereign Events','Eksklusiiviset tapahtumat — digitaaliset ja fyysiset']],
    btn:'Aktivoi Creator' },
]
function getLevel(pts){ return FREQ_LEVELS.find(l=>pts>=l.min&&(l.max===null||pts<=l.max))||FREQ_LEVELS[0] }

function useSpringScale(){
  const ref=useRef(null),scale=useRef(1),vel=useRef(0),target=useRef(1),raf=useRef(null)
  const animate=useCallback(()=>{const dx=target.current-scale.current;vel.current=vel.current*0.65+dx*0.18;scale.current+=vel.current;if(ref.current)ref.current.style.transform=`scale(${scale.current})`;if(Math.abs(dx)>0.001||Math.abs(vel.current)>0.001)raf.current=requestAnimationFrame(animate)},[])
  const bounce=useCallback(()=>{cancelAnimationFrame(raf.current);target.current=1.1;raf.current=requestAnimationFrame(animate);setTimeout(()=>{target.current=1;raf.current=requestAnimationFrame(animate)},100)},[animate])
  useEffect(()=>()=>cancelAnimationFrame(raf.current),[])
  return{ref,bounce}
}

function useSpringTilt(){
  const rotX=useRef(0),rotY=useRef(0),velX=useRef(0),velY=useRef(0),targetX=useRef(0),targetY=useRef(0),rafId=useRef(null),elRef=useRef(null),floatTime=useRef(0),isInteracting=useRef(false)
  const animate=useCallback(()=>{floatTime.current+=1;const fo=isInteracting.current?0:Math.sin(floatTime.current*0.0008*Math.PI*2)*8;velX.current=velX.current*0.72+(targetX.current-rotX.current)*0.08;velY.current=velY.current*0.72+(targetY.current-rotY.current)*0.08;rotX.current+=velX.current;rotY.current+=velY.current;if(elRef.current)elRef.current.style.transform=`perspective(800px) translateY(${fo}px) rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;rafId.current=requestAnimationFrame(animate)},[])
  useEffect(()=>{rafId.current=requestAnimationFrame(animate);return()=>cancelAnimationFrame(rafId.current)},[animate])
  const onInteract=useCallback((e)=>{if(!elRef.current)return;const rect=elRef.current.getBoundingClientRect();const cx=e.touches?e.touches[0].clientX:e.clientX;const cy=e.touches?e.touches[0].clientY:e.clientY;isInteracting.current=true;targetX.current=-((cy-rect.top-rect.height/2)/(rect.height/2))*18;targetY.current=((cx-rect.left-rect.width/2)/(rect.width/2))*18;clearTimeout(elRef.current._t);elRef.current._t=setTimeout(()=>{targetX.current=0;targetY.current=0;setTimeout(()=>{isInteracting.current=false},800)},300)},[])
  return{elRef,onInteract}
}

function SpringBtn({children,className,onClick,disabled,style}){
  const{ref,bounce}=useSpringScale()
  return <button ref={ref} className={className} disabled={disabled} style={{...style,transformOrigin:'center'}} onClick={(e)=>{if(!disabled){bounce();onClick?.(e)}}}>{children}</button>
}

function ClubPennant({ name, color = "#C9A84C" }) {
  const h = 28
  const textPad = 12
  const textW = Math.max(name.length * 6.5 + textPad * 2, 48)
  const totalW = textW + 10
  const notchDepth = 9
  const points = [
    [notchDepth, 0],[totalW, 0],[totalW, h],[notchDepth, h],[0, h / 2],
  ].map(([x,y]) => `${x},${y}`).join(' ')
  return (
    <svg width={totalW} height={h} viewBox={`0 0 ${totalW} ${h}`} style={{ display:'block', filter:`drop-shadow(0 0 4px ${color}55)` }}>
      <defs>
        <linearGradient id={`pennant-${name.replace(/\s/g,'')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.06"/>
        </linearGradient>
      </defs>
      <polygon points={points} fill={`url(#pennant-${name.replace(/\s/g,'')})`} stroke={color} strokeWidth="1" strokeOpacity="0.55"/>
      <line x1={totalW} y1="0" x2={totalW} y2={h} stroke={color} strokeWidth="1.5" strokeOpacity="0.8"/>
      <text x={textW / 2} y={h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={color} fillOpacity="0.85" fontFamily="'Cinzel', serif" fontSize="8.5" fontWeight="600" letterSpacing="0.08em">{name.toUpperCase()}</text>
    </svg>
  )
}

function FrequencyCard(){
  const[points]=useState(()=>{try{return parseInt(localStorage.getItem('duvaan_frequency')||'0')}catch{return 0}})
  const level=getLevel(points)
  const levelIdx=FREQ_LEVELS.indexOf(level)
  const nextLevel=FREQ_LEVELS[levelIdx+1]
  const progress=nextLevel?((points-level.min)/(nextLevel.min-level.min))*100:100
  const isMaster=level.name==='Creator'
  return(
    <div style={{background:isMaster?'linear-gradient(135deg,rgba(20,10,30,0.95) 0%,rgba(14,8,20,0.98) 50%,rgba(30,20,10,0.9) 100%)':'rgba(255,255,255,0.02)',border:`1px solid ${level.color}`,borderRadius:16,padding:'18px 20px',marginBottom:16,position:'relative',overflow:'hidden'}}>
      {isMaster&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${level.color},transparent)`}}/>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div>
          <p style={{color:level.color,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.22em',textTransform:'uppercase',margin:'0 0 4px'}}>Frequency</p>
          <span style={{color:level.color,fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,letterSpacing:'0.04em'}}>{level.icon} {level.name}</span>
        </div>
        <div style={{textAlign:'right'}}>
          <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,margin:0}}>{points.toLocaleString()}</p>
          <p style={{color:'#C9A84C',fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.1em',margin:'2px 0 0'}}>PISTETTÄ</p>
        </div>
      </div>
      <div style={{background:'rgba(255,255,255,0.06)',borderRadius:4,height:5,overflow:'hidden',marginBottom:6}}>
        <div style={{height:'100%',borderRadius:4,width:progress+'%',background:nextLevel?`linear-gradient(90deg,${level.color},${nextLevel.color})`:level.color,boxShadow:`0 0 10px ${level.color}`,transition:'width 0.8s ease'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <span style={{color:level.color,fontFamily:"'Cinzel',serif",fontSize:8}}>{level.icon} {level.name}</span>
        {nextLevel
          ?<span style={{color:nextLevel.color,fontFamily:"'Cinzel',serif",fontSize:8}}>{nextLevel.icon} {nextLevel.name} — {nextLevel.min.toLocaleString()} p</span>
          :<span style={{color:level.color,fontFamily:"'Cinzel',serif",fontSize:8,fontStyle:'italic'}}>Huipputaso ✸</span>
        }
      </div>
    </div>
  )
}

function ShopSection(){
  const[cardOrdered,setCardOrdered]=useState(()=>{try{return localStorage.getItem('duvaan_card_ordered')==='true'}catch{return false}})
  return(
    <div style={{paddingBottom:20}}>
      <p style={{color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',margin:'0 0 16px',fontWeight:700}}>Jäsenyystasot</p>
      {FREQ_LEVELS.map(tier=>(
        <div key={tier.name} style={{
          background: tier.boxBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius:20, padding:'20px 18px 18px', marginBottom:14,
          position:'relative', overflow:'hidden',
          boxShadow: TIER_METAL[TIER_NAME_MAP[tier.name]]?.shadow,
          outline: '1.5px solid transparent',
          backgroundClip: 'padding-box',
        }}>
          <div style={{position:'absolute',inset:0,borderRadius:20,pointerEvents:'none',zIndex:10,background:TIER_METAL[TIER_NAME_MAP[tier.name]]?.border,WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude',padding:'1.5px'}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:`linear-gradient(90deg,transparent,rgba(${tier.glowRgb},1) 50%,transparent)`}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'1px',background:`linear-gradient(90deg,transparent,rgba(${tier.glowRgb},0.5) 50%,transparent)`}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,height:80,background:`radial-gradient(ellipse at 50% 0%,rgba(${tier.glowRgb},0.18) 0%,transparent 70%)`,pointerEvents:'none'}}/>
          {tier.master&&<div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(100,60,180,0.2) 0%,rgba(180,60,120,0.15) 30%,rgba(60,140,180,0.12) 70%,rgba(120,60,200,0.15) 100%)',pointerEvents:'none'}}/>}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <img src="/ElielGold.png" alt="" style={{width:28,height:28,objectFit:'contain',filter:TIER_ELIEL_FILTER[TIER_NAME_MAP[tier.name]]||TIER_ELIEL_FILTER.member,flexShrink:0}}/>
              <div>
                {tier.master&&<p style={{color:`rgba(${tier.glowRgb},0.7)`,fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:'0.24em',textTransform:'uppercase',margin:'0 0 1px'}}>Duvaan</p>}
                <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700,letterSpacing:'0.06em',textShadow:`0 0 20px rgba(${tier.glowRgb},0.6)`}}>{tier.icon} {tier.name}</span>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,textShadow:`0 0 16px rgba(${tier.glowRgb},0.5)`}}>{tier.price.split('/')[0]}</span>
              <span style={{color:`rgba(${tier.glowRgb},0.6)`,fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontStyle:'italic'}}>/kk</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:tier.btn?16:0}}>
            {tier.features.map(([title,desc])=>(
              <div key={title} style={{display:'flex',alignItems:'flex-start',gap:8}}>
                <span style={{color:tier.color,fontSize:10,marginTop:3,flexShrink:0,opacity:0.8}}>{tier.icon}</span>
                <div>
                  <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,letterSpacing:'0.05em'}}>{title}</span>
                  <span style={{color:`rgba(${tier.glowRgb},0.75)`,fontFamily:"'Cormorant Garamond',serif",fontSize:14,marginLeft:6}}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          {tier.btn&&(
            <button onClick={() => {
              const pts = { 'Aktivoi Member': 0, 'Aktivoi Builder': 1000, 'Aktivoi Creator': 5000 }
              localStorage.setItem('duvaan_frequency', String(pts[tier.btn] ?? 0))
              window.location.reload()
            }} style={{width:'100%',padding:'12px 0',background:tier.btnGold?`rgba(${tier.glowRgb},0.2)`:`rgba(${tier.glowRgb},0.12)`,border:`1.5px solid rgba(${tier.glowRgb},0.8)`,borderRadius:13,color:tier.color,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',cursor:'pointer',textShadow:`0 0 12px rgba(${tier.glowRgb},0.5)`,boxShadow:`0 0 16px rgba(${tier.glowRgb},0.15)`}}>{tier.btn}</button>
          )}
        </div>
      ))}
      <div style={{background:'rgba(255,255,255,0.18)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(201,168,76,0.4)',boxShadow:'0 0 24px rgba(201,168,76,0.1)',borderRadius:20,padding:'18px 20px',marginBottom:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.8),transparent)'}}/>
        <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,letterSpacing:'0.1em',margin:'0 0 14px'}}>Duvaan-kortti</p>
        <div style={{marginBottom:14,borderRadius:16,overflow:'hidden'}}>
          <img src="/DuvaanPlatinum.png" alt="Duvaan Card" style={{width:'100%',display:'block',borderRadius:16}}/>
        </div>
        {cardOrdered
          ?<p style={{color:'#2a9a50',fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:'0.1em',margin:0,textAlign:'center',fontWeight:700}}>✓ Kortti tilattu</p>
          :<button onClick={()=>{localStorage.setItem('duvaan_card_ordered','true');setCardOrdered(true)}} style={{width:'100%',padding:'13px 0',background:'rgba(107,29,46,0.15)',border:'1.5px solid rgba(201,168,76,0.6)',borderRadius:14,color:GOLD,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',cursor:'pointer',boxShadow:'0 0 16px rgba(201,168,76,0.1)'}}>Tilaa kortti — Creator-jäsenille</button>
        }
      </div>
    </div>
  )
}

function ProfileSection({section,setSection,onOpenSettings,auraColor}){
  const[editing,setEditing]=useState(false)
  const[profile,setProfile]=useState(()=>{
    try{
      return JSON.parse(localStorage.getItem('duvaan_user_profile')||'null')
        || JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')
    }catch{return null}
  })
  const[form,setForm]=useState(profile||{name:'',location:'',bio:'',tags:[],photo:null})
  const[points]=useState(()=>{try{return parseInt(localStorage.getItem('duvaan_frequency')||'0')}catch{return 0}})
  const tier=getLevel(points)
  const nextTier=FREQ_LEVELS[FREQ_LEVELS.indexOf(tier)+1]
  const progress=nextTier?Math.min(100,((points-tier.min)/(nextTier.min-tier.min))*100):100
  const[myClubs,setMyClubs]=useState(()=>{try{return JSON.parse(localStorage.getItem('duvaan_my_clubs')||'[]')}catch{return[]}})
  const photoInputRef=useRef(null)
  const [visibleSection, setVisibleSection] = useState(section)
  const [transitioning, setTransitioning] = useState(false)

  const handleSectionChange = (newSection) => {
    if (newSection === visibleSection) return
    setTransitioning(true)
    setTimeout(() => {
      setVisibleSection(newSection)
      setSection(newSection)
      setTransitioning(false)
    }, 80)
  }

  const handlePhoto=e=>{
    const file=e.target.files?.[0]
    if(!file)return
    const reader=new FileReader()
    reader.onload=ev=>setForm(f=>({...f,photo:ev.target.result}))
    reader.readAsDataURL(file)
  }

  const save=()=>{
    const saved={...form}
    localStorage.setItem('duvaan_user_profile',JSON.stringify(saved))
    setProfile(saved)
    setEditing(false)
  }

  const toggleTag = tag => setForm(f => ({ ...f, tags: (f.tags||[]).includes(tag) ? (f.tags||[]).filter(t=>t!==tag) : [...(f.tags||[]),tag] }))

  const tabs = [
    { id: 'profile', label: 'Profiili' },
    { id: 'training', label: 'Gym' },
    { id: 'shop', label: 'Shop' },
  ]

  const displayName=profile?.name||''
  const displayPhoto=profile?.photo||null

  return(
    <div style={{marginBottom:28,animation:'fadeInUp 0.5s ease both'}}>
      <CarouselNav
        tabs={tabs}
        active={visibleSection}
        onChange={handleSectionChange}
        auraColor={auraColor}
        lineColor="#6B1D2E"
        textColor="#6B1D2E"
        rightSlot={
          <button onClick={onOpenSettings} style={{background:'none',border:'none',cursor:'pointer',color:'#6B1D2E',lineHeight:1,opacity:0.85,transition:'opacity 0.2s',padding:0,display:'flex',alignItems:'center'}} title="Asetukset">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="2.5" stroke="#6B1D2E" strokeWidth="1.2"/>
              {[0,45,90,135,180,225,270,315].map((deg,i)=>{
                const a=deg*Math.PI/180
                const x1=9+4.2*Math.cos(a),y1=9+4.2*Math.sin(a)
                const x2=9+5.8*Math.cos(a),y2=9+5.8*Math.sin(a)
                return <line key={i} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} stroke="#6B1D2E" strokeWidth="1.4" strokeLinecap="round"/>
              })}
              <circle cx="9" cy="9" r="6.5" stroke="#6B1D2E" strokeWidth="1" strokeOpacity="0.5"/>
            </svg>
          </button>
        }
      />
      <div style={{height:20}}/>
      <div style={{opacity:transitioning?0:1,transform:transitioning?'translateY(8px)':'translateY(0)',transition:'opacity 0.08s ease, transform 0.08s ease'}}>
        {visibleSection==='notes'&&<NotesView isClub={false}/>}
        {visibleSection==='shop'&&<ShopSection/>}
        {visibleSection==='profile'&&(
          <div>
            {!editing&&(
              <div style={{background:tier.boxBg,border:`1.5px solid ${tier.borderColor}`,boxShadow:`0 0 24px ${tier.innerGlow}, inset 0 0 32px ${tier.innerGlow}`,borderRadius:18,padding:'20px 18px',marginBottom:16,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${tier.borderColor},transparent)`}}/>
                {tier.master&&<div style={{position:'absolute',inset:0,background:'linear-gradient(160deg, rgba(100,60,180,0.35) 0%, rgba(180,60,120,0.3) 20%, rgba(220,120,40,0.25) 40%, rgba(180,160,40,0.2) 60%, rgba(60,140,180,0.2) 80%, rgba(120,60,200,0.25) 100%)',pointerEvents:'none'}}/>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{width:54,height:54,borderRadius:'50%',border:`1.5px solid ${tier.color}`,flexShrink:0,overflow:'hidden',background:'linear-gradient(135deg,#6B1D2E,#C9A84C)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {displayPhoto?<img src={displayPhoto} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>:<span style={{fontSize:20,color:'#fff',fontFamily:"'Cinzel',serif",fontWeight:700}}>{displayName?.[0]?.toUpperCase()||'◈'}</span>}
                    </div>
                    <div>
                      <p style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700,letterSpacing:'0.06em',margin:'0 0 3px',textShadow:`0 0 16px rgba(${tier.glowRgb||'201,168,76'},0.7)`}}>{displayName||'—'}</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                        <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:10,fontWeight:600,letterSpacing:'0.12em'}}>{tier.icon} {tier.name}</span>
                        {profile?.location&&<span style={{color:tier.color,fontFamily:"'Cormorant Garamond',serif",fontSize:12,opacity:0.8}}>· 📍 {profile.location}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>{setForm(profile||{name:'',location:'',bio:'',tags:[],photo:null});setEditing(true)}} style={{background:'rgba(107,29,46,0.4)',border:`1.5px solid ${tier.color}`,borderRadius:8,padding:'6px 14px',color:tier.color,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'0.1em',fontWeight:600,cursor:'pointer',flexShrink:0}}>Muokkaa</button>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
                    <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:700}}>Frequency</span>
                    <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700,textShadow:`0 0 12px ${tier.color}88`}}>{points.toLocaleString()} <span style={{fontSize:9,fontWeight:500}}>p</span></span>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.12)',borderRadius:4,height:3,overflow:'hidden',marginBottom:5}}>
                    <div style={{height:'100%',borderRadius:4,width:progress+'%',background:nextTier?`linear-gradient(90deg,${tier.color},${nextTier.color})`:tier.color,boxShadow:`0 0 8px ${tier.color}`,transition:'width 0.8s ease'}}/>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:8,fontWeight:700}}>{tier.icon} {tier.name}</span>
                    {nextTier?<span style={{color:nextTier.color,fontFamily:"'Cinzel',serif",fontSize:8,fontWeight:700}}>{nextTier.icon} {nextTier.name} — {nextTier.min.toLocaleString()} p</span>:<span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:8,fontStyle:'italic',fontWeight:600}}>Huipulla ✸</span>}
                  </div>
                </div>
                <div style={{borderTop:`0.5px solid ${tier.color}44`,paddingTop:12}}>
                  <p style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 10px',fontWeight:700}}>Klubit</p>
                  {myClubs.length>0
                    ?<div style={{display:'flex',flexWrap:'wrap',gap:8}}>{myClubs.map(c=><ClubPennant key={c.id} name={c.name} color={tier.color}/>)}</div>
                    :<p style={{color:'rgba(201,168,76,0.3)',fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontStyle:'italic',margin:0}}>Ei klubeja vielä — liity Community-osiossa.</p>
                  }
                </div>
                {!profile&&(
                  <div style={{borderTop:`0.5px solid ${tier.color}44`,paddingTop:12,marginTop:12,textAlign:'center'}}>
                    <button onClick={()=>{setForm({name:'',location:'',bio:'',tags:[],photo:null});setEditing(true)}} style={{background:BURGUNDY,border:'1px solid rgba(201,168,76,0.4)',borderRadius:10,padding:'9px 20px',color:GOLD,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>Luo profiili</button>
                  </div>
                )}
              </div>
            )}
            {editing&&(
              <div style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(201,168,76,0.4)',borderRadius:14,padding:'18px 16px',marginBottom:16}}>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div onClick={()=>photoInputRef.current?.click()} style={{width:60,height:60,borderRadius:'50%',border:'1.5px dashed rgba(201,168,76,0.4)',flexShrink:0,overflow:'hidden',background:'rgba(255,255,255,0.65)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative'}}>
                      {form.photo?<img src={form.photo} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>:<span style={{fontSize:20,color:'rgba(201,168,76,0.3)'}}>+</span>}
                    </div>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}}/>
                    <div>
                      <p style={{color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',margin:'0 0 4px'}}>Profiilikuva</p>
                      <button onClick={()=>photoInputRef.current?.click()} style={{background:'none',border:'1px solid rgba(201,168,76,0.3)',borderRadius:8,padding:'5px 12px',color:'rgba(201,168,76,0.6)',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.1em',cursor:'pointer'}}>{form.photo?'Vaihda kuva':'Lisää kuva'}</button>
                    </div>
                  </div>
                  {[['Nimi','name','Julius Duvaan'],['Paikkakunta','location','Helsinki']].map(([label,field,ph])=>(
                    <div key={field}>
                      <p style={{color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 6px'}}>{label}</p>
                      <input className="num-input" style={{width:'100%',boxSizing:'border-box',textAlign:'left',padding:'11px 14px'}} value={form[field]||''} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}/>
                    </div>
                  ))}
                  <div>
                    <p style={{color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 6px'}}>Bio</p>
                    <textarea className="num-input" style={{width:'100%',boxSizing:'border-box',textAlign:'left',padding:'11px 14px',resize:'none',fontFamily:"'Cormorant Garamond',serif",fontSize:14}} rows={2} value={form.bio||''} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Solisti, säveltäjä..."/>
                  </div>
                  <div>
                    <p style={{color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 10px'}}>Tagit</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>
                      {PERSONAL_TAGS.map(tag=>{
                        const sel=(form.tags||[]).includes(tag)
                        return <button key={tag} onClick={()=>toggleTag(tag)} style={{background:sel?'#6B1D2E':'rgba(255,255,255,0.7)',border:'1.5px solid #6B1D2E',borderRadius:10,padding:'8px 6px',cursor:'pointer',color:sel?tier.color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.08em',textAlign:'center',transition:'all 0.15s',fontWeight:700}}>{tag}</button>
                      })}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={save} style={{flex:1,padding:12,background:BURGUNDY,border:'1.5px solid #C9A84C',borderRadius:12,color:GOLD,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>Tallenna</button>
                    <button onClick={()=>setEditing(false)} style={{padding:'12px 16px',background:'none',border:'1px solid rgba(201,168,76,0.25)',borderRadius:12,color:'rgba(201,168,76,0.5)',fontFamily:"'Cinzel',serif",fontSize:10,cursor:'pointer'}}>Peruuta</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


export default function PersonalView({ onOpenSettings, settings }){
  const AURA_COLORS = { red:"#FF3333", orange:"#FF8C00", gold:"#C9A84C", green:"#44CC77", lightblue:"#55CCFF", indigo:"#4455CC", purple:"#9933CC", white:"#E8E8FF" }
  const auraColor = AURA_COLORS[settings?.aura] || "#C9A84C"
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))}catch{return null}})()
  const[mode,setMode]=useState(saved?'program':'onboarding')
  const[program,setProgram]=useState(()=>loadProgram()||PROGRAM)
  const[isEditing,setIsEditing]=useState(false)
  const[step,setStep]=useState(0)
  const[answers,setAnswers]=useState(saved||{gender:null,age:'',height:'',weight:'',frequency:null,level:null,equipment:null,goal:null,extra:''})
  const[expanded,setExpanded]=useState(null)

  // completed state — always sync FROM localStorage
  const[completed,setCompleted]=useState(readCompleted)

  const[personalSection,setPersonalSection]=useState('profile')
  const[showToolbox,setShowToolbox]=useState(false)
  const[activeTools,setActiveTools]=useState(()=>{try{return JSON.parse(localStorage.getItem('duvaan_active_tools')||'["gym"]')}catch{return['gym']}})
  const[homeNotes,setHomeNotes]=useState(()=>{try{return JSON.parse(localStorage.getItem('duvaan_home_notes')||'[]')}catch{return[]}})

  const addTool=(id)=>{
    const updated=activeTools.includes(id)?activeTools.filter(t=>t!==id):[...activeTools,id]
    setActiveTools(updated)
    localStorage.setItem('duvaan_active_tools',JSON.stringify(updated))
  }

  // Sync completed on focus/visibility
  useEffect(()=>{
    const sync=()=>setCompleted(readCompleted())
    window.addEventListener('focus',sync)
    document.addEventListener('visibilitychange',sync)
    return()=>{window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync)}
  },[])

  // ── FIXED markDone: write localStorage first, then update state, no setExpanded ──
  const markDone = useCallback((i) => {
    const key = `${new Date().toISOString().split('T')[0]}_${i}`
    const cur = readCompleted()
    const upd = { ...cur, [key]: true }
    // Write first, update state after
    localStorage.setItem('duvaan_completed', JSON.stringify(upd))
    setCompleted(upd)
    // Don't close the card — let user see the ✓ confirmation
  }, [])

  const isDone = useCallback((i) => {
    return completed[`${new Date().toISOString().split('T')[0]}_${i}`] === true
  }, [completed])

  const[editingDay,setEditingDay]=useState(null)
  const[drafts,setDrafts]=useState({})
  const{elRef,onInteract}=useSpringTilt()
  const today=new Date().getDay()
  const todayIdx=today===0?6:today-1
  const basicsComplete=answers.gender&&answers.age&&answers.height&&answers.weight
  const prevBasics=useRef(false)

  const goNext=useCallback(s=>{setTimeout(()=>{if(s<STEPS.length-1)setStep(s+1);else{localStorage.setItem(STORAGE_KEY,JSON.stringify(answers));setMode('program');setIsEditing(false)}},350)},[answers])

  useEffect(()=>{
    if(step===0&&!isEditing&&basicsComplete&&!prevBasics.current){prevBasics.current=true;goNext(0)}
    if(!basicsComplete)prevBasics.current=false
  },[basicsComplete,step,isEditing,goNext])

  const pick=(field,value)=>{setAnswers(a=>({...a,[field]:value}));if(!isEditing){setTimeout(()=>{setStep(s=>{if(s<STEPS.length-1)return s+1;setAnswers(a=>{const u={...a,[field]:value};localStorage.setItem(STORAGE_KEY,JSON.stringify(u));return u});setMode('program');return s})},350)}}
  const canProceed=()=>{if(step===0)return answers.gender&&answers.age&&answers.height&&answers.weight;if(step===1)return answers.frequency!==null;if(step===2)return answers.level!==null;if(step===3)return answers.equipment!==null;if(step===4)return answers.goal!==null;return true}
  const handleNext=()=>{if(!canProceed())return;if(step<STEPS.length-1)setStep(s=>s+1);else{localStorage.setItem(STORAGE_KEY,JSON.stringify(answers));setMode('program');setIsEditing(false)}}
  const formatSets=ex=>{let s=`${ex.sets} × ${ex.reps}`;if(ex.weight)s+=` · ${ex.weight}`;return s}
  const startEditDay=i=>{const d={};program[i].exercises.forEach(ex=>{d[ex.id]={name:ex.name,sets:String(ex.sets),reps:ex.reps,weight:ex.weight||''}});setDrafts(d);setEditingDay(i)}
  const saveDayEdits=i=>{const updated=program.map((day,di)=>{if(di!==i)return day;return{...day,exercises:day.exercises.map(ex=>{const d=drafts[ex.id];if(!d)return ex;return{...ex,name:d.name,sets:Number(d.sets)||ex.sets,reps:d.reps,weight:d.weight||null}})}});setProgram(updated);saveProgram(updated);setEditingDay(null);setDrafts({})}

  if(mode==='program'){
    return(
      <>
        <style>{css}</style>
        <div style={{minHeight:'100vh',padding:'48px 24px 100px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',animation:'fadeInUp 0.6s ease both'}}>
            <div>
              <h2 style={{color:'#6B1D2E',fontSize:'22px',fontWeight:700,letterSpacing:'0.1em',margin:0,fontFamily:"'Cinzel',serif",textShadow:`0 0 30px ${auraColor}66, 0 0 60px ${auraColor}33`}}>Personal</h2>
              <p style={{color:'#6B1D2E',fontSize:'12px',letterSpacing:'0.14em',margin:'4px 0 0',textTransform:'uppercase',fontWeight:600,fontFamily:"'Cinzel',serif"}}>{new Date().toLocaleDateString('fi-FI',{weekday:'long',day:'numeric',month:'long'})}</p>
            </div>
          </div>
          <ProfileSection section={personalSection} setSection={setPersonalSection} onOpenSettings={onOpenSettings} auraColor={auraColor}/>

          {personalSection==='training'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'10px',animation:'fadeInUp 0.8s ease both'}}>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:4}}>
                <button onClick={()=>{setIsEditing(true);setMode('onboarding');setStep(0)}} style={{background:'none',border:'1.5px solid #6B1D2E',borderRadius:10,padding:'6px 14px',color:'#6B1D2E',fontFamily:"'Cinzel',serif",fontSize:'9px',fontWeight:700,letterSpacing:'0.12em',cursor:'pointer'}}>Muokkaa ohjelmaa</button>
              </div>
              {program.map((day,i)=>{
                const isToday=i===todayIdx,isOpen=expanded===i,isEditingThis=editingDay===i
                const done = isDone(i)
                return(
                  <div key={i} className={`day-card ${isToday?'today':''}`} style={done?{borderColor:'rgba(110,255,160,0.4)',boxShadow:'0 0 12px rgba(110,255,160,0.15)'}:{}}>
                    <div className="day-header" onClick={()=>!isEditingThis&&setExpanded(isOpen?null:i)}>
                      <div>
                        <p className={isToday?"today-name":""} style={{color:isToday?'#6B1D2E':'#2a1008',fontSize:'14px',fontWeight:isToday?700:600,letterSpacing:'0.08em',margin:0,marginBottom:'4px',fontFamily:"'Cinzel',serif"}}>
                          {day.name}
                          {isToday&&<span style={{fontSize:'9px',marginLeft:'10px',opacity:0.7,fontWeight:400}}>— tänään</span>}
                          {done&&<span style={{fontSize:'9px',marginLeft:'10px',color:'#6effa0',fontWeight:400}}>✓ tehty</span>}
                        </p>
                        <p style={{color:'#6B1D2E',fontSize:'12px',fontStyle:'italic',margin:0,fontFamily:"'Cormorant Garamond',serif"}}>{day.focus}</p>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        {day.exercises.length>0&&<span style={{color:'#6B1D2E',fontSize:'12px',fontFamily:"'Cinzel',serif",fontWeight:600}}>{day.exercises.length}</span>}
                        <span style={{color:'#6B1D2E',fontSize:'12px',transition:'transform 0.3s',display:'inline-block',transform:isOpen?'rotate(180deg)':'rotate(0deg)'}}>↓</span>
                      </div>
                    </div>
                    {isOpen&&(
                      <div style={{borderTop:'1px solid #C9A84C'}}>
                        {day.rest?(
                          <div style={{padding:'16px 20px'}}><p style={{color:'#C9A84C',fontSize:'14px',fontStyle:'italic',margin:0,fontFamily:"'Cormorant Garamond',serif"}}>It's A Lifestyle</p></div>
                        ):isEditingThis?(
                          <div style={{padding:'12px 18px',display:'flex',flexDirection:'column',gap:'8px'}}>
                            {program[i].exercises.map(ex=>(
                              <div key={ex.id} style={{display:'flex',gap:'6px',alignItems:'center'}}>
                                <input className="edit-input" style={{flex:2}} value={drafts[ex.id]?.name||''} onChange={e=>setDrafts(d=>({...d,[ex.id]:{...d[ex.id],name:e.target.value}}))} placeholder="Liike"/>
                                <input className="edit-input" style={{width:40}} value={drafts[ex.id]?.sets||''} onChange={e=>setDrafts(d=>({...d,[ex.id]:{...d[ex.id],sets:e.target.value}}))} placeholder="S"/>
                                <input className="edit-input" style={{width:52}} value={drafts[ex.id]?.reps||''} onChange={e=>setDrafts(d=>({...d,[ex.id]:{...d[ex.id],reps:e.target.value}}))} placeholder="T"/>
                                <div style={{width:80}}><ScrollPicker value={parseFloat(drafts[ex.id]?.weight)||0} onChange={v=>setDrafts(d=>({...d,[ex.id]:{...d[ex.id],weight:v>0?v+' kg':''}}))} min={0} max={200} step={0.5} unit=" kg"/></div>
                              </div>
                            ))}
                            <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
                              <button onClick={()=>saveDayEdits(i)} style={{flex:1,padding:'10px',background:'#C9A84C',border:'1px solid #C9A84C',borderRadius:'10px',color:GOLD,fontFamily:"'Cinzel',serif",fontSize:'10px',letterSpacing:'0.1em',cursor:'pointer'}}>Tallenna</button>
                              <button onClick={()=>setEditingDay(null)} style={{padding:'10px 14px',background:'none',border:'1px solid #C9A84C',borderRadius:'10px',color:'#C9A84C',fontFamily:"'Cinzel',serif",fontSize:'10px',cursor:'pointer'}}>Peruuta</button>
                            </div>
                          </div>
                        ):(
                          <>
                            {day.exercises.map(ex=>(
                              <div key={ex.id} className="exercise-row">
                                <span style={{color:'#2a1008',fontSize:'17px',fontFamily:"'Cormorant Garamond',serif",fontWeight:500}}>{ex.name}</span>
                                <span style={{color:'#6B1D2E',fontSize:'16px',fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif",fontWeight:500}}>{formatSets(ex)}</span>
                              </div>
                            ))}
                            <button
                              onClick={e=>{ e.stopPropagation(); startEditDay(i) }}
                              style={{width:'100%',padding:'10px',background:'none',border:'none',borderTop:'1px solid #C9A84C',color:'#C9A84C',fontFamily:"'Cinzel',serif",fontSize:'9px',letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}
                            >Muokkaa päivää</button>

                            {/* ── DONE BUTTON — fixed for mobile ── */}
                            {!done && (
                              <button
                                onPointerDown={e => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  markDone(i)
                                }}
                                style={{
                                  width:'100%', padding:'16px',
                                  background:'rgba(30,120,60,0.15)',
                                  border:'none',
                                  borderTop:'2px solid rgba(46,180,90,0.5)',
                                  color:'#2a9a50',
                                  fontFamily:"'Cinzel',serif",
                                  fontSize:'13px',
                                  letterSpacing:'0.18em',
                                  textTransform:'uppercase',
                                  cursor:'pointer',
                                  fontWeight:700,
                                  WebkitTapHighlightColor: 'transparent',
                                  touchAction: 'manipulation',
                                }}
                              >
                                ✓ Done
                              </button>
                            )}
                            {done && (
                              <div style={{width:'100%',padding:'16px',textAlign:'center',borderTop:'1px solid rgba(46,180,90,0.3)',color:'#6effa0',fontFamily:"'Cinzel',serif",fontSize:'12px',letterSpacing:'0.18em',textTransform:'uppercase',fontWeight:600,background:'rgba(30,120,60,0.08)'}}>
                                ✓ Suoritettu
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <div style={{display:'flex',justifyContent:'center',paddingTop:24,paddingBottom:8}}>
            <ChestButton onOpen={()=>setShowToolbox(true)}/>
          </div>
          {showToolbox&&(
            <ToolboxView onClose={()=>setShowToolbox(false)} onAddTool={addTool} activeTools={activeTools} onAddHomeNote={notes=>{ setHomeNotes(notes); localStorage.setItem('duvaan_home_notes',JSON.stringify(notes)); }}/>
          )}
        </div>
      </>
    )
  }

  return(
    <>
      <style>{css}</style>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',padding:'48px 24px 100px',fontFamily:"'Cormorant Garamond',serif",gap:'24px'}}>
        <div style={{width:'100%',animation:'fadeInUp 0.6s ease both'}}>
          <div style={{display:'flex',gap:'4px',marginBottom:'6px'}}>
            {STEPS.map((_,i)=><div key={i} style={{height:'2px',flex:1,borderRadius:'2px',background:i<step?'#C9A84C':i===step?'#C9A84C':'rgba(255,255,255,0.06)',animation:i===step?'progressShift 5s ease-in-out infinite':'none',transition:'background 0.4s ease'}}/>)}
          </div>
          <p style={{fontSize:'9px',letterSpacing:'0.22em',textTransform:'uppercase',color:'#C9A84C',fontFamily:"'Cinzel',serif",textAlign:'right',margin:0}}>{step+1} / {STEPS.length}</p>
        </div>
        <div ref={elRef} onClick={onInteract} onTouchStart={onInteract} style={{cursor:'pointer',willChange:'transform',transformStyle:'preserve-3d'}}>
          <img src="/ElielTransparentt.png" style={{width:'120px',height:'120px',objectFit:'contain',animation:'elielColorShift 12s ease-in-out infinite',display:'block',pointerEvents:'none'}}/>
        </div>
        <p key={step} style={{fontSize:'17px',lineHeight:1.7,color:'#ccc',fontStyle:'italic',fontWeight:300,margin:0,textAlign:'center',animation:'fadeInUp 0.5s ease both, breatheSlow 6s ease-in-out infinite'}}>{STEPS[step].eliel}</p>
        <div style={{width:'100%',animation:'fadeInUp 0.7s ease both'}}>
          {step===0&&<StepBasics answers={answers} setAnswers={setAnswers}/>}
          {step===1&&<StepFrequency answers={answers} pick={pick}/>}
          {step===2&&<StepLevel answers={answers} pick={pick}/>}
          {step===3&&<StepEquipment answers={answers} pick={pick}/>}
          {step===4&&<StepGoal answers={answers} pick={pick}/>}
          {step===5&&<StepExtra answers={answers} setAnswers={setAnswers} onDone={()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(answers));setMode('program');setIsEditing(false)}}/>}
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'40px',marginTop:'8px',minHeight:'60px'}}>
          {step>0&&<button className="nav-arrow" onClick={()=>setStep(s=>s-1)}><svg className="arrow-svg" viewBox="0 0 56 34" fill="none"><path d="M52 17H4M4 17L18 4M4 17L18 30" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
          {isEditing&&<button className="nav-arrow" onClick={handleNext} disabled={!canProceed()} style={{opacity:canProceed()?1:0.25}}><svg className="arrow-svg" viewBox="0 0 56 34" fill="none"><path d="M4 17H52M52 17L38 4M52 17L38 30" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
        </div>
      </div>
    </>
  )
}

function StepBasics({answers,setAnswers}){
  const set=(f,v)=>setAnswers(a=>({...a,[f]:v}))
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      <div style={{display:'flex',gap:'10px'}}>
        {["Mies","Nainen","Muu"].map(g=><SpringBtn key={g} className={`option-btn ${answers.gender===g?"selected":""}`} style={{flex:1}} onClick={()=>set("gender",g)}>{g}</SpringBtn>)}
      </div>
      <div style={{display:'flex',gap:'10px'}}>
        <ScrollPicker label="Ikä" value={parseInt(answers.age)||20} onChange={v=>set("age",String(v))} min={13} max={80} step={1} height={120} itemHeight={32}/>
        <ScrollPicker label="Pituus" value={parseInt(answers.height)||170} onChange={v=>set("height",String(v))} min={140} max={220} step={1} unit=" cm" height={120} itemHeight={32}/>
        <ScrollPicker label="Paino" value={parseFloat(answers.weight)||70} onChange={v=>set("weight",String(v))} min={40} max={150} step={0.5} unit=" kg" height={120} itemHeight={32}/>
      </div>
    </div>
  )
}
function StepFrequency({answers,pick}){
  return <div style={{display:'flex',justifyContent:'space-between'}}>{[1,2,3,4,5,6,7].map(n=><SpringBtn key={n} className={`day-btn ${answers.frequency===n?"selected":""}`} onClick={()=>pick("frequency",n)}>{n}</SpringBtn>)}</div>
}
function StepLevel({answers,pick}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      {[["beginner","Beginner","Alle 1 vuosi"],["intermediate","Intermediate","1–3 vuotta"],["advanced","Advanced","3+ vuotta"]].map(([id,label,sub])=>(
        <SpringBtn key={id} className={`option-btn ${answers.level===id?"selected":""}`} style={{display:'flex',justifyContent:'space-between'}} onClick={()=>pick("level",id)}>
          <span>{label}</span><span style={{fontSize:'11px',opacity:0.5,fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif"}}>{sub}</span>
        </SpringBtn>
      ))}
    </div>
  )
}
function StepEquipment({answers,pick}){
  return <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{[["gym","Kuntosali"],["home","Kotitreeni"],["both","Molemmat"]].map(([id,label])=><SpringBtn key={id} className={`option-btn ${answers.equipment===id?"selected":""}`} onClick={()=>pick("equipment",id)}>{label}</SpringBtn>)}</div>
}
function StepGoal({answers,pick}){
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>{[["muscle","Muscle Growth"],["weightloss","Weight Loss"],["cardio","Cardio"],["maintenance","Maintenance"]].map(([id,label])=><SpringBtn key={id} className={`option-btn ${answers.goal===id?"selected":""}`} onClick={()=>pick("goal",id)}>{label}</SpringBtn>)}</div>
}
function StepExtra({answers,setAnswers,onDone}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <textarea className="text-input" placeholder="Loukkaantumiset, erityistoiveet, muuta Elielille..." rows={4} value={answers.extra} onChange={e=>setAnswers(a=>({...a,extra:e.target.value}))} style={{resize:'none'}}/>
      <SpringBtn className="continue-btn" onClick={onDone}>Rakenna ohjelma →</SpringBtn>
    </div>
  )
}