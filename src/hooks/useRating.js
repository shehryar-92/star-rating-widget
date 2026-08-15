import { useCallback, useEffect, useState } from "react";
import { clamp, ratingFromPointer, stepRating } from "../lib/rating.js";

const STORAGE_PREFIX = "star-rating:";

function readStoredRating(id) {
  if (!id) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredRating(id, value) {
  if (!id) return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, String(value));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — fail silently
  }
}

/**
 * @param {Object} options
 * @param {string} options.id - unique key for persisting this widget's rating
 * @param {number} [options.starCount=5]
 * @param {boolean} [options.allowHalf=true]
 * @param {number} [options.initialRating=0]
 */
export function useRating({
  id,
  starCount = 5,
  allowHalf = true,
  initialRating = 0,
}) {
  const [rating, setRating] = useState(
    () => readStoredRating(id) ?? initialRating,
  );
  const [hoverRating, setHoverRating] = useState(null);

  useEffect(() => {
    writeStoredRating(id, rating);
  }, [id, rating]);

  const commitRating = useCallback(
    (value) => {
      setRating(clamp(value, 0, starCount));
    },
    [starCount],
  );

  const handlePointerMove = useCallback(
    (starIndex, fraction) => {
      setHoverRating(ratingFromPointer(starIndex, fraction, allowHalf));
    },
    [allowHalf],
  );

  const handlePointerLeave = useCallback(() => {
    setHoverRating(null);
  }, []);

  const handleClick = useCallback(
    (starIndex, fraction) => {
      commitRating(ratingFromPointer(starIndex, fraction, allowHalf));
    },
    [allowHalf, commitRating],
  );

  const handleKeyStep = useCallback(
    (direction) => {
      setRating((current) =>
        stepRating(current, direction, allowHalf ? 0.5 : 1, starCount),
      );
    },
    [allowHalf, starCount],
  );

  return {
    displayRating: hoverRating ?? rating,
    rating,
    isHovering: hoverRating !== null,
    handlePointerMove,
    handlePointerLeave,
    handleClick,
    handleKeyStep,
  };
}
