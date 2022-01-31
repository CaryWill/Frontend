function tokenizer(input) {
  // 将 input 分离成组成语法的基本单元
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];

    // 空格跳过
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 数字
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        char = tokens[++current];
      }
      tokens.push({ type: 'number', value })
      continue;
    }

    // 四则运算符
    const ARITHMETI_COPERATOR = /[+*\/-]/;
    if (ARITHMETI_COPERATOR.test(char)) {
      tokens.push({ type: "operator", value: char })
      current++;
      continue;
    }

    if (char === "(") {
      tokens.push({ type: 'operator', value: "(" })
      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "operator", value: ")" })
      current++;
      continue;
    }

    throw new TypeError('Invalid char found');

  }
  return tokens;
}

// console.log(tokenizer("(1+2)/3"));
// [
//   { type: 'operator', value: '(' },
//   { type: 'number', value: '1' },
//   { type: 'operator', value: '+' },
//   { type: 'number', value: '2' },
//   { type: 'operator', value: ')' },
//   { type: 'operator', value: '/' },
//   { type: 'number', value: '3' }
// ]

// https://stackoverflow.com/a/12381550/10190407 一开始看到这个
// https://zh.wikipedia.org/zh-tw/调度场算法 这个比英文版详细
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm 英文版
// https://en.wikipedia.org/wiki/Reverse_Polish_notation RPN
const hasHigherPriority = (operator, target) => {
  if (target === '(') return true;
  if (operator === '*' || operator === '/') {
    if (target === '+' || target === '-') {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function parser(tokens) {
  let current = 0;

  // 先将数学表达式转换成 RPN 方便计算机处理运算符号优先级的问题
  let outputQueue = [];
  let operatorStack = [];
  while (current < tokens.length) {
    // 数字的直接 push 到 output queue 去
    const token = tokens[current];
    if (token.type === 'number') {
      outputQueue.push(token.value);
    } else if (token.type === 'operator') {
      // 如果是一个运算符
      if (operatorStack.length === 0) {
        operatorStack.push(token.value);
      } else {
        // NOTE: 这里只考虑四则运算，而四则运算运算符都是左结合

        if (token.value === '(') {
          // 如果这个 token 是一个做括号，那么将它 push 到 operatorStack 中 
          operatorStack.push(token.value);
        } else if (token.value === ')') {
          // 如果这个 token 是一个右括号，那么：
          // 从 operatorStack 中不断 pop 运算符并且 push 到 outputQueue 队列中，知道 operatorStack 顶部的运算符尾左括号为止。
          // 将左括号从 operatorStack 的顶端 pop 出去，但并不放入到 outputQueue 队列中去。
          while (operatorStack[operatorStack.length - 1] !== '(') {
            const operator = operatorStack.pop();
            outputQueue.push(operator);
          }
          operatorStack.pop();
        } else {
          // 只要存在另一个记为 o2 的运算符位于 operatorStack 栈的顶端，并且
          // 如果 token 是左结合性的并且它的运算符的优先级要小于或者等于 o2 的优先级
          // 那么将 o2 从 operatorStack 栈的顶端 pop 出来并且放入到 outputQueue 队列中（loop 直至以上的条件不满足为止）
          // 然后将 token push 到 operatorStack 去
          while (!hasHigherPriority(token.value, operatorStack[operatorStack.length - 1]) && operatorStack.length > 0) {
            const operator = operatorStack.pop();
            outputQueue.push(operator);
          }
          operatorStack.push(token.value);
        }
      }
    }
    current++;
  }

  // 当没有 token 可以读取时: 将 operatorStack 里的运算符逐个 pop 并 push 到 outputQueue 队列中
  while (operatorStack.length > 0) {
    const operator = operatorStack.pop();
    outputQueue.push(operator);
  }

  // Now outputQueue.join('') is RPN

  // Convert To Binary Tree // AST
  // https://stackoverflow.com/a/12381550/10190407
  // This is how I would do it: just like the stack based approach, 
  // use a stack of nodes. When you encounter an operator, you pop 2 items from the stack, 
  // but instead of evaluating, you create a node with the operator, 
  // and make it the parent of the 2 popped items. 
  // Then you push the node back on the stack.

  const stack = [];
  while (outputQueue.length > 0) {
    const token = outputQueue.shift();
    const NUMBERS = /[0-9]/;
    const ARITHMETI_COPERATOR = /[+*\/-]/;
    if (NUMBERS.test(token)) {
      stack.push(token);
    } else if (ARITHMETI_COPERATOR.test(token)) {
      const right = stack.pop();
      const left = stack.pop();
      stack.push({
        type: 'BinaryExpression',
        operator: token,
        left: NUMBERS.test(left) ? {
          type: 'Literal',
          value: left
        } : left,
        right: NUMBERS.test(right) ? {
          type: 'Literal',
          value: right
        } : right,
      });
    }
  }

  let ast = {
    type: 'Program',
    body: [stack[0]],
  };

  return ast;
}

// parser(tokenizer('1+2*3+4/5*1')); // RPN: 123*+45/1*+ 
// parser(tokenizer('1+(2+3)*4*5*6')); 
// console.log(JSON.stringify(parser(tokenizer('1+(2+3)*4*5*6'))));

function noopTransformer(ast) {

  // depth-first traversal
  function traverser(ast, visitor) {
    function traverseNode(node, parent) {
      let { enter, exit } = visitor[node.type] || {};
      if (enter) enter(node, parent);
      switch (node.type) {
        case 'Program':
          node.body.forEach(child => {
            traverseNode(child, node.body);
          })
          break;
        case 'BinaryExpression':
          traverseNode(node.left, node);
          traverseNode(node.right, node);
          break;
        case 'Literal':
          break;
        default:
          throw new TypeError(node.type);
      }
      if (exit) exit(node, parent);
    }
    traverseNode(ast, null);
  }

  let newAst = {
    type: 'Program',
    body: [],
  };

  traverser(ast, {
    BinaryExpression: {
      enter(node, parent) {
        newAst.body.push(node);
        console.log('enter:', node.operator);
      },
      exit(node, parent) {
        console.log('exit', node.operator);
      }
    },
    Literal: {
      enter(node, parent) {
        newAst.body.push(node);
        console.log('enter:', node.value);
      },
    }
  });
}

// console.log(noopTransformer(parser(tokenizer('1+2*3'))));

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');
    case 'BinaryExpression':
      return `(${codeGenerator(node.left)}${node.operator}${codeGenerator(node.right)})`;
    case 'Literal':
      return node.value;
    default:
      throw new TypeError(node.type);
  }
}

// console.log(codeGenerator(parser(tokenizer('(1+2)*(3+1)'))));
// console.log(JSON.stringify(parser(tokenizer('(1+2)*3'))))