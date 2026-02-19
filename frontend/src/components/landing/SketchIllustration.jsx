// Inline SVG sketch illustrations for the landing page

export const FileClusterIllustration = () => (
  <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Central cluster */}
    <circle cx="160" cy="120" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
    {/* Files floating */}
    <rect x="144" y="104" width="22" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M148 112h14M148 117h10M148 122h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    {/* File cluster 1 */}
    <g transform="translate(50, 50)">
      <rect x="0" y="0" width="18" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7h12M3 11h8M3 15h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
    {/* File cluster 2 */}
    <g transform="translate(248, 44)">
      <rect x="0" y="0" width="18" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7h12M3 11h8M3 15h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
    {/* File cluster 3 */}
    <g transform="translate(38, 160)">
      <rect x="0" y="0" width="18" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7h12M3 11h8M3 15h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
    {/* File cluster 4 */}
    <g transform="translate(252, 162)">
      <rect x="0" y="0" width="18" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7h12M3 11h8M3 15h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
    {/* Dotted connection lines */}
    <path d="M72 68 L148 112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" opacity="0.5"/>
    <path d="M252 56 L178 112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" opacity="0.5"/>
    <path d="M56 172 L148 136" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" opacity="0.5"/>
    <path d="M252 172 L178 136" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" opacity="0.5"/>
    {/* Cluster bubbles */}
    <circle cx="80" cy="55" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
    <circle cx="258" cy="55" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
    <circle cx="60" cy="178" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
    <circle cx="260" cy="178" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
    {/* Small annotation arrows */}
    <path d="M104 80 Q130 70 145 110" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" fill="none"/>
    <path d="M143 108 L145 115 L152 111" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3"/>
  </svg>
);

export const EmbeddingIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Neural net dots */}
    {[40, 80, 120].map((y, i) => (
      <circle key={i} cx="40" cy={y} r="5" stroke="currentColor" strokeWidth="1.5"/>
    ))}
    {[50, 90, 130].map((y, i) => (
      <circle key={i} cx="100" cy={y} r="5" stroke="currentColor" strokeWidth="1.5"/>
    ))}
    {[70, 110].map((y, i) => (
      <circle key={i} cx="160" cy={y} r="5" stroke="currentColor" strokeWidth="1.5"/>
    ))}
    {/* Connections */}
    {[40, 80, 120].map((y1) =>
      [50, 90, 130].map((y2, j) => (
        <line key={`${y1}-${j}`} x1="45" y1={y1} x2="95" y2={y2} stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
      ))
    )}
    {[50, 90, 130].map((y1) =>
      [70, 110].map((y2, j) => (
        <line key={`${y1}-${j}`} x1="105" y1={y1} x2="155" y2={y2} stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
      ))
    )}
  </svg>
);

export const QueryIllustration = () => (
  <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Search bar sketch */}
    <rect x="20" y="44" width="130" height="32" rx="16" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="48" cy="60" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M54 66 L60 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M64 60h60" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    {/* Results sketched */}
    <path d="M160 38 L185 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M160 52 L180 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M160 66 L182 66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M160 80 L175 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M156 34 L156 86" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
    {/* Arrow */}
    <path d="M150 60 L156 60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
