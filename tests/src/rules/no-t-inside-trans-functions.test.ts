import { RuleTester } from 'eslint'
import rule from '../../../src/rules/no-t-inside-trans-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('no-t-inside-trans-functions', rule, {
  valid: [
    {
      code: `const message = t\`Hello\``,
    },
    {
      code: `plural(count, { one: "one book", other: "There are many books" });`,
    },
    {
      code: `<Trans>There are many books</Trans>`,
    },
    {
      code: `<Plural value={count} one="one book" other="many books" />`,
    },
    // # is okay
    {
      code: `<Plural value={count} one="one book" other="# books" />`,
    },
    {
      code: `<Plural value={count} one="one book" other={\`\${count} books\`} />`,
    },
  ],

  invalid: [
    {
      // Invalid: `t` inside `plural`
      code: `
        plural(count, {
          one: "one book",
          other: t\`There are \${count} books\`,
        });
      `,
      errors: [{ messageId: 'noTInsideTransFunctions' }],
    },
    {
      // Invalid: `t` inside `Plural`
      code: `<Plural value={count} one="one book" other={t\`\${count} books\`} />`,
      errors: [{ messageId: 'noTInsideTransFunctions' }],
    },
    {
      // Invalid: `t` inside `Trans`
      code: `
        <Trans>
          {t\`Hello\`}
        </Trans>;
      `,
      errors: [{ messageId: 'noTInsideTransFunctions' }],
    },
    {
      code: `t\`some text \${t\`some other text\`}\``,
      errors: [{ messageId: 'noTInsideTransFunctions' }],
    },
  ],
})
