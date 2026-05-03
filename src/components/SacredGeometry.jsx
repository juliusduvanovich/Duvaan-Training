export default function SacredGeometry({ auraColor = "#C9A84C", tab = "eliel" }) {
  return (
    <svg style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'480px', height:'100%', pointerEvents:'none', zIndex:0 }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="52" height="60" patternUnits="userSpaceOnUse">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" fill="none" stroke="#8B6A18" strokeWidth="0.6" opacity="0.28"/>
          <polygon points="26,10 40,18 40,34 26,42 12,34 12,18" fill="none" stroke="#7A5510" strokeWidth="0.3" opacity="0.16"/>
          <line x1="4"  y1="14" x2="12" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="14" x2="40" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="4"  y1="38" x2="12" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="38" x2="40" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="2"  x2="26" y2="10" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="50" x2="26" y2="42" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <circle cx="26" cy="26" r="1.8" fill="#C9A84C" opacity="0.35"/>
          <circle cx="26" cy="26" r="3.2" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.18"/>
          <circle cx="26" cy="2"  r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="26" cy="50" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
        </pattern>
        <pattern id="hex2" x="26" y="30" width="52" height="60" patternUnits="userSpaceOnUse">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" fill="none" stroke="#8B6A18" strokeWidth="0.6" opacity="0.28"/>
          <polygon points="26,10 40,18 40,34 26,42 12,34 12,18" fill="none" stroke="#7A5510" strokeWidth="0.3" opacity="0.16"/>
          <line x1="4"  y1="14" x2="12" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="14" x2="40" y2="18" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="4"  y1="38" x2="12" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="48" y1="38" x2="40" y2="34" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="2"  x2="26" y2="10" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <line x1="26" y1="50" x2="26" y2="42" stroke="#8B6A18" strokeWidth="0.4" opacity="0.22"/>
          <circle cx="26" cy="26" r="1.8" fill="#C9A84C" opacity="0.35"/>
          <circle cx="26" cy="26" r="3.2" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.18"/>
          <circle cx="26" cy="2"  r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="48" cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="26" cy="50" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="38" r="0.8" fill="#8B6A18" opacity="0.25"/>
          <circle cx="4"  cy="14" r="0.8" fill="#8B6A18" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#f5f0e8"/>
      <rect width="100%" height="100%" fill="url(#hex)"/>
      <rect width="100%" height="100%" fill="url(#hex2)"/>
    </svg>
  )
}