# no-t-inside-trans-functions

Disallow `t` function calls inside translation functions or components.

## Rule Details

This rule prevents the use of `t` macro calls within `Trans`, `Plural` components or `plural` function calls. These contexts already handle internationalization, so using `t` inside them is redundant and can cause issues.

Examples of **incorrect** code for this rule:

```jsx
import { t, Trans, Plural, plural } from '@lingui/macro'

// ❌ Using t inside Trans component
<Trans>
  {t`Hello world`}
</Trans>

// ❌ Using t inside Plural component
<Plural
  value={count}
  one="one book"
  other={t`${count} books`}
/>

// ❌ Using t inside plural function
plural(count, {
  one: "one book",
  other: t`There are ${count} books`,
})
```

Examples of **correct** code for this rule:

```jsx
import { t, Trans, Plural, plural } from '@lingui/macro'

// ✅ Using t outside translation contexts
const message = t`Hello world`

// ✅ Using Trans without nested t calls
<Trans>Hello world</Trans>

// ✅ Using Plural with direct strings or expressions
<Plural
  value={count}
  one="one book"
  other={`${count} books`}
/>

// ✅ Using plural with direct strings
plural(count, {
  one: "one book",
  other: "There are many books",
})
```

## Why?

- `Trans`, `Plural` components and `plural` function already provide internationalization functionality
- Nesting `t` calls inside these contexts is redundant and unnecessary
- It can lead to double-processing of translations
- It makes the code more complex and harder to maintain

## When Not To Use It

This rule should generally always be enabled when using Lingui, as nesting `t` calls is rarely the intended behavior.
