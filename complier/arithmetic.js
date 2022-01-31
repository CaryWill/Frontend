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
          // 如果這個記號是一個左括號，那麼就將其壓入棧當中
          operatorStack.push(token.value);
        } else if (token.value === ')') {
          // 如果這個記號是一個右括號，那麼：
          // 從棧當中不斷地彈出運算子並且放入輸出佇列中，直到棧頂部的元素為左括號為止。
          // 將左括號從棧的頂端彈出，但並不放入輸出佇列中去。
          while (operatorStack[operatorStack.length - 1] !== '(') {
            const operator = operatorStack.pop();
            outputQueue.push(operator);
          }
          operatorStack.pop();
        } else {
          // 只要存在另一個記為o2的運算子位於棧的頂端，並且
          // 如果o1是左結合性的並且它的運算子優先級要小於或者等於o2的優先級
          // 那麼將o2從棧的頂端彈出並且放入輸出佇列中（迴圈直至以上條件不滿足為止）
          // 然後，將o1壓入棧的頂端
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

  // 當再沒有記號可以讀取時：將運算子逐個彈出並放入輸出佇列中。
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