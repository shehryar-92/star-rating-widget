import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  roundToStep,
  ratingFromPointer,
  getFillStates,
  stepRating,
} from "./rating.js";

describe("clamp", () => {
  test("keeps in-range values unchanged", () => {
    assert.equal(clamp(3, 0, 5), 3);
  });

  test("clamps below min", () => {
    assert.equal(clamp(-2, 0, 5), 0);
  });

  test("clamps above max", () => {
    assert.equal(clamp(9, 0, 5), 5);
  });
});

describe("roundToStep", () => {
  test("rounds to nearest half", () => {
    assert.equal(roundToStep(2.2, 0.5), 2);
    assert.equal(roundToStep(2.26, 0.5), 2.5);
    assert.equal(roundToStep(2.74, 0.5), 2.5);
    assert.equal(roundToStep(2.76, 0.5), 3);
  });

  test("rounds to nearest whole number", () => {
    assert.equal(roundToStep(2.4, 1), 2);
    assert.equal(roundToStep(2.6, 1), 3);
  });

  test("throws on non-positive step", () => {
    assert.throws(() => roundToStep(2, 0));
    assert.throws(() => roundToStep(2, -1));
  });
});

describe("ratingFromPointer", () => {
  test("whole-star mode ignores fraction entirely", () => {
    assert.equal(ratingFromPointer(2, 0.1, false), 3);
    assert.equal(ratingFromPointer(2, 0.9, false), 3);
  });

  test("half-star mode: left half of star yields a half rating", () => {
    assert.equal(ratingFromPointer(2, 0.1, true), 2.5);
    assert.equal(ratingFromPointer(2, 0.5, true), 2.5);
  });

  test("half-star mode: right half of star yields the full rating", () => {
    assert.equal(ratingFromPointer(2, 0.51, true), 3);
    assert.equal(ratingFromPointer(2, 1, true), 3);
  });

  test("clamps out-of-range fractions", () => {
    assert.equal(ratingFromPointer(0, -1, true), 0.5);
    assert.equal(ratingFromPointer(0, 2, true), 1);
  });

  test("throws on negative star index", () => {
    assert.throws(() => ratingFromPointer(-1, 0.5, true));
  });
});

describe("getFillStates", () => {
  test("whole rating produces exact full/empty split", () => {
    assert.deepEqual(getFillStates(3, 5), [
      "full",
      "full",
      "full",
      "empty",
      "empty",
    ]);
  });

  test("half rating produces a half star at the boundary", () => {
    assert.deepEqual(getFillStates(3.5, 5), [
      "full",
      "full",
      "full",
      "half",
      "empty",
    ]);
  });

  test("zero rating is all empty", () => {
    assert.deepEqual(getFillStates(0, 5), [
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
    ]);
  });

  test("max rating is all full", () => {
    assert.deepEqual(getFillStates(5, 5), [
      "full",
      "full",
      "full",
      "full",
      "full",
    ]);
  });

  test("clamps out-of-range ratings", () => {
    assert.deepEqual(getFillStates(-1, 3), ["empty", "empty", "empty"]);
    assert.deepEqual(getFillStates(10, 3), ["full", "full", "full"]);
  });

  test("throws on non-positive starCount", () => {
    assert.throws(() => getFillStates(2, 0));
  });
});

describe("stepRating", () => {
  test("steps up and down by the given increment", () => {
    assert.equal(stepRating(2, 1, 0.5, 5), 2.5);
    assert.equal(stepRating(2, -1, 0.5, 5), 1.5);
  });

  test("clamps at the top and bottom bounds", () => {
    assert.equal(stepRating(5, 1, 0.5, 5), 5);
    assert.equal(stepRating(0, -1, 0.5, 5), 0);
  });

  test("rounds a non-aligned current rating before stepping", () => {
    assert.equal(stepRating(2.2, 1, 0.5, 5), 2.5);
  });
});
