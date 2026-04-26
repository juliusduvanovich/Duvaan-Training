import { useState, useRef, useEffect, useCallback } from "react";
import ScrollPicker from "./ScrollPicker";
import NotesView from "./NotesView";
import { ELIEL_TIER_FILTERS } from "./SettingsView";

const TIER_ELIEL_FILTER = {
  member:        ELIEL_TIER_FILTERS.member,
  builder:       ELIEL_TIER_FILTERS.builder,
  masterbuilder: ELIEL_TIER_FILTERS.masterbuilder,
}
// Map FREQ_LEVELS tier names to filter keys
const TIER_NAME_MAP = {
  'Member':        'member',
  'Builder':       'builder',
  'MasterBuilder': 'masterbuilder',
}

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";
const STORAGE_KEY = "duvaan_profile";
const PROGRAM_KEY = "duvaan_program";

function loadProgram() {
  try { const s = JSON.parse(localStorage.getItem(PROGRAM_KEY)||'null'); if(s) return s } catch{} return null
}
function saveProgram(p) { try{localStorage.setItem(PROGRAM_KEY,JSON.stringify(p))}catch{} }

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



const PERSONAL_TAGS=['Sports','Gastronomy','Philosophy','Business','Music','Wellness','Art','Technology','Finance','Travel','Mindfulness','Nutrition','Running','Film','Fashion']
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
  @keyframes elielColorShift{0%{filter:hue-rotate(0deg) saturate(1.2) brightness(1)}20%{filter:hue-rotate(280deg) saturate(1.8) brightness(0.9)}40%{filter:hue-rotate(30deg) saturate(2) brightness(1.1)}60%{filter:hue-rotate(160deg) saturate(1.5) brightness(0.95)}80%{filter:hue-rotate(80deg) saturate(1.8) brightness(1)}100%{filter:hue-rotate(0deg) saturate(1.2) brightness(1)}}
  @keyframes progressShift{0%{background:#C9A84C}25%{background:#e8d5a3}50%{background:#ff6eb4}75%{background:#6eb4ff}100%{background:#C9A84C}}
  @keyframes btnLiquid{0%{color:#C9A84C;border-color:rgba(201,168,76,0.9)}25%{color:#e8d5a3;border-color:rgba(232,213,163,0.9)}50%{color:#ff6eb4;border-color:rgba(255,110,180,0.9)}75%{color:#6eb4ff;border-color:rgba(110,180,255,0.9)}100%{color:#C9A84C;border-color:rgba(201,168,76,0.9)}}
  @keyframes breatheSlow{0%,100%{opacity:0.9;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
  @keyframes breatheBtn{0%,100%{transform:translateY(0px) scale(1)}50%{transform:translateY(-4px) scale(1.015)}}
  @keyframes breatheArrow{0%,100%{transform:translateY(0);opacity:0.9}50%{transform:translateY(-3px);opacity:1}}
  @keyframes todayGlow{0%{border-color:rgba(201,168,76,0.95);box-shadow:0 0 28px #C9A84C}25%{border-color:rgba(232,213,163,0.95);box-shadow:0 0 28px rgba(232,213,163,0.2)}50%{border-color:rgba(255,110,180,0.9);box-shadow:0 0 28px rgba(255,110,180,0.2)}75%{border-color:rgba(110,180,255,0.9);box-shadow:0 0 28px rgba(110,180,255,0.2)}100%{border-color:rgba(201,168,76,0.95);box-shadow:0 0 28px #C9A84C}}
  @keyframes todayBg{0%{background:rgba(107,29,46,0.35)}25%{background:rgba(80,60,10,0.3)}50%{background:rgba(80,20,60,0.3)}75%{background:rgba(20,50,90,0.3)}100%{background:rgba(107,29,46,0.35)}}
  @keyframes todayText{0%{color:#C9A84C}25%{color:#e8d5a3}50%{color:#ff6eb4}75%{color:#6eb4ff}100%{color:#C9A84C}}
  @keyframes masterGlow{0%,100%{box-shadow:0 0 24px rgba(255,229,160,0.2)}50%{box-shadow:0 0 48px rgba(255,229,160,0.4)}}
  .option-btn{background:rgba(255,255,255,0.03);border:2px solid #C9A84C;border-radius:14px;padding:14px 16px;color:#C9A84C;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:0.06em;cursor:pointer;text-align:center;animation:breatheBtn 4s ease-in-out infinite;will-change:transform}
  .option-btn.selected{background:#C9A84C;border:2px solid rgba(201,168,76,0.95);box-shadow:0 0 20px #C9A84C;animation:btnLiquid 5s ease-in-out infinite}
  .day-btn{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.03);border:2px solid #C9A84C;color:#C9A84C;font-family:'Cinzel',serif;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:breatheBtn 4s ease-in-out infinite;will-change:transform}
  .day-btn.selected{background:#C9A84C;border:2px solid rgba(201,168,76,0.95);box-shadow:0 0 16px #C9A84C;animation:btnLiquid 5s ease-in-out infinite}
  .nav-arrow{background:none;border:none;cursor:pointer;padding:8px 20px;display:flex;align-items:center;justify-content:center;animation:breatheArrow 3.5s ease-in-out infinite;will-change:transform}
  .nav-arrow:disabled{opacity:0;pointer-events:none}
  .arrow-svg{width:56px;height:34px}
  .continue-btn{width:100%;padding:16px;background:rgba(107,29,46,0.8);border:2px solid #C9A84C;border-radius:16px;color:#C9A84C;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;animation:breatheBtn 4s ease-in-out infinite}
  .text-input{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.03);border:2px solid #C9A84C;border-radius:14px;padding:14px 16px;color:#C9A84C;font-family:'Cinzel',serif;font-size:13px;outline:none;letter-spacing:0.04em}
  .text-input::placeholder{color:#C9A84C;font-style:italic;font-family:'Cormorant Garamond',serif;font-size:14px}
  .num-input{width:100%;background:rgba(255,255,255,0.03);border:2px solid #C9A84C;border-radius:14px;padding:13px 8px;color:#C9A84C;font-family:'Cinzel',serif;font-size:14px;font-weight:700;outline:none;text-align:center;-moz-appearance:textfield;box-sizing:border-box}
  .num-input::placeholder{color:#C9A84C;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;font-weight:300}
  .num-input::-webkit-outer-spin-button,.num-input::-webkit-inner-spin-button{-webkit-appearance:none}
  .day-card{background:rgba(255,255,255,0.03);border:1.5px solid #C9A84C;border-radius:14px;overflow:hidden;animation:breatheBtn 5s ease-in-out infinite;will-change:transform}
  .day-card.today{border:2px solid rgba(201,168,76,0.95);animation:breatheBtn 5s ease-in-out infinite,todayGlow 8s ease-in-out infinite,todayBg 8s ease-in-out infinite}
  .today-name{animation:todayText 8s ease-in-out infinite}
  .day-header{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
  .exercise-row{padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #C9A84C}
  .edit-input{background:rgba(255,255,255,0.03);border:1px solid #C9A84C;border-radius:8px;padding:6px 10px;color:#C9A84C;font-family:'Cormorant Garamond',serif;font-size:13px;outline:none}
  .personal-subnav{display:flex;border-bottom:0.5px solid rgba(201,168,76,0.2);margin-bottom:20px;overflow-x:auto;scrollbar-width:none}
  .personal-subnav::-webkit-scrollbar{display:none}
  .personal-subnav-btn{background:none;border:none;cursor:pointer;padding:6px 16px 10px 0;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;border-bottom:1px solid transparent;transition:all 0.3s;flex-shrink:0}
`

const FREQ_LEVELS = [
  { name:'Member',      icon:'◈', color:'#C9A84C',  min:0,    max:999,  price:'4€/kk',  master:false,
    features:[['Eliel Basic','Henkilökohtainen AI-opas — vastaa, ohjaa, sparraa'],['Training Builder','Rakenna oma treeniohjelma ja seuraa suorituksia'],['Eventit','Liity julkisiin tapahtumiin — et vielä luo omia'],['Frequency','Kerrytä pisteitä kohti Builder-tasoa']],
    btn:'Aktivoi Member' },
  { name:'Builder',     icon:'✦', color:'#e8d5a3',  min:1000, max:4999, price:'9€/kk',  master:false,
    features:[['Eliel Enhanced','Muistaa historian, tekee proaktiivisia ehdotuksia'],['Health Dashboard','Uni, makrot, HRV — kaikki yhdessä näkymässä'],['Luo eventtejä','Rakenna tapahtumia, kasvata yhteisöä'],['Builder-klubit','Pääsy suljettuihin klubeihin — vaatii Builder-tason'],['Edistymisdata','Syvempi analyysi treeneistä ja kehityksestä']],
    btn:'Aktivoi Builder' },
  { name:'MasterBuilder',icon:'✸',color:'#C9A84C',  min:5000, max:null, price:'16€/kk', master:true,
    features:[['Eliel Master','Viikoittaiset yhteenvedot, patternien tunnistus, täysi muisti'],['MasterBuilder-klubit','Eksklusiivisimmat tilat — vain MasterBuilder-tasolle'],['Early Access','Uudet Duvaan-julkaisut ennen kaikkia muita'],['Suora yhteys tiimiin','Palautekanava — sinun äänesi rakentaa tuotetta'],['Duvaan Wrapped','Vuosittainen personoitu tarina kasvustasi'],['Sovereign Events','Eksklusiiviset tapahtumat — digitaaliset ja fyysiset']],
    btn:'Aktivoi MasterBuilder' },
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

function FrequencyCard(){
  const[points]=useState(()=>{try{return parseInt(localStorage.getItem('duvaan_frequency')||'0')}catch{return 0}})
  const level=getLevel(points)
  const levelIdx=FREQ_LEVELS.indexOf(level)
  const nextLevel=FREQ_LEVELS[levelIdx+1]
  const progress=nextLevel?((points-level.min)/(nextLevel.min-level.min))*100:100
  const isMaster=level.name==='MasterBuilder'
  return(
    <div style={{background:isMaster?'linear-gradient(135deg,rgba(107,29,46,0.5) 0%,rgba(20,14,6,0.95) 50%,rgba(80,60,10,0.4) 100%)':'rgba(255,255,255,0.02)',border:`1px solid ${level.color}`,borderRadius:16,padding:'18px 20px',marginBottom:16,animation:isMaster?'masterGlow 4s ease-in-out infinite':'breatheBtn 6s ease-in-out infinite',position:'relative',overflow:'hidden'}}>
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
      <p style={{color:'#C9A84C',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',margin:'0 0 16px'}}>Jäsenyystasot</p>
      {FREQ_LEVELS.map(tier=>(
        <div key={tier.name} style={{background:tier.master?'linear-gradient(135deg,rgba(107,29,46,0.55) 0%,rgba(14,10,4,0.95) 50%,rgba(80,60,10,0.35) 100%)':'rgba(255,255,255,0.02)',border:`1px solid ${tier.color}`,borderRadius:18,padding:'18px 18px 16px',marginBottom:12,position:'relative',overflow:'hidden',animation:tier.master?'masterGlow 4s ease-in-out infinite':undefined}}>
          {tier.master&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${tier.color},transparent)`}}/>}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <div>
              {tier.master&&<p style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:'0.24em',textTransform:'uppercase',margin:'0 0 3px',opacity:0.7}}>Duvaan</p>}
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,letterSpacing:'0.06em'}}>{tier.icon} {tier.name}</span>
                <img
                  src="/ElielGold.png"
                  alt=""
                  style={{
                    width:32, height:32,
                    objectFit:'contain',
                    filter: TIER_ELIEL_FILTER[TIER_NAME_MAP[tier.name]] || TIER_ELIEL_FILTER.member,
                    flexShrink:0,
                  }}
                />
              </div>
            </div>
            {tier.price
              ?<div style={{textAlign:'right'}}><span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700}}>{tier.price.split('/')[0]}</span><span style={{color:'rgba(201,168,76,0.6)',fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontStyle:'italic'}}>/kk</span></div>
              :<span style={{color:'rgba(201,168,76,0.5)',fontFamily:"'Cinzel',serif",fontSize:12}}>Ilmainen</span>
            }
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:tier.btn?14:0}}>
            {tier.features.map(([title,desc])=>(
              <div key={title} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                <span style={{color:tier.color,fontSize:10,marginTop:2,flexShrink:0}}>{tier.icon}</span>
                <div>
                  <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:600,letterSpacing:'0.06em'}}>{title}</span>
                  <span style={{color:'rgba(201,168,76,0.6)',fontFamily:"'Cormorant Garamond',serif",fontSize:13,marginLeft:6}}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          {tier.btn&&(
            <button style={{width:'100%',padding:'13px 0',background:tier.btnGold?GOLD:'rgba(107,29,46,0.5)',border:tier.btnGold?'none':`1.5px solid ${tier.color}`,borderRadius:13,color:tier.btnGold?'#080808':tier.color,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',cursor:'pointer'}}>{tier.btn}</button>
          )}
        </div>
      ))}
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #C9A84C',borderRadius:16,padding:'18px 20px',marginBottom:16}}>
        <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,letterSpacing:'0.1em',margin:'0 0 14px'}}>Duvaan-kortti</p>
        <div style={{marginBottom:14,borderRadius:16,overflow:'hidden'}}>
          <img src="/DuvaanPlatinum.png" alt="Duvaan Card" style={{width:'100%',display:'block',borderRadius:16}}/>
        </div>
        {cardOrdered
          ?<p style={{color:'#6effa0',fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:'0.1em',margin:0,textAlign:'center'}}>✓ Kortti tilattu</p>
          :<button onClick={()=>{localStorage.setItem('duvaan_card_ordered','true');setCardOrdered(true)}} style={{width:'100%',padding:'13px 0',background:'rgba(107,29,46,0.5)',border:'1.5px solid #C9A84C',borderRadius:14,color:GOLD,fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',cursor:'pointer'}}>Tilaa kortti — MasterBuilder-jäsenille</button>
        }
      </div>
    </div>
  )
}

function ProfileSection({section,setSection,onOpenSettings,auraColor}){
  const[editing,setEditing]=useState(false)
  const[profile,setProfile]=useState(()=>{
    try{
      // try both keys for backwards compat
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

  const toggleTag=tag=>setForm(f=>({...f,tags:f.tags.includes(tag)?f.tags.filter(t=>t!==tag):[...f.tags,tag]}))

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

  const tabs=[{id:'profile',label:'Profiili'},{id:'training',label:'Training'},{id:'notes',label:'Notes'},{id:'shop',label:'Shop'}]
  const displayName=profile?.name||''
  const displayPhoto=profile?.photo||null

  return(
    <div style={{marginBottom:28,animation:'fadeInUp 0.5s ease both'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:0}}>
        <div className="personal-subnav" style={{marginBottom:0,flex:1}}>
          {tabs.map(t=>(
            <button key={t.id} className="personal-subnav-btn" onClick={()=>setSection(t.id)} style={{color:section===t.id?auraColor:'rgba(201,168,76,0.45)',borderBottom:section===t.id?`1px solid ${auraColor}`:'1px solid transparent',textShadow:section===t.id?`0 0 10px ${auraColor}55`:'none',transition:'all 0.25s'}}>{t.label}</button>
          ))}
        </div>
        <button onClick={onOpenSettings} style={{background:'none',border:'none',cursor:'pointer',color:auraColor,fontSize:20,padding:'0 0 8px 12px',lineHeight:1,opacity:0.7,transition:'opacity 0.2s'}} title="Asetukset">⚙</button>
      </div>
      {section==='notes'&&<NotesView isClub={false}/>}
      {section==='shop'&&<ShopSection/>}
      {section==='profile'&&(
        <div>
          {/* ── UNIFIED PROFILE CARD ── */}
          {!editing&&(
            <div style={{background:tier.master?'linear-gradient(135deg,rgba(107,29,46,0.5) 0%,rgba(20,14,6,0.95) 50%,rgba(80,60,10,0.3) 100%)':'rgba(255,255,255,0.02)',border:`1px solid ${tier.color}`,borderRadius:18,padding:'20px 18px',marginBottom:16,position:'relative',overflow:'hidden'}}>
              {tier.master&&<div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${tier.color},transparent)`}}/>}

              {/* Top row: avatar + name + edit */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  {/* Avatar */}
                  <div style={{width:54,height:54,borderRadius:'50%',border:`1.5px solid ${tier.color}`,flexShrink:0,overflow:'hidden',background:'linear-gradient(135deg,#6B1D2E,#C9A84C)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {displayPhoto
                      ?<img src={displayPhoto} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                      :<span style={{fontSize:20,color:'#fff',fontFamily:"'Cinzel',serif",fontWeight:700}}>{displayName?.[0]?.toUpperCase()||'◈'}</span>
                    }
                  </div>
                  <div>
                    <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700,letterSpacing:'0.06em',margin:'0 0 3px'}}>{displayName||'—'}</p>
                    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                      <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:10,fontWeight:600,letterSpacing:'0.12em'}}>{tier.icon} {tier.name}</span>
                      {profile?.location&&<span style={{color:'rgba(201,168,76,0.45)',fontFamily:"'Cormorant Garamond',serif",fontSize:12}}>· 📍 {profile.location}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={()=>{setForm(profile||{name:'',location:'',bio:'',tags:[],photo:null});setEditing(true)}} style={{background:'none',border:'1px solid rgba(201,168,76,0.25)',borderRadius:8,padding:'5px 12px',color:'rgba(201,168,76,0.5)',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.1em',cursor:'pointer',flexShrink:0}}>Muokkaa</button>
              </div>

              {/* Frequency */}
              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
                  <span style={{color:'rgba(201,168,76,0.4)',fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase'}}>Frequency</span>
                  <span style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700}}>{points.toLocaleString()} <span style={{fontSize:8,opacity:0.5,fontWeight:400}}>p</span></span>
                </div>
                <div style={{background:'rgba(255,255,255,0.06)',borderRadius:4,height:3,overflow:'hidden',marginBottom:5}}>
                  <div style={{height:'100%',borderRadius:4,width:progress+'%',background:nextTier?`linear-gradient(90deg,${tier.color},${nextTier.color})`:tier.color,boxShadow:`0 0 8px ${tier.color}`,transition:'width 0.8s ease'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:tier.color,fontFamily:"'Cinzel',serif",fontSize:8}}>{tier.icon} {tier.name}</span>
                  {nextTier
                    ?<span style={{color:nextTier.color,fontFamily:"'Cinzel',serif",fontSize:8}}>{nextTier.icon} {nextTier.name} — {nextTier.min.toLocaleString()} p</span>
                    :<span style={{color:'rgba(201,168,76,0.35)',fontFamily:"'Cinzel',serif",fontSize:8,fontStyle:'italic'}}>Huipulla ✸</span>
                  }
                </div>
              </div>

              {/* Clubs */}
              <div style={{borderTop:'0.5px solid rgba(201,168,76,0.1)',paddingTop:12}}>
                <p style={{color:'rgba(201,168,76,0.35)',fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 8px'}}>Klubit</p>
                {myClubs.length>0
                  ?<div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {myClubs.map(c=>(
                      <span key={c.id} style={{background:'rgba(201,168,76,0.07)',border:'0.5px solid rgba(201,168,76,0.2)',borderRadius:20,padding:'4px 12px',color:'rgba(201,168,76,0.65)',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.08em'}}>{c.name}</span>
                    ))}
                  </div>
                  :<p style={{color:'rgba(201,168,76,0.3)',fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontStyle:'italic',margin:0}}>Ei klubeja vielä — liity Community-osiossa.</p>
                }
              </div>

              {/* No profile prompt */}
              {!profile&&(
                <div style={{borderTop:'0.5px solid rgba(201,168,76,0.1)',paddingTop:12,marginTop:12,textAlign:'center'}}>
                  <button onClick={()=>{setForm({name:'',location:'',bio:'',tags:[],photo:null});setEditing(true)}} style={{background:BURGUNDY,border:'1px solid rgba(201,168,76,0.4)',borderRadius:10,padding:'9px 20px',color:GOLD,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>Luo profiili</button>
                </div>
              )}
            </div>
          )}

          {/* ── EDIT FORM ── */}
          {editing&&(
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(201,168,76,0.4)',borderRadius:14,padding:'18px 16px',marginBottom:16}}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* Photo upload */}
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div
                    onClick={()=>photoInputRef.current?.click()}
                    style={{width:60,height:60,borderRadius:'50%',border:'1.5px dashed rgba(201,168,76,0.4)',flexShrink:0,overflow:'hidden',background:'rgba(255,255,255,0.03)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative'}}
                  >
                    {form.photo
                      ?<img src={form.photo} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                      :<span style={{fontSize:20,color:'rgba(201,168,76,0.3)'}}>+</span>
                    }
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}}/>
                  <div>
                    <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',margin:'0 0 4px'}}>Profiilikuva</p>
                    <button onClick={()=>photoInputRef.current?.click()} style={{background:'none',border:'1px solid rgba(201,168,76,0.3)',borderRadius:8,padding:'5px 12px',color:'rgba(201,168,76,0.6)',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.1em',cursor:'pointer'}}>
                      {form.photo?'Vaihda kuva':'Lisää kuva'}
                    </button>
                  </div>
                </div>

                {[['Nimi','name','Julius Duvaan'],['Paikkakunta','location','Helsinki']].map(([label,field,ph])=>(
                  <div key={field}>
                    <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 6px'}}>{label}</p>
                    <input className="num-input" style={{width:'100%',boxSizing:'border-box',textAlign:'left',padding:'11px 14px'}} value={form[field]||''} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}/>
                  </div>
                ))}

                <div>
                  <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 6px'}}>Bio</p>
                  <textarea className="num-input" style={{width:'100%',boxSizing:'border-box',textAlign:'left',padding:'11px 14px',resize:'none',fontFamily:"'Cormorant Garamond',serif",fontSize:14}} rows={2} value={form.bio||''} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Solisti, säveltäjä..."/>
                </div>

                <div>
                  <p style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',margin:'0 0 8px'}}>Tagit</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                    {PERSONAL_TAGS.map(tag=>{const sel=(form.tags||[]).includes(tag);return<button key={tag} onClick={()=>toggleTag(tag)} style={{background:sel?'rgba(201,168,76,0.18)':'rgba(255,255,255,0.02)',border:sel?'1.5px solid #C9A84C':'1px solid rgba(201,168,76,0.3)',borderRadius:20,padding:'6px 14px',cursor:'pointer',color:sel?GOLD:'rgba(201,168,76,0.55)',fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.1em',transition:'all 0.2s'}}>{tag}</button>})}
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
  )
}


export default function PersonalView({ onOpenSettings, settings }){
  const AURA_COLORS = { gold:"#C9A84C", ember:"#FF6B35", arctic:"#6EB4FF", jade:"#6EFFA0", amethyst:"#C06EFF", crimson:"#FF4060" }
  const auraColor = AURA_COLORS[settings?.aura] || "#C9A84C"
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))}catch{return null}})()
  const[mode,setMode]=useState(saved?'program':'onboarding')
  const[program,setProgram]=useState(()=>loadProgram()||PROGRAM)
  const[isEditing,setIsEditing]=useState(false)
  const[step,setStep]=useState(0)
  const[answers,setAnswers]=useState(saved||{gender:null,age:'',height:'',weight:'',frequency:null,level:null,equipment:null,goal:null,extra:''})
  const[expanded,setExpanded]=useState(null)
  const[completed,setCompleted]=useState(()=>{try{return JSON.parse(localStorage.getItem('duvaan_completed')||'{}')}catch{return{}}})
  const[personalSection,setPersonalSection]=useState('profile')

  useEffect(()=>{
    const sync=()=>{try{setCompleted(JSON.parse(localStorage.getItem('duvaan_completed')||'{}'))}catch{}}
    window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync)
    return()=>{window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync)}
  },[])

  const markDone=i=>{const key=`${new Date().toISOString().split('T')[0]}_${i}`;const cur=(()=>{try{return JSON.parse(localStorage.getItem('duvaan_completed')||'{}')}catch{return{}}})();const upd={...cur,[key]:true};setCompleted(upd);localStorage.setItem('duvaan_completed',JSON.stringify(upd));setExpanded(null)}
  const isDone=i=>completed[`${new Date().toISOString().split('T')[0]}_${i}`]===true

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
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',animation:'fadeInUp 0.6s ease both'}}>
            <h2 style={{color:GOLD,fontSize:'22px',fontWeight:700,letterSpacing:'0.1em',margin:0,fontFamily:"'Cinzel',serif",animation:'todayText 8s ease-in-out infinite'}}>Personal</h2>
          </div>
          <ProfileSection section={personalSection} setSection={setPersonalSection} onOpenSettings={onOpenSettings} auraColor={auraColor}/>
          {personalSection==='training'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'10px',animation:'fadeInUp 0.8s ease both'}}>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:4}}>
                <button onClick={()=>{setIsEditing(true);setMode('onboarding');setStep(0)}} style={{background:'none',border:'1px solid rgba(201,168,76,0.35)',borderRadius:10,padding:'6px 14px',color:'rgba(201,168,76,0.6)',fontFamily:"'Cinzel',serif",fontSize:'9px',letterSpacing:'0.12em',cursor:'pointer'}}>Muokkaa ohjelmaa</button>
              </div>
              {program.map((day,i)=>{
                const isToday=i===todayIdx,isOpen=expanded===i,isEditingThis=editingDay===i
                return(
                  <div key={i} className={`day-card ${isToday?'today':''}`} style={isDone(i)?{borderColor:'rgba(110,255,160,0.3)'}:{}}>
                    <div className="day-header" onClick={()=>!isEditingThis&&setExpanded(isOpen?null:i)}>
                      <div>
                        <p className={isToday?"today-name":""} style={{color:isToday?GOLD:'#C9A84C',fontSize:'14px',fontWeight:isToday?700:600,letterSpacing:'0.08em',margin:0,marginBottom:'4px',fontFamily:"'Cinzel',serif"}}>
                          {day.name}
                          {isToday&&<span style={{fontSize:'9px',marginLeft:'10px',opacity:0.7,fontWeight:400}}>— tänään</span>}
                          {isDone(i)&&<span style={{fontSize:'9px',marginLeft:'10px',color:'#6effa0',fontWeight:400}}>✓ tehty</span>}
                        </p>
                        <p style={{color:'#C9A84C',fontSize:'12px',fontStyle:'italic',margin:0,fontFamily:"'Cormorant Garamond',serif"}}>{day.focus}</p>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        {day.exercises.length>0&&<span style={{color:'#C9A84C',fontSize:'12px',fontFamily:"'Cinzel',serif",fontWeight:600}}>{day.exercises.length}</span>}
                        <span style={{color:'#C9A84C',fontSize:'12px',transition:'transform 0.3s',display:'inline-block',transform:isOpen?'rotate(180deg)':'rotate(0deg)'}}>↓</span>
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
                                <span style={{color:'#C9A84C',fontSize:'16px',fontFamily:"'Cormorant Garamond',serif",fontWeight:400}}>{ex.name}</span>
                                <span style={{color:GOLD,fontSize:'15px',fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif"}}>{formatSets(ex)}</span>
                              </div>
                            ))}
                            <button onClick={e=>{e.stopPropagation();startEditDay(i)}} style={{width:'100%',padding:'10px',background:'none',border:'none',borderTop:'1px solid #C9A84C',color:'#C9A84C',fontFamily:"'Cinzel',serif",fontSize:'9px',letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>Muokkaa päivää</button>
                            {!isDone(i)&&<button onClick={e=>{e.stopPropagation();markDone(i)}} style={{width:'100%',padding:'14px',background:'rgba(110,255,160,0.08)',border:'none',borderTop:'1px solid rgba(110,255,160,0.15)',color:'#6effa0',fontFamily:"'Cinzel',serif",fontSize:'11px',letterSpacing:'0.18em',textTransform:'uppercase',cursor:'pointer',fontWeight:600}}>✓ Done</button>}
                            {isDone(i)&&<div style={{width:'100%',padding:'14px',textAlign:'center',borderTop:'1px solid rgba(110,255,160,0.1)',color:'rgba(110,255,160,0.5)',fontFamily:"'Cinzel',serif",fontSize:'10px',letterSpacing:'0.18em',textTransform:'uppercase'}}>✓ Suoritettu</div>}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
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