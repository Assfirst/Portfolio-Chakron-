// script.js
let resultDisplayed = false;

function appendToDisplay(value) {
    console.log("Appending:", value);
    if (resultDisplayed) {
        clearDisplay();
        resultDisplayed = false;
    }
    document.getElementById('input-output').value += value;
}

function calculateTrigonometry(funcName) {
    const inputOutput = document.getElementById('input-output');
    let expression = inputOutput.value;

    try {
        const funcIndex = expression.lastIndexOf(funcName + '(');
        if (funcIndex === -1) {
            throw new Error('Invalid input for trigonometry function');
        }

        let openBracketCount = 0;
        let closeBracketIndex = -1;
        for (let i = funcIndex + funcName.length + 1; i < expression.length; i++) {
            if (expression[i] === '(') {
                openBracketCount++;
            } else if (expression[i] === ')') {
                if (openBracketCount === 0) {
                    closeBracketIndex = i;
                    break;
                } else {
                    openBracketCount--;
                }
            }
        }

        if (closeBracketIndex === -1) {
            throw new Error('Missing closing bracket for trigonometry function');
        }

        const arg = expression.substring(funcIndex + funcName.length + 1, closeBracketIndex);
        const number = parseFloat(arg);
        if (isNaN(number)) {
            throw new Error('Invalid argument for trigonometry function');
        }

        const radians = number * (Math.PI / 180);
        let result;

        switch (funcName) {
            case 'sin': result = Math.sin(radians); break;
            case 'cos': result = Math.cos(radians); break;
            case 'tan': result = Math.tan(radians); break;
            case 'asin': result = Math.asin(number) * (180 / Math.PI); break;
            case 'acos': result = Math.acos(number) * (180 / Math.PI); break;
            case 'atan': result = Math.atan(number) * (180 / Math.PI); break;
            default: throw new Error('Invalid trigonometry function');
        }

        expression = expression.substring(0, funcIndex) + result + expression.substring(closeBracketIndex + 1);
        inputOutput.value = expression;
        resultDisplayed = true;

    } catch (error) {
        console.error("Error in calculateTrigonometry():", error);
        inputOutput.value = 'Error: ' + error.message;
        resultDisplayed = true;
    }
}


function factorial(n) {
    if (n === 0) {
        return 1;
    } else if (n < 0) {
        return "Error: Factorial is not defined for negative numbers";
    } else {
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}


function calculate() {
    try {
        let expression = document.getElementById('input-output').value;
        console.log("Expression:", expression);

        expression = expression.replace(/÷/g, '/');

        const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
        for (const func of trigFunctions) {
            while (expression.includes(func + '(')) {
                calculateTrigonometry(func);
                expression = document.getElementById('input-output').value;
            }
        }
        
          expression = expression.replace(/(\d+)!\)?/g, (match, num) => {
            const factResult = factorial(parseInt(num));
            if (typeof factResult === 'string' && factResult.startsWith("Error")) {
                throw new Error(factResult); // Throw the error message
            }
            return factResult;
        });
    

        const result = math.evaluate(expression);
        console.log("Result:", result);
        document.getElementById('input-output').value = result;
        resultDisplayed = true;
    } catch (error) {
        console.error("Error in calculate():", error);
       document.getElementById('input-output').value = 'Error: ' + error.message;
        resultDisplayed = true;
    }
}

function clearDisplay() {
    console.log("Clearing display");
    document.getElementById('input-output').value = '';
    resultDisplayed = false;
}


function parseSet(str) {
    if (!str || str.trim() === '') {
        return undefined;
    }

    const cleanedStr = str.replace(/[{}]/g, '').trim();
    if (cleanedStr === '') {
      return new Set();
    }


    const elements = cleanedStr.split(/[\s,]+/).map(x => {
        const trimmed = x.trim();
        if (trimmed === '') return NaN; // Skip empty elements
        const num = parseFloat(trimmed);
          return isNaN(num) ? trimmed : num;
    }).filter(x => !isNaN(x) || typeof x === 'string'); // Filter out NaN

  if (elements.some(isNaN)) {
        return undefined;
    }

    return new Set(elements);
}



function formatSet(set) {
    return '{' + Array.from(set).join(', ') + '}';
}

function setUnion(...sets) {
    try {
      if (sets.some(set => !(set instanceof Set))) {
        throw new Error('Invalid input: All arguments must be sets.');
        }
        const union = new Set();
        for (const set of sets) {
            for (const element of set) {
                union.add(element);
            }
        }
        return union;
    } catch (error) {
        console.error("Error in setUnion():", error);
        return 'Error: ' + error.message;
    }
}


