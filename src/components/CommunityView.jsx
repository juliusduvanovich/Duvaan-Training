const GOLD = '#C9A84C'

export default function CommunityView({ onNavigate }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <span style={{
        fontSize: 10,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: GOLD,
        opacity: 0.6,
      }}>
        Community — tulossa
      </span>
    </div>
  )
}