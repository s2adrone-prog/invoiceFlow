import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    {...props}
  >
    <text
      x="10"
      y="30"
      fontFamily="serif"
      fontSize="30"
      fill="currentColor"
    >
      ADR
    </text>
    <g transform="translate(90, 2)">
      <path
        d="M5 4H19L22 10V28C22 29.1046 21.1046 30 20 30H4C2.89543 30 2 29.1046 2 28V10L5 4Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="12"
        y="23"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="14"
        fontWeight="bold"
        fill="currentColor"
      >
        E
      </text>
    </g>
    <text
      x="125"
      y="30"
      fontFamily="sans-serif"
      fontSize="24"
      fill="currentColor"
    >
      Store
    </text>
  </svg>
);