function setIntersection(...sets) {
    try {
           if (sets.some(set => !(set instanceof Set))) {
             throw new Error('Invalid input: All arguments must be sets.');
           }
        let intersection = new Set(sets[0]);
        for (let i = 1; i < sets.length; i++) {
             intersection = new Set([...intersection].filter(x => sets[i].has(x)));
        }
        return intersection;
    } catch (error) {
        console.error("Error in setIntersection():", error);
         return 'Error: ' + error.message;
    }
}

function setDifference(setA, setB) {
  try {
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
       throw new Error('Invalid input: Both arguments must be sets.');
      }
    const difference = new Set([...setA].filter(x => !setB.has(x)));
      return difference;
    } catch (error) {
        console.error("Error in setDifference():", error);
         return 'Error: ' + error.message;
    }
}

function calculateSetOperation(operation, ...sets) {
    try {
         const result = operation(...sets);
        if (result instanceof Set) {
            document.getElementById('input-output').value = formatSet(result);
        } else {
            document.getElementById('input-output').value = result;
        }
        resultDisplayed = true;
    } catch (error) {
        console.error("Error in calculateSetOperation():", error);
        document.getElementById('input-output').value = 'Error: ' + error.message;
        resultDisplayed = true;
    }
}


async function inputSet() {
  try {
      const { value: text } = await Swal.fire({
        title: 'ป้อนสมาชิกของเซต (คั่นด้วย ,)',
          input: 'text',
        inputPlaceholder: 'เช่น 1, 2, 3',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
          inputValidator: (value) => {
            if (!value) {
                return 'กรุณาป้อนข้อมูล';
            }
              const parsedSet = parseSet(value);
              if (parsedSet === undefined) {
                  return 'ข้อมูลเซตไม่ถูกต้อง';
              }
        }
    });
      if (text) {
          return parseSet(text);
        }
      return null; // User cancelled
    } catch(error) {
    console.error("Error in inputSet:", error)
       Swal.fire('Error', 'เกิดข้อผิดพลาดในการป้อนข้อมูล', 'error');
         return null;
   }
}


async function handleSetUnion() {
    const setA = await inputSet();
    if (setA === null) return;
    const setB = await inputSet();
    if (setB === null) return;
    calculateSetOperation(setUnion, setA, setB);
}


async function handleSetIntersection() {
    const setA = await inputSet();
    if (setA === null) return;
    const setB = await inputSet();
    if (setB === null) return;
    calculateSetOperation(setIntersection, setA, setB);
}


async function handleSetDifference() {
    const setA = await inputSet();
    if (setA === null) return;
    const setB = await inputSet();
    if (setB === null) return;
    calculateSetOperation(setDifference, setA, setB);
}


function solveEquation() {
    try {
        let equation = document.getElementById('input-output').value;

        const sides = equation.split('=');
        if(sides.length !== 2) {
            throw new Error('สมการต้องมีเครื่องหมาย = ');
        }
      
        const leftSide = sides[0].trim();
        const rightSide = sides[1].trim();

        if (!leftSide.includes('x') && !rightSide.includes('x')) {
            throw new Error('สมการต้องมีตัวแปร x');
        }

        const solution = math.solve(math.parse(leftSide), math.parse(rightSide), 'x');
      
      if (typeof solution === 'undefined' || solution === null) {
          throw new Error('ไม่สามารถหาคำตอบของสมการนี้ได้');
      }

        document.getElementById('input-output').value = 'x = ' + solution.toString();
        resultDisplayed = true;

    } catch (error) {
        console.error("Error in solveEquation():", error);
       document.getElementById('input-output').value = 'Error: ' + error.message;
        resultDisplayed = true;
    }
}


function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.calculator').classList.toggle('dark-mode');
    document.querySelector('.display input').classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(button => {
      button.classList.toggle('dark-mode');
      if (['+', '-', '*', '/', '(', ')', '√', '^', '!', '%', '∪', '∩', '∖'].includes(button.textContent)) {
          button.classList.toggle('operator');
        }
      if (['='].includes(button.textContent)) {
          button.classList.toggle('equal');
      }
    });
}


function backspace() {
    const inputOutput = document.getElementById('input-output');
    inputOutput.value = inputOutput.value.slice(0, -1);
}


async function appendFraction() {
    const { value: fraction } = await Swal.fire({
        title: 'ป้อนเศษส่วน',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="เศษ">' +
            '<input id="swal-input2" class="swal2-input" placeholder="ส่วน">',
        focusConfirm: false,
        preConfirm: () => {
            const numerator = document.getElementById('swal-input1').value;
            const denominator = document.getElementById('swal-input2').value;
           if (denominator === '0' || !numerator || !denominator) {
                Swal.showValidationMessage('ส่วนต้องไม่เป็น 0 และกรุณาใส่เศษและส่วน');
            }
             if (!/^\d+$/.test(numerator) || !/^\d+$/.test(denominator)) {
                 Swal.showValidationMessage('กรุณาใส่เฉพาะตัวเลขในเศษและส่วน');
           }
            return { numerator, denominator };
        }
    });

    if (fraction) {
        appendToDisplay(`(${fraction.numerator}/${fraction.denominator})`);
    }
}


async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        let formattedText = text.replace(/\s/g, '');
        formattedText = formattedText.replace(/(\d+)\/(\d+)/g, '($1/$2)');
        appendToDisplay(formattedText);
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        Swal.fire('Error', 'ไม่สามารถอ่านข้อมูลจากคลิปบอร์ดได้', 'error');
    }
}


function showTruthTable() {
    Swal.fire({
        title: 'ตารางค่าความจริง',
        html:
            '<label for="num-vars">จำนวนตัวแปร:</label>' +
            '<input id="num-vars" class="swal2-input" type="number" min="1" value="2">' +
            '<br>' +
            '<label for="expression">นิพจน์ตรรกศาสตร์:</label>' +
            '<input id="expression" class="swal2-input" placeholder="เช่น p && q">' +
           '<br><small>ใช้สัญลักษณ์: && (AND), || (OR), ! (NOT), ^ (XOR), -> (Implication), <-> (Biconditional)</small>',
        focusConfirm: false,
        preConfirm: () => {
           const numVars = parseInt(document.getElementById('num-vars').value);
            const expression = document.getElementById('expression').value;

           if (numVars < 1) {
                Swal.showValidationMessage('จำนวนตัวแปรต้องมากกว่า 0');
            }
            if (!expression) {
                Swal.showValidationMessage('กรุณาป้อนนิพจน์ตรรกศาสตร์');
            }
             if (!/^[pqrs!\(\)&|<>^= ]+$/.test(expression)){
                 Swal.showValidationMessage('กรุณาป้อนเฉพาะตัวอักษร p,q,r,s หรือสัญลักษณ์ทางตรรกศาสตร์เท่านั้น');
            }
             return { numVars, expression };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { numVars, expression } = result.value;
            try {
                const truthTable = generateTruthTable(numVars, expression);
                displayTruthTable(truthTable, expression);
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    });
}


function generateTruthTable(numVars, expression) {
    const variables = [];
    for (let i = 0; i < numVars; i++) {
        variables.push(String.fromCharCode(112 + i));
    }

    const header = [...variables, expression];
    const rows = [];

    for (let i = 0; i < Math.pow(2, numVars); i++) {
        const row = [];
        const binary = i.toString(2).padStart(numVars, '0');

        for (let j = 0; j < numVars; j++) {
            row.push(binary[j] === '1');
        }

         try {
        const expressionValue = evaluateExpression(expression, variables, row);
          row.push(expressionValue);
        } catch (error) {
           throw new Error(`Error evaluating expression: ${error.message}`);
       }
        rows.push(row);
    }

    return { header, rows };
}

function convertLogicalSymbols(expression) {
    return expression.replace(/&&/g, '&')
                     .replace(/\|\|/g, '|')
                     .replace(/!/g, '~')
                     .replace(/\^/g, '^')
                    .replace(/->/g, '<=')
                   .replace(/<->/g, '==');
}

function evaluateExpression(expression, variables, values) {
    let parsedExpression = expression;

    for (let i = 0; i < variables.length; i++) {
        const regex = new RegExp(variables[i], 'g');
        parsedExpression = parsedExpression.replace(regex, values[i].toString());
    }

     parsedExpression = convertLogicalSymbols(parsedExpression)

    try {
        return math.evaluate(parsedExpression);
    } catch (error) {
        throw new Error('Invalid logical expression: ' + error.message);
    }
}

function displayTruthTable(truthTable, expression) {
    const tableHtml = `
        <h3>ตารางค่าความจริงสำหรับ ${expression}</h3>
        <table class="truth-table">
            <thead>
                <tr>
                    ${truthTable.header.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${truthTable.rows.map(row => `
                    <tr>
                        ${row.map(val => `<td class="${val ? 'true' : 'false'}">${val}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    Swal.fire({
        html: tableHtml,
        width: 'auto',
        customClass: {
            popup: 'truth-table-popup'
        }
    });
            }
