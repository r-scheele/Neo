import {
  auditMetadata,
  canPerformPermission,
  type BusinessRole,
} from "./permissions.ts";

Deno.test("receipt review decisions are owner or manager only", () => {
  const roles: readonly BusinessRole[] = ["owner", "manager", "staff"];

  assertEquals(
    roles.map((role) => canPerformPermission(role, "receipt.review_decide")),
    [true, true, false],
  );
});

Deno.test("staff may complete ordinary follow-ups", () => {
  assertEquals(canPerformPermission("staff", "follow_up.complete"), true);
});

Deno.test("audit metadata keeps safe fields only", () => {
  assertEquals(
    auditMetadata({
      actor_role: "manager",
      decision: "approved_after_bank_check",
      phone_number: "+2340000000000",
      raw_message: "private customer text",
      receipt_image_url: "https://example.invalid/private.png",
    }),
    {
      actor_role: "manager",
      decision: "approved_after_bank_check",
    },
  );
});

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}
