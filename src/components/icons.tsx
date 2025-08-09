import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    className="w-auto h-7 text-primary"
    {...props}
  >
    <text
      x="10"
      y="30"
      fontFamily="'Open Sans', sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="currentColor"
    >
      InvoiceFlow
    </text>
  </svg>
);
