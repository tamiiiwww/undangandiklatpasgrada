// High-fidelity SVG of the official PASGRADA Paskibra emblem badge
export const PASGRADA_SVG = `
<svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
  <defs>
    <!-- Gold gradients -->
    <linearGradient id="pGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF275" />
      <stop offset="50%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#CCA000" />
    </linearGradient>
    <linearGradient id="pGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#B38600" />
    </linearGradient>
    <linearGradient id="pRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#EF233C" />
      <stop offset="50%" stopColor="#D90429" />
      <stop offset="100%" stopColor="#9E0018" />
    </linearGradient>
    <!-- Text Paths -->
    <path id="curvePasgrada" d="M 55,75 Q 200,32 345,75" fill="none" />
    <path id="curveRibbon" d="M 60,358 Q 200,402 340,358" fill="none" />
    <filter id="badgeGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.65" />
    </filter>
  </defs>

  <!-- Black Shield Base -->
  <path
    d="M 22,28 
       C 35,28 55,20 65,10 
       L 68,14 
       Q 200,42 332,14 
       L 335,10 
       C 345,20 365,28 378,28 
       C 385,110 388,185 365,265 
       C 335,350 245,405 200,428 
       C 155,405 65,350 35,265 
       C 12,185 15,110 22,28 Z"
    fill="#000000"
    stroke="#FACC15"
    strokeWidth="7"
    strokeLinejoin="round"
  />

  <!-- Inner Yellow Accent Border Line -->
  <path
    d="M 32,38 
       C 45,38 62,32 72,24 
       Q 200,50 328,24 
       C 338,32 355,38 368,38 
       C 374,115 376,182 355,258 
       C 327,338 242,392 200,414 
       C 158,392 73,338 45,258 
       C 24,182 26,115 32,38 Z"
    fill="none"
    stroke="#FACC15"
    strokeWidth="1.8"
    strokeOpacity="0.85"
  />

  <!-- PASGRADA Arched Title Text -->
  <text fill="#FACC15" fontSize="33" fontWeight="900" letterSpacing="4.5" fontFamily="Arial Black, Impact, sans-serif">
    <textPath href="#curvePasgrada" startOffset="50%" textAnchor="middle">
      PASGRADA
    </textPath>
  </text>

  <!-- 3D Faceted 5-Pointed Star -->
  <g transform="translate(200, 85)">
    <!-- Point 1 (Top) -->
    <polygon points="0,0 0,-26 7,-8" fill="#FFF59D" />
    <polygon points="0,0 0,-26 -7,-8" fill="#FBC02D" />
    <!-- Point 2 (Top Right) -->
    <polygon points="0,0 25,-8 11,3" fill="#FFF59D" />
    <polygon points="0,0 25,-8 7,-8" fill="#E65100" />
    <!-- Point 3 (Bottom Right) -->
    <polygon points="0,0 15,22 0,10" fill="#FFF59D" />
    <polygon points="0,0 15,22 11,3" fill="#F57F17" />
    <!-- Point 4 (Bottom Left) -->
    <polygon points="0,0 -15,22 -11,3" fill="#FFF59D" />
    <polygon points="0,0 -15,22 0,10" fill="#E65100" />
    <!-- Point 5 (Top Left) -->
    <polygon points="0,0 -25,-8 -7,-8" fill="#FFF59D" />
    <polygon points="0,0 -25,-8 -11,3" fill="#FBC02D" />
    <!-- Star Outline -->
    <polygon points="0,-26 7,-8 25,-8 11,3 15,22 0,10 -15,22 -11,3 -25,-8 -7,-8" fill="none" stroke="#CA8A04" strokeWidth="1" />
  </g>

  <!-- Left Wreath: PADI (Golden Rice Stalk) -->
  <g id="padiStalk">
    <!-- Main stem -->
    <path d="M 188,300 C 130,295 90,240 92,175 C 94,145 110,118 135,102" fill="none" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
    <!-- Rice grains -->
    <g fill="#FDE047" stroke="#854D0E" strokeWidth="0.8">
      <ellipse cx="132" cy="107" rx="8" ry="4" transform="rotate(-40 132 107)" />
      <ellipse cx="120" cy="116" rx="9" ry="4.5" transform="rotate(-50 120 116)" />
      <ellipse cx="112" cy="128" rx="9" ry="4.5" transform="rotate(-60 112 128)" />
      <ellipse cx="103" cy="142" rx="9.5" ry="5" transform="rotate(-70 103 142)" />
      <ellipse cx="98" cy="158" rx="10" ry="5" transform="rotate(-80 98 158)" />
      <ellipse cx="95" cy="175" rx="10" ry="5" transform="rotate(-90 95 175)" />
      <ellipse cx="95" cy="193" rx="10" ry="5" transform="rotate(-100 95 193)" />
      <ellipse cx="98" cy="210" rx="10" ry="5" transform="rotate(-110 98 210)" />
      <ellipse cx="104" cy="227" rx="10" ry="5" transform="rotate(-120 104 227)" />
      <ellipse cx="112" cy="243" rx="10" ry="5" transform="rotate(-130 112 243)" />
      <ellipse cx="123" cy="258" rx="10" ry="5" transform="rotate(-140 123 258)" />
      <ellipse cx="136" cy="271" rx="10" ry="5.2" transform="rotate(-150 136 271)" />
      <ellipse cx="152" cy="282" rx="10" ry="5.2" transform="rotate(-160 152 282)" />
      <ellipse cx="169" cy="291" rx="9.5" ry="5" transform="rotate(-170 169 291)" />
      <!-- Inner grain tier -->
      <ellipse cx="126" cy="122" rx="7.5" ry="4" transform="rotate(-45 126 122)" fill="#FEF08A" />
      <ellipse cx="117" cy="138" rx="8" ry="4" transform="rotate(-65 117 138)" fill="#FEF08A" />
      <ellipse cx="112" cy="156" rx="8" ry="4" transform="rotate(-80 112 156)" fill="#FEF08A" />
      <ellipse cx="110" cy="175" rx="8" ry="4" transform="rotate(-90 110 175)" fill="#FEF08A" />
      <ellipse cx="112" cy="194" rx="8" ry="4" transform="rotate(-100 112 194)" fill="#FEF08A" />
      <ellipse cx="117" cy="212" rx="8" ry="4" transform="rotate(-115 117 212)" fill="#FEF08A" />
      <ellipse cx="125" cy="229" rx="8" ry="4" transform="rotate(-130 125 229)" fill="#FEF08A" />
      <ellipse cx="137" cy="244" rx="8" ry="4" transform="rotate(-145 137 244)" fill="#FEF08A" />
      <ellipse cx="151" cy="257" rx="8" ry="4" transform="rotate(-160 151 257)" fill="#FEF08A" />
    </g>
  </g>

  <!-- Right Wreath: KAPAS (Cotton Blossoms with Green Sepals) -->
  <g id="kapasStalk">
    <!-- Main stem -->
    <path d="M 212,300 C 270,295 310,240 308,175 C 306,145 290,118 265,102" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
    <!-- 8 Cotton bolls -->
    <!-- Boll 1 -->
    <g transform="translate(265, 107)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="4.5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="4.5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="4.5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="4" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="4" fill="#F1F5F9" />
      <circle cx="0" cy="0" r="2.5" fill="#CBD5E1" />
    </g>
    <!-- Boll 2 -->
    <g transform="translate(283, 122)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="4.5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="4.5" fill="#F1F5F9" />
    </g>
    <!-- Boll 3 -->
    <g transform="translate(296, 142)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.2" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.2" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.2" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="4.5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="4.5" fill="#F1F5F9" />
    </g>
    <!-- Boll 4 -->
    <g transform="translate(304, 166)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="5" fill="#F1F5F9" />
    </g>
    <!-- Boll 5 -->
    <g transform="translate(305, 192)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="5" fill="#F1F5F9" />
    </g>
    <!-- Boll 6 -->
    <g transform="translate(298, 218)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="5" fill="#F1F5F9" />
    </g>
    <!-- Boll 7 -->
    <g transform="translate(285, 244)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="5" fill="#F1F5F9" />
    </g>
    <!-- Boll 8 -->
    <g transform="translate(264, 268)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5.2" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5.2" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5.2" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="4.5" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="4.5" fill="#F1F5F9" />
    </g>
    <!-- Boll 9 -->
    <g transform="translate(236, 286)">
      <polygon points="-5,2 0,-5 5,2 0,6" fill="#16A34A" />
      <circle cx="-3" cy="-1" r="5" fill="#FFFFFF" />
      <circle cx="3" cy="-1" r="5" fill="#FFFFFF" />
      <circle cx="0" cy="-4" r="5" fill="#FFFFFF" />
      <circle cx="-2" cy="3" r="4" fill="#F1F5F9" />
      <circle cx="2" cy="3" r="4" fill="#F1F5F9" />
    </g>
  </g>

  <!-- Golden Tie Ribbon Knot at base of wreath -->
  <g transform="translate(200, 305)">
    <circle cx="0" cy="0" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M -7,0 C -18,-8 -28,-4 -32,4 C -28,8 -16,4 -7,2 Z" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
    <path d="M 7,0 C 18,-8 28,-4 32,4 C 28,8 16,4 7,2 Z" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
    <path d="M -4,5 C -10,14 -16,22 -20,24 C -17,25 -8,18 -2,7 Z" fill="#CA8A04" />
    <path d="M 4,5 C 10,14 16,22 20,24 C 17,25 8,18 2,7 Z" fill="#CA8A04" />
  </g>

  <!-- Golden Eagle Wings (Sayap Kiri & Kanan) -->
  <g fill="#FACC15" stroke="#854D0E" strokeWidth="1.2">
    <!-- Left Wing -->
    <g>
      <!-- Feather 1 (Longest outer top) -->
      <path d="M 148,245 C 130,225 125,160 135,130 C 142,150 144,195 156,235 Z" fill="#FDE047" />
      <!-- Feather 2 -->
      <path d="M 152,248 C 138,230 134,175 145,145 C 150,165 152,205 160,240 Z" fill="#FACC15" />
      <!-- Feather 3 -->
      <path d="M 156,252 C 145,235 142,190 152,165 C 156,182 158,215 164,244 Z" fill="#EAB308" />
      <!-- Feather 4 -->
      <path d="M 160,256 C 152,242 150,210 158,185 C 162,200 163,225 167,248 Z" fill="#CA8A04" />
      <!-- Feather 5 (Inner bottom) -->
      <path d="M 163,260 C 158,250 156,228 163,205 C 166,218 167,235 170,252 Z" fill="#A16207" />
    </g>

    <!-- Right Wing -->
    <g>
      <!-- Feather 1 (Longest outer top) -->
      <path d="M 252,245 C 270,225 275,160 265,130 C 258,150 256,195 244,235 Z" fill="#FDE047" />
      <!-- Feather 2 -->
      <path d="M 248,248 C 262,230 266,175 255,145 C 250,165 248,205 240,240 Z" fill="#FACC15" />
      <!-- Feather 3 -->
      <path d="M 244,252 C 255,235 258,190 248,165 C 244,182 242,215 236,244 Z" fill="#EAB308" />
      <!-- Feather 4 -->
      <path d="M 240,256 C 248,242 250,210 242,185 C 238,200 237,225 233,248 Z" fill="#CA8A04" />
      <!-- Feather 5 (Inner bottom) -->
      <path d="M 237,260 C 242,250 244,228 237,205 C 234,218 233,235 230,252 Z" fill="#A16207" />
    </g>
  </g>

  <!-- Torch Handle (Obor) -->
  <g>
    <!-- Handle -->
    <path d="M 170,162 L 174,162 L 172,192 L 168,192 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
    <!-- Cup -->
    <path d="M 163,162 L 181,162 L 176,172 L 168,172 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />
    <!-- Flaming Fire (Red with white/yellow highlights) -->
    <path
      d="M 165,160 
         C 160,150 162,138 172,135 
         C 168,142 174,146 180,140 
         C 176,148 186,145 195,138 
         C 208,128 218,135 210,148 
         C 205,152 195,150 190,154 
         C 185,158 182,162 178,162 Z"
      fill="#DC2626"
      stroke="#991B1B"
      strokeWidth="1.2"
    />
    <!-- Inner Flame Tongue -->
    <path
      d="M 170,158 
         C 168,150 174,144 180,143 
         C 183,148 190,145 196,140 
         C 192,148 186,152 180,158 Z"
      fill="#FACC15"
    />
    <path
      d="M 174,156 
         C 175,150 182,146 186,146 
         C 184,151 180,153 176,156 Z"
      fill="#FFFFFF"
    />
  </g>

  <!-- Big Stylized Yellow Numeral "2" -->
  <g>
    <!-- Number 2 Drop shadow / back contour -->
    <path
      d="M 176,182 
         C 176,160 216,160 220,182 
         C 222,204 186,228 170,252 
         L 168,268 
         L 232,268 
         L 232,256 
         L 192,256 
         C 204,240 236,215 234,182 
         C 230,146 166,146 162,182 Z"
      fill="#FACC15"
      stroke="#000000"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </g>

  <!-- Soldier / Paskibra Cadet Silhouette (Integrated inside the top of the "2") -->
  <g>
    <!-- Soldier Helmet (Yellow) -->
    <path
      d="M 190,160 
         C 190,152 196,148 205,148 
         C 214,148 218,154 216,162 
         C 212,164 195,164 190,160 Z"
      fill="#FACC15"
      stroke="#713F12"
      strokeWidth="1.2"
    />
    <!-- White Face Guard / Mask / Strap Profile -->
    <path
      d="M 194,162 
         C 202,163 214,162 216,165 
         C 217,172 212,178 205,182 
         C 198,182 194,175 194,162 Z"
      fill="#FFFFFF"
      stroke="#0F172A"
      strokeWidth="1"
    />
    <!-- Soldier Torso / Uniform (Yellow) -->
    <path
      d="M 192,182 
         L 214,182 
         C 218,195 215,206 208,214 
         L 190,214 
         C 188,202 188,192 192,182 Z"
      fill="#FACC15"
      stroke="#713F12"
      strokeWidth="1.2"
    />
    <!-- White Document / Book in arm -->
    <polygon points="214,185 224,188 221,212 211,210" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
  </g>

  <!-- Bottom Red Curved Banner Ribbon: KARTIKA EKA PAKSI -->
  <g id="bottomRibbon">
    <!-- Left Ribbon Fold / Tail -->
    <path
      d="M 46,368 
         L 18,348 
         L 44,330 
         L 85,348 
         L 58,358 Z"
      fill="#B91C1C"
      stroke="#FACC15"
      strokeWidth="1.2"
    />
    <polygon points="18,348 28,340 18,332" fill="#000000" />

    <!-- Right Ribbon Fold / Tail -->
    <path
      d="M 354,368 
         L 382,348 
         L 356,330 
         L 315,348 
         L 342,358 Z"
      fill="#B91C1C"
      stroke="#FACC15"
      strokeWidth="1.2"
    />
    <polygon points="382,348 372,340 382,332" fill="#000000" />

    <!-- Main Curved Ribbon Body -->
    <path
      d="M 48,340 
         Q 200,385 352,340 
         L 355,364 
         Q 200,410 45,364 Z"
      fill="url(#pRedGrad)"
      stroke="#FACC15"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    <!-- Ribbon Trim Inner Lines (Top and Bottom Gold stripes) -->
    <path d="M 52,343 Q 200,388 348,343" fill="none" stroke="#FEF08A" strokeWidth="0.9" />
    <path d="M 49,361 Q 200,407 351,361" fill="none" stroke="#FEF08A" strokeWidth="0.9" />

    <!-- Text: KARTIKA EKA PAKSI -->
    <text fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="3" fontFamily="Arial Black, Impact, sans-serif">
      <textPath href="#curveRibbon" startOffset="50%" textAnchor="middle">
        KARTIKA EKA PAKSI
      </textPath>
    </text>
  </g>
</svg>
`;
