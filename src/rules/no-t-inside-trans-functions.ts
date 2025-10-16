import { Rule } from 'eslint'
import { TSESTree } from '@typescript-eslint/utils'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `t` function calls inside translation functions or components',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      noTInsideTransFunctions:
        '`t` function calls cannot be used inside `Trans`, `Plural` components or `plural` function calls.',
    },
    schema: [], // No options for this rule
  },

  create: (context) => {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

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

        parent = parent.parent
      }

      return false
    }

    return {
      'TaggedTemplateExpression[tag.name=t]'(node: any) {
        if (isInsideTransFunction(node)) {
          context.report({
            node,
            messageId: 'noTInsideTransFunctions',
          })
        }
      },

      'CallExpression[callee.name=t]'(node: any) {
        if (isInsideTransFunction(node)) {
          context.report({
            node,
            messageId: 'noTInsideTransFunctions',
          })
        }
      },
    }
  },
}

export default rule
