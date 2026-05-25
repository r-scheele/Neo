# Asset Inventory Template

Use this as the source of truth for generated visual assets.

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `[SCREEN]` | `[ASSET_NAME]` | `[WHY_IT_EXISTS]` | `[PROMPT_FILE]` | `[FILE_NAME]` | `[PLANNED/GENERATED/APPROVED/NEEDS_REWORK/IN_APP]` | `[NOTES]` |

## Status Definitions

- Planned: asset is needed but not generated.
- Generated: first output exists.
- Approved: product owner accepted it.
- Needs rework: prompt or output must be revised.
- In app: asset has been imported and used in the codebase.

## Asset Review Notes

For each approved asset, record:

- Background requirement: `[transparent/light/dark/branded]`
- Safe crop notes: `[NOTES]`
- Related screen: `[SCREEN]`
- Replacement risk: `[LOW/MED/HIGH]`

## Done Looks Like

The inventory is useful when every image in the app has a purpose, source prompt, file name, and status.
