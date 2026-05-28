import {
  redactWebhookPayload,
  safeMessagePreview,
  verifyWebhookChallenge,
} from "./whatsapp.ts";

Deno.test("webhook challenge returns challenge for matching verify token", () => {
  const url =
    "https://example.test/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=secret-token&hub.challenge=challenge-123";

  assertEquals(verifyWebhookChallenge(url, "secret-token"), "challenge-123");
});

Deno.test("webhook challenge rejects wrong verify token", () => {
  const url =
    "https://example.test/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=challenge-123";

  assertEquals(verifyWebhookChallenge(url, "secret-token"), null);
});

Deno.test("redacted webhook payload removes private message and phone fields", () => {
  assertEquals(
    redactWebhookPayload({
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [
                  {
                    profile: { name: "Private Customer" },
                    wa_id: "15551234567",
                  },
                ],
                messages: [
                  {
                    from: "15551234567",
                    id: "wamid.test",
                    text: { body: "private customer message" },
                    type: "text",
                  },
                ],
              },
            },
          ],
        },
      ],
    }),
    {
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [
                  {
                    profile: { name: "[redacted]" },
                    wa_id: "[redacted]",
                  },
                ],
                messages: [
                  {
                    from: "[redacted]",
                    id: "wamid.test",
                    text: { body: "[redacted]" },
                    type: "text",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  );
});

Deno.test("safe message preview trims and limits customer text", () => {
  assertEquals(safeMessagePreview("  hello ".repeat(40), 16), "hello hello...");
});

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}
