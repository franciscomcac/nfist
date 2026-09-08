import type { SVGProps } from "react";

export function TikTok({ size = 16, ...props }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5V10a7.9 7.9 0 0 1-4.5-1.4v6.65a5.75 5.75 0 1 1-5.75-5.75c.25 0 .5.02.75.05v2.62a3.15 3.15 0 1 0 2.25 3.03V3h2.75Z" />
    </svg>
  );
}
