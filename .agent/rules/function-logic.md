---
trigger: always_on
---

- when using any logic use function inside packages/core only 
- if you think the logic in the package is not enough to complete your work you should create a placeholder for that function inside the correct module in packages/core mock data
- UI-specific formatting functions (like `formatAgeRange`, date formatters, display helpers) should stay in the app layer (`apps/*/src/lib/`), not in `packages/core`
- `packages/core` should only contain pure business logic functions