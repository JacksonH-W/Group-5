import { describe, it, expect, beforeEach } from "vitest";
import { computeLocks, UNLOCKS_KEY } from "./progress";

const UNITS_FIXTURE = [
  {
    id: 1,
    lessons: [{ stepId: 1 }, { stepId: 2 }],
  },
  {
    id: 2,
    lessons: [{ stepId: 1 }],
  },
];

describe("computeLocks", () => {
  beforeEach(() => {
    // Ensure override is not enabled unless a test sets it
    localStorage.removeItem(UNLOCKS_KEY);
  });

  it("unlocks Unit 1 step 1 by default, locks Unit 2 until Unit 1 complete", () => {
    const progress = { completed: {} };
    const locks = computeLocks(UNITS_FIXTURE, progress);

    expect(locks[1][1]).toBe(false); // Unit 1, Step 1 unlocked
    expect(locks[1][2]).toBe(true);  // Step 2 locked until Step 1 complete
    expect(locks[2][1]).toBe(true);  // Unit 2 locked until Unit 1 fully complete
  });

  it("unlock override disables all locks", () => {
    // In your code: localStorage value "off" => locks disabled
    localStorage.setItem(UNLOCKS_KEY, "off");

    const progress = { completed: {} };
    const locks = computeLocks(UNITS_FIXTURE, progress);

    // Everything should be unlocked (false)
    expect(locks[1][1]).toBe(false);
    expect(locks[1][2]).toBe(false);
    expect(locks[2][1]).toBe(false);
  });
});