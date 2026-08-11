const STAR_PATH =
  "M12 2.5l2.94 6.28 6.79.75-5.06 4.7 1.43 6.77L12 17.6l-6.1 3.4 1.43-6.77-5.06-4.7 6.79-.75z";

const FILL_PERCENT = { full: 100, half: 50, empty: 0 };

export function Star({ state, size = 32, onPointerMove, onPointerLeave, onClick }) {
  const fillPercent = FILL_PERCENT[state];

  return (
    <span
      className="star"
      style={{ width: size, height: size }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <svg
        className="star-outline"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
      <svg
        className="star-fill"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
    </span>
  );
}
