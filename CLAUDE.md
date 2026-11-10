# Design system rules

## Tokens
- Use only semantic CSS variables from build/web/tokens.css (e.g. var(--color-action-primary)).
- Never use primitive tokens (--color-blue-600) or raw values (hex, px for color/spacing/radius) in components.
- If Figma uses a value with no matching token, stop and list it; do not invent a token or hard-code it.
- Never edit tokens/ or build/ while building components. Token changes go through the Figma export.

## Components
- One folder per component in src/components/<Name>/: <Name>.tsx, <Name>.module.css, <Name>.stories.tsx.
- Props mirror Figma properties in camelCase: Variant=Secondary → variant="secondary".
- Interaction states (Hover, Focus, Pressed) are CSS (:hover, :focus-visible, :active), not props.
- Data states (Disabled, Error, Checked) are props, using native HTML attributes where possible.
- Composite components import other components (Card uses Badge and Button); never copy their styles.
- Accessibility: real <button>/<input>, labels tied to inputs, errors linked with aria-describedby, visible focus ring with var(--color-border-focus).
- Export every component from src/components/index.ts.

## Stories
- tags: ['autodocs']; one story per Figma variant that matters, plus Disabled/Error where they exist.
- Use Figma's sample text in stories, so Storybook and Figma can be compared side by side.
