export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Code-like background pattern */}
      <g opacity="0.15" filter="url(#glow)">
        <text x="5" y="15" fontFamily="monospace" fontSize="8" fill="url(#codeGradient)">
          {'{ gaming: true }'}
        </text>
        <text x="5" y="28" fontFamily="monospace" fontSize="8" fill="url(#codeGradient)">
          const play = () =&gt;
        </text>
        <text x="5" y="41" fontFamily="monospace" fontSize="8" fill="url(#codeGradient)">
          book.fast()
        </text>
        <text x="5" y="54" fontFamily="monospace" fontSize="8" fill="url(#codeGradient)">
          {'//ECO 2026'}
        </text>
      </g>

      {/* Main controller icon */}
      <g transform="translate(25, 15)" filter="url(#glow)">
        {/* Controller body */}
        <rect x="0" y="8" width="30" height="14" rx="3"
          stroke="url(#codeGradient)" strokeWidth="2.5" fill="none" />

        {/* D-pad */}
        <circle cx="8" cy="15" r="2" fill="url(#codeGradient)" />

        {/* Buttons */}
        <circle cx="22" cy="15" r="1.5" fill="url(#codeGradient)" opacity="0.8" />
        <circle cx="26" cy="12" r="1.5" fill="url(#codeGradient)" opacity="0.6" />

        {/* Grips */}
        <path d="M0 14 L-3 18 Q-4 20 -2 22 L0 22"
          stroke="url(#codeGradient)" strokeWidth="2" fill="none" />
        <path d="M30 14 L33 18 Q34 20 32 22 L30 22"
          stroke="url(#codeGradient)" strokeWidth="2" fill="none" />
      </g>

      {/* ECO Text with code style */}
      <g transform="translate(70, 0)">
        <text x="0" y="32"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="32"
          fill="url(#codeGradient)"
          filter="url(#glow)"
        >
          &lt;ECO&gt;
        </text>

        <text x="2" y="47"
          fontFamily="monospace"
          fontSize="9"
          fill="#9ca3af"
          letterSpacing="3"
        >
          BOOK.FAST
        </text>
      </g>

    </svg>
  );
}
