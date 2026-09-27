export function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`botanical ${className}`}
      viewBox="0 0 300 520"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.15">
        <path d="M148 510C110 385 224 300 146 55M147 415C78 361 75 299 54 253M156 346C238 295 240 230 259 192M164 265C101 226 96 162 69 126M158 175C209 140 214 82 211 37" />
        {[
          [146, 80, -25],
          [153, 132, 20],
          [160, 205, -25],
          [167, 279, 20],
          [156, 350, -30],
          [134, 420, 25],
          [82, 319, -50],
          [65, 277, -50],
          [226, 265, 40],
          [246, 219, 40],
          [97, 187, -45],
          [77, 148, -45],
          [198, 111, 35],
          [209, 64, 25],
        ].map(([x, y, r], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y}) rotate(${r})`}
            d="M0 0C-39-12-43-50-31-70C-2-54 9-24 0 0ZM0 0L-30-66"
          />
        ))}
      </g>
      <g fill="currentColor" opacity=".11">
        <ellipse
          cx="90"
          cy="255"
          rx="55"
          ry="105"
          transform="rotate(-26 90 255)"
        />
        <ellipse
          cx="204"
          cy="158"
          rx="40"
          ry="95"
          transform="rotate(24 204 158)"
        />
      </g>
    </svg>
  );
}
