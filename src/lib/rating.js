// Pure logic for a star rating widget. No DOM, no React — safe to unit test directly.

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a value to the nearest step (e.g. 0.5 for half-stars, 1 for whole stars).
 */
export function roundToStep(value, step) {
  if (step <= 0) throw new Error("step must be greater than 0");
  return Math.round(value / step) * step;
}

/**
 * Given a pointer's fractional position within a specific star, returns the
 * resulting rating value.
 *
 * @param {number} starIndex - zero-based index of the star being hovered/clicked
 * @param {number} fraction - 0..1 position across that star's width (0 = left edge)
 * @param {boolean} allowHalf - whether half-star precision is enabled
 */
export function ratingFromPointer(starIndex, fraction, allowHalf) {
  if (starIndex < 0) throw new Error("starIndex must be >= 0");
  const clampedFraction = clamp(fraction, 0, 1);
  const base = starIndex + 1;

  if (!allowHalf) {
    return base;
  }

  return clampedFraction <= 0.5 ? base - 0.5 : base;
}

/**
 * Returns an array of fill states ("full" | "half" | "empty"), one per star,
 * describing how a given rating should render across `starCount` stars.
 */
export function getFillStates(rating, starCount) {
  if (starCount <= 0) throw new Error("starCount must be > 0");
  const clampedRating = clamp(rating, 0, starCount);
  const states = [];

  for (let i = 0; i < starCount; i++) {
    const starValue = i + 1;
    if (clampedRating >= starValue) {
      states.push("full");
    } else if (clampedRating >= starValue - 0.5) {
      states.push("half");
    } else {
      states.push("empty");
    }
  }

  return states;
}

/**
 * Moves a rating up/down by `step`, clamped to [0, starCount].
 * Used for keyboard arrow-key navigation.
 */
export function stepRating(currentRating, direction, step, starCount) {
  const delta = direction >= 0 ? step : -step;
  return clamp(roundToStep(currentRating + delta, step), 0, starCount);
}
