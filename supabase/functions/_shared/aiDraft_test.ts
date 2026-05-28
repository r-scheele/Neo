import {
  classifyDraftRouting,
  parseAiDraftPreferences,
  safeDraftPreview,
} from "./aiDraft.ts";

Deno.test("AI draft preferences accept only approved safe fields", () => {
  const preferences = parseAiDraftPreferences({
    approvalGuardrails: {
      complaints: false,
      discounts: true,
      receipts: true,
      refunds: true,
    },
    customerAddress: "first-name",
    privatePrompt: "do not keep this",
    replyLength: "detailed",
    tone: "friendly",
    useNigerianEnglish: false,
  });

  if (preferences.tone !== "friendly") {
    throw new Error("Expected approved tone to be preserved.");
  }

  if ("privatePrompt" in preferences) {
    throw new Error("Unexpected unapproved preference field.");
  }
});

Deno.test("low confidence AI drafts require approval", () => {
  const routing = classifyDraftRouting({
    confidence: 49,
    preferences: parseAiDraftPreferences({}),
    riskCategory: "none",
    riskReasons: [],
  });

  if (!routing.approvalRequired || routing.reasonCode !== "low_confidence") {
    throw new Error("Expected low confidence draft to route to approval.");
  }
});

Deno.test("sensitive guardrail categories require approval", () => {
  const routing = classifyDraftRouting({
    confidence: 88,
    preferences: parseAiDraftPreferences({
      approvalGuardrails: { complaints: true },
    }),
    riskCategory: "complaint",
    riskReasons: ["Complaint detected"],
  });

  if (!routing.approvalRequired || routing.reasonCode !== "sensitive_guardrail") {
    throw new Error("Expected complaint draft to route to approval.");
  }
});

Deno.test("safe draft preview limits text without leaking full draft", () => {
  const preview = safeDraftPreview(
    "Good afternoon. This is a deliberately long draft that should be shortened before it is used in logs or compact metadata.",
    42,
  );

  if (preview.length > 42 || !preview.endsWith("...")) {
    throw new Error("Expected shortened draft preview.");
  }
});
