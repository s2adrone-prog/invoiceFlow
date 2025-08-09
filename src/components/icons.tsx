import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    {...props}
  >
    <g transform="translate(10, 0)">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" fill="none" />
      <text
        x="20"
        y="25"
        fontFamily="serif"
        fontSize="18"
        fill="currentColor"
        textAnchor="middle"
      >
        ADR
      </text>
      <text
        x="28"
        y="12"
        fontFamily="serif"
        fontSize="8"
        fill="currentColor"
        textAnchor="middle"
      >
        👑
      </text>
    </g>
    
    <g transform="translate(60, 5)">
      <rect x="0" y="0" width="30" height="30" rx="2" ry="2" fill="#dc2626" />
      <path d="M 8 5 H 22 L 25 10 V 28 H 5 L 8 5 Z" stroke="black" strokeWidth="1.5" fill="none" transform="translate(0, -2) scale(0.9)" />
      <text
        x="15"
        y="20"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        E
      </text>
    </g>

    <text
      x="100"
      y="28"
      fontFamily="sans-serif"
      fontSize="24"
      fill="currentColor"
    >
      Store
    </text>
  </svg>
);
