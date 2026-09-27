import type { ReactNode, SVGProps } from "react";

const glyphs: Record<string, ReactNode> = {
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4v15" />
      <path d="M6 13l6 6 6-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.5v3.5M16 3.5v3.5M3.5 10.5h17" />
    </>
  ),
  close: <path d="M7 7l10 10M17 7 7 17" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  note: (
    <>
      <ellipse
        cx="8"
        cy="17.2"
        rx="3.2"
        ry="2.2"
        transform="rotate(-18 8 17.2)"
        fill="currentColor"
        stroke="none"
      />
      <path d="M10.8 16.2V4.8" />
      <path d="M10.8 5.2c2.4.7 5.6 1.3 8.2 1.5v2.1" />
    </>
  ),
  flower: (
    <>
      <path d="M12 12c-2.2-4.4-1.1-7.4 0-8.4 1.1 1 2.2 4 0 8.4Z" />
      <path d="M12 12c4.4-2.2 7.4-1.1 8.4 0-1 1.1-4 2.2-8.4 0Z" />
      <path d="M12 12c2.2 4.4 1.1 7.4 0 8.4-1.1-1-2.2-4 0-8.4Z" />
      <path d="M12 12c-4.4 2.2-7.4 1.1-8.4 0 1-1.1 4-2.2 8.4 0Z" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  replay: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4.5V9h-4.5" />
    </>
  ),
  diamond: <path d="m12 3 8 9-8 9-8-9z" />,
};

export function Icon({
  name,
  className = "",
  ...props
}: { name: keyof typeof glyphs } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={`icon ${className}`.trim()}
    >
      {glyphs[name]}
    </svg>
  );
}
