import { useState, useRef, useEffect, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import LobbyView from './components/LobbyView'
import PersonalView from './components/PersonalView'
import CommunityView from './components/CommunityView'

const GOLD = '#C9A84C'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

  @keyframes gearColorShift {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    25%  { filter: hue-rotate(30deg) brightness(1.2); }
    50%  { filter: hue-rotate(0deg) brightness(0.9); }
    75%  { filter: hue-rotate(-20deg) brightness(1.1); }
    100% { filter: hue-rotate(0deg) brightness(1); }
  }

  @keyframes zoomIn {
    0%   { transform: scale(1);   opacity: 1;   filter: brightness(1); }
    70%  { transform: scale(4);   opacity: 0.5; filter: brightness(1.8); }
    100% { transform: scale(12);  opacity: 0;   filter: brightness(2.5); }
  }
  @keyframes zoomOut {
    0%   { transform: scale(0.08); opacity: 0;   filter: brightness(2.5); }
    30%  { transform: scale(0.3);  opacity: 0.5; filter: brightness(1.5); }
    100% { transform: scale(1);    opacity: 1;   filter: brightness(1); }
  }
  .zoom-exit {
    animation: zoomIn 0.5s ease-in forwards;
    transform-origin: 50% 42%;
    pointer-events: none;
  }
  .zoom-enter {
    animation: zoomOut 0.5s ease-out forwards;
    transform-origin: 50% 42%;
  }
`

function ClockWidget() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])
  const days = ['Su','Ma','Ti','Ke','To','Pe','La']
  const months = ['tammikuuta','helmikuuta','maaliskuuta','huhtikuuta','toukokuuta','kesäkuuta','heinäkuuta','elokuuta','syyskuuta','lokakuuta','marraskuuta','joulukuuta']
  const hh = String(time.getHours()).padStart(2,'0')
  const mm = String(time.getMinutes()).padStart(2,'0')
  const ss = String(time.getSeconds()).padStart(2,'0')
  return (
    <div style={{
      position:'fixed',
      top:12,
      left:16,
      zIndex:200, pointerEvents:'none',
      display:'flex', flexDirection:'column', gap:2,
    }}>
      <span style={{fontFamily:"'Cinzel',serif",fontSize:17,fontWeight:700,color:'#C9A84C',letterSpacing:'0.05em',lineHeight:1,textShadow:'0 0 16px rgba(201,168,76,0.45)'}}>{hh}:{mm}<span style={{fontSize:10,opacity:0.55,marginLeft:2}}>{ss}</span></span>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,fontWeight:400,color:'rgba(201,168,76,0.65)',letterSpacing:'0.1em',fontStyle:'italic'}}>{days[time.getDay()]} {time.getDate()}. {months[time.getMonth()]}</span>
    </div>
  )
}

function OrnamentNav({ tab, switchTab }) {
  const tabs = ['personal','eliel','community']
  const labels = ['Personal','Eliel','Community']
  return (
    <div style={{
      position:'fixed', bottom:0,
      left:'50%', transform:'translateX(-50%)',
      width:'100%', maxWidth:'480px',
      background:'linear-gradient(to bottom, rgba(60,8,16,0.97), rgba(30,4,8,0.99))',
      backdropFilter:'blur(12px)',
      borderTop:'1px solid rgba(201,168,76,0.3)',
      zIndex:100,
      display:'flex',
      justifyContent:'space-around',
      alignItems:'center',
      padding:'12px 16px 32px',
    }}>
      {tabs.map((t,i) => {
        const active = tab === t
        return (
          <button key={t} onClick={() => switchTab(t)} style={{
            background:'none', border:'none', cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center',
            gap:6, flex:1,
            transform: active ? 'scale(1.12)' : 'scale(1)',
            transition:'transform 0.25s ease',
          }}>
            <div style={{
              width: active ? 5 : 3, height: active ? 5 : 3,
              borderRadius:'50%',
              background: active ? '#C9A84C' : 'rgba(201,168,76,0.45)',
              boxShadow: active ? '0 0 8px rgba(201,168,76,0.8)' : 'none',
              transition:'all 0.25s',
            }}/>
            <span style={{
              fontFamily:"'Cinzel',serif",
              fontSize: active ? 12 : 10,
              fontWeight: active ? 700 : 400,
              letterSpacing:'0.16em',
              textTransform:'uppercase',
              color: active ? '#C9A84C' : 'rgba(201,168,76,0.5)',
              transition:'all 0.25s',
            }}>{labels[i]}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('eliel')

  useEffect(() => {
    function updateBodyBg() {
      const h = new Date().getHours() + new Date().getMinutes()/60
      let bg
      if      (h < 4)   bg = 'linear-gradient(to bottom, #010112, #02021a, #030220)'
      else if (h < 5.5) bg = 'linear-gradient(to bottom, #04030f, #0c0820, #1e1020)'
      else if (h < 7)   bg = 'linear-gradient(to bottom, #0e0828, #201040, #3a1a28, #e05010)'
      else if (h < 8.5) bg = 'linear-gradient(to bottom, #1a2060, #2838a8, #3850c0, #d07030)'
      else if (h < 10)  bg = 'linear-gradient(to bottom, #1a3888, #2258c8, #3070d8, #5088e0)'
      else if (h < 15)  bg = 'linear-gradient(to bottom, #1045b8, #1a58d8, #2070ee, #40a0f8)'
      else if (h < 19.5)bg = 'linear-gradient(to bottom, #1245b8, #1c58d5, #2570e8, #4090f0)'
      else if (h < 21)  bg = 'linear-gradient(to bottom, #1a1040, #2a1848, #3a2020, #d05010)'
      else if (h < 22)  bg = 'linear-gradient(to bottom, #100820, #1e1035, #381520, #cc4010)'
      else if (h < 23)  bg = 'linear-gradient(to bottom, #040410, #08061a, #0e0812)'
      else               bg = 'linear-gradient(to bottom, #010112, #010218, #02021e)'
      document.body.style.background = bg
      document.documentElement.style.background = bg
    }
    updateBodyBg()
    const iv = setInterval(updateBodyBg, 60000)
    return () => clearInterval(iv)
  }, [])

  const [transitioning, setTransitioning] = useState(false)
  const [exitClass, setExitClass] = useState('')
  const [enterClass, setEnterClass] = useState('')

  const switchTab = (id) => {
    if (id === tab || transitioning) return
    setTransitioning(true)
    setExitClass('zoom-exit')
    setTimeout(() => {
      setTab(id)
      setExitClass('')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterClass('zoom-enter')
          setTimeout(() => {
            setEnterClass('')
            setTransitioning(false)
          }, 520)
        })
      })
    }, 420)
  }

  if (splash) return <SplashScreen onComplete={() => setSplash(false)} />

  return (
    <>
    <div style={{ background: '#1a0810', minHeight: '100vh', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
      <style>{css}</style>

      <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 120px)' }} className={exitClass || enterClass}>
        {tab === 'eliel'     && <LobbyView onNavigate={switchTab} />}
        {tab === 'personal'  && <PersonalView onNavigate={switchTab} />}
        {tab === 'community' && <CommunityView onNavigate={switchTab} />}
      </div>

      <ClockWidget />
      <OrnamentNav tab={tab} switchTab={switchTab} />
    </div>
    </>
  )
}