import { useRef } from "react";
import { Star } from "./Star.jsx";
import { getFillStates } from "../lib/rating.js";
import { useRating } from "../hooks/useRating.js";

const KEY_TO_DIRECTION = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
};

export function StarRating({
  id,
  label,
  starCount = 5,
  allowHalf = true,
  initialRating = 0,
  size = 32,
}) {
  const containerRef = useRef(null);
  const {
    displayRating,
    rating,
    isHovering,
    handlePointerMove,
    handlePointerLeave,
    handleClick,
    handleKeyStep,
  } = useRating({ id, starCount, allowHalf, initialRating });

  const fillStates = getFillStates(displayRating, starCount);

  function fractionFromEvent(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return (event.clientX - bounds.left) / bounds.width;
  }

  function handleKeyDown(event) {
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction === undefined) return;
    event.preventDefault();
    handleKeyStep(direction);
  }

  return (
    <div className="star-rating-widget">
      {label && (
        <span className="star-rating-label" id={id ? `${id}-label` : undefined}>
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        className="star-rating-stars"
        role="slider"
        tabIndex={0}
        aria-labelledby={label && id ? `${id}-label` : undefined}
        aria-label={label ? undefined : "Star rating"}
        aria-valuemin={0}
        aria-valuemax={starCount}
        aria-valuenow={rating}
        aria-valuetext={`${rating} out of ${starCount} stars`}
        onKeyDown={handleKeyDown}
        onPointerLeave={handlePointerLeave}
      >
        {fillStates.map((state, index) => (
          <Star
            key={index}
            state={state}
            size={size}
            onPointerMove={(event) =>
              handlePointerMove(index, fractionFromEvent(event))
            }
            onClick={(event) => handleClick(index, fractionFromEvent(event))}
          />
        ))}
      </div>
      <span className="star-rating-value" aria-hidden="true">
        {isHovering ? displayRating : rating}
        <span className="star-rating-max">/{starCount}</span>
      </span>
    </div>
  );
}
