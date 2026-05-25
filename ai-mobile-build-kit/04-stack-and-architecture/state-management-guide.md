# State Management Guide

Use the smallest state tool that solves the problem.

## Decision Tree

Use local component state when:

- State only affects one component.
- State resets when the screen closes.
- State is form input, toggles, selected tab, local modal visibility, or temporary UI state.

Use route params when:

- State identifies a screen resource.
- The value belongs in the URL-like route.
- The value is needed for navigation.

Use Zustand when:

- Multiple screens need the same client state.
- State needs shared actions.
- The app needs simple global preferences or collections.

Use AsyncStorage when:

- State must survive app restart.
- Data is small and safe to store locally.
- Data does not require secure storage.

Use a backend when:

- Data must sync across devices.
- Multiple users share data.
- Admin tools need access.
- Data size or relational behavior exceeds simple local storage.

## Zustand Store Template

```ts
type ExampleState = {
  items: ExampleItem[];
  isHydrated: boolean;
  addItem: (item: ExampleItem) => void;
  removeItem: (id: string) => void;
};
```

Rules:

- Keep actions explicit.
- Do not mutate state directly unless using approved middleware.
- Do not store secrets.
- Do not put navigation inside stores.
- Keep persistence logic isolated.

## Derived State

Compute derived values in selectors or components:

- Counts.
- Filtered lists.
- Completion percentages.
- Display labels.

Avoid storing derived state unless it is expensive and measured.

## Done Looks Like

State management is healthy when each value has one obvious owner and app restart behavior is intentional.
