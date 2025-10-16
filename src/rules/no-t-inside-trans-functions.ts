import { TSESTree } from '@typescript-eslint/utils'
import { createRule } from '../create-rule'

export const name = 'no-t-call-inside-trans-functions'
export const rule = createRule({
  name,
  meta: {
    docs: {
      description: 'Disallow `t` function calls inside translation functions or components',
      recommended: 'error',
    },
    messages: {
      default:
        '`t` function calls cannot be used inside `Trans`, `Plural` components, `plural` function calls, or other `t` calls.',
    },
    schema: [
      {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    ],
    type: 'problem' as const,
  },
  defaultOptions: [],

  create: (context) => {
    function isInsideTransFunction(node: TSESTree.Node): boolean {
      let parent = node.parent

      while (parent) {
        // Check for JSX elements: <Trans>, <Plural>
        if (parent.type === 'JSXElement' && parent.openingElement.name.type === 'JSXIdentifier') {
          const tagName = parent.openingElement.name.name
          if (tagName === 'Trans' || tagName === 'Plural') {
            return true
          }
        }

        // Check for function calls: plural()
        if (parent.type === 'CallExpression' && parent.callee.type === 'Identifier') {
          if (parent.callee.name === 'plural') {
            return true
          }
        }

        // Check for nested t calls: t`some text ${t`nested`}`
        if (parent.type === 'TaggedTemplateExpression' && parent.tag.type === 'Identifier') {
          if (parent.tag.name === 't') {
            return true
          }
        }

        // Check for nested t function calls: t('some text', { value: t('nested') })
        if (parent.type === 'CallExpression' && parent.callee.type === 'Identifier') {
          if (parent.callee.name === 't') {
            return true
          }
        }

        parent = parent.parent
      }

      return false
    }

    return {
      'TaggedTemplateExpression[tag.name=t]'(node: any) {
        if (isInsideTransFunction(node)) {
          context.report({
            node,
            messageId: 'default',
          })
        }
      },

      'CallExpression[callee.name=t]'(node: any) {
        if (isInsideTransFunction(node)) {
          context.report({
            node,
            messageId: 'default',
          })
        }
      },
    }
  },
})

// Export as default for compatibility with test
export default rule
