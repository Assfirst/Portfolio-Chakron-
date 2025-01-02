// โค้ด JavaScript ของคุณ (เหมือนเดิมทั้งหมด)
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
    let inputOutput = document.getElementById('input-output');
    let expression = inputOutput.value;

    try {
        // หาตำแหน่งของฟังก์ชันตรีโกณมิติ
        let funcIndex = expression.lastIndexOf(funcName + '(');
        if (funcIndex === -1) {
            throw new Error('Invalid input for trigonometry function');
        }

        // หาตำแหน่งของวงเล็บปิดที่สอดคล้องกัน
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

        // แยกส่วนที่เป็นอาร์กิวเมนต์ของฟังก์ชันตรีโกณมิติ
        let arg = expression.substring(funcIndex + funcName.length + 1, closeBracketIndex);

        // แปลงอาร์กิวเมนต์เป็นตัวเลข
        let number = parseFloat(arg);
        if (isNaN(number)) {
            throw new Error('Invalid argument for trigonometry function');
        }

        // แปลงมุมจากองศาเป็นเรเดียน (ถ้าจำเป็น)
        let radians = number * (Math.PI / 180);

        // คำนวณค่าตรีโกณมิติ
        let result;
        switch (funcName) {
            case 'sin':
                result = Math.sin(radians);
                break;
            case 'cos':
                result = Math.cos(radians);
                break;
            case 'tan':
                result = Math.tan(radians);
                break;
            case 'asin':
                result = Math.asin(number) * (180 / Math.PI); // แปลงผลลัพธ์กลับเป็นองศา
                break;
            case 'acos':
                result = Math.acos(number) * (180 / Math.PI); // แปลงผลลัพธ์กลับเป็นองศา
                break;
            case 'atan':
                result = Math.atan(number) * (180 / Math.PI); // แปลงผลลัพธ์กลับเป็นองศา
                break;
            default:
                throw new Error('Invalid trigonometry function');
        }

        // แทนที่ expression เดิมด้วยผลลัพธ์
        expression = expression.substring(0, funcIndex) + result + expression.substring(closeBracketIndex + 1);

        // แสดงผลลัพธ์
        inputOutput.value = expression;
        resultDisplayed = true;
    } catch (error) {
        console.error("Error in calculateTrigonometry():", error);
        inputOutput.value = 'Error';
        resultDisplayed = true;
    }
}

function factorial(n) {
    if (n === 0) {
        return 1;
    } else if (n < 0) {
        return "Error"; // แฟกทอเรียลไม่นิยามสำหรับจำนวนลบ
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

        // แปลงสัญลักษณ์ ÷ เป็น /
        expression = expression.replace(/÷/g, '/');

        // จัดการกับ sin, cos, tan, asin, acos, atan
        const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
        for (const func of trigFunctions) {
            while (expression.includes(func + '(')) {
                calculateTrigonometry(func);
                expression = document.getElementById('input-output').value; // อัปเดต expression
            }
        }

        // จัดการกับแฟกทอเรียล
        expression = expression.replace(/(\d+)!\)?/g, (match, num) => {
            return factorial(parseInt(num));
        });

        // ใช้ Math.js คำนวณ
        let result = math.evaluate(expression);
        console.log("Result:", result);

        document.getElementById('input-output').value = result;
        resultDisplayed = true;
    } catch (error) {
        console.error("Error in calculate():", error);
        document.getElementById('input-output').value = 'Error';
        resultDisplayed = true;
    }
}

function clearDisplay() {
    console.log("Clearing display");
    document.getElementById('input-output').value = '';
    resultDisplayed = false;
}

function parseSet(str) {
    if (str === null || str.trim() === '') {
      return undefined; // คืนค่า undefined ถ้า str เป็น null หรือว่างเปล่า
    }
    str = str.replace(/[{}]/g, ''); // ลบวงเล็บปีกกาออก
    let elements = str.split(/[\s,]+/).map(x => {
      let trimmed = x.trim(); // เรียก .trim() และเก็บค่าไว้ในตัวแปร
      if (trimmed === '') {
        return NaN; // ถ้า trimmed เป็น empty string ให้ return NaN
      }
      let num = parseFloat(trimmed);
      return isNaN(num) ? trimmed : num;
    });
    if (elements.some(isNaN)) {
      return undefined; // คืนค่า undefined ถ้ามี element ที่ไม่ใช่ตัวเลข
    }
    return new Set(elements);
  }

// ฟังก์ชันช่วยแปลง Set object กลับเป็น string
function formatSet(set) {
    return '{' + Array.from(set).join(', ') + '}';
}

// ฟังก์ชันสำหรับดำเนินการกับเซต (ยูเนียน)
function setUnion(...sets) {
    try {
        let union = new Set();
        for (let set of sets) {
            for (let element of set) {
                union.add(element);
            }
        }
        return union;
    } catch (error) {
        console.error("Error in setUnion():", error);
        return 'Error';
    }
}

// ฟังก์ชันสำหรับดำเนินการกับเซต (อินเตอร์เซกชัน)
function setIntersection(...sets) {
    try {
        let intersection = new Set(sets[0]);
        for (let i = 1; i < sets.length; i++) {
            intersection = new Set([...intersection].filter(x => sets[i].has(x)));
        }
        return intersection;
    } catch (error) {
        console.error("Error in setIntersection():", error);
        return 'Error';
    }
}

// ฟังก์ชันสำหรับดำเนินการกับเซต (ผลต่าง)
function setDifference(setA, setB) {
    try {
        if (!(setA instanceof Set) || !(setB instanceof Set)) {
            return 'Error: Invalid set input';
        }
        let difference = new Set([...setA].filter(x => !setB.has(x)));
        return difference;
    } catch (error) {
        console.error("Error in setDifference():", error);
        return 'Error';
    }
}

function calculateSetOperation(operation, ...sets) {
    try {
        let result = operation(...sets);
        if (result instanceof Set) {
            document.getElementById('input-output').value = formatSet(result);
        } else {
            document.getElementById('input-output').value = result; // แสดง result
        }
        resultDisplayed = true;
    } catch (error) {
        console.error("Error in calculateSetOperation():", error);
        document.getElementById('input-output').value = 'Error';
        resultDisplayed = true;
    }
}

async function inputSet() {
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
    } else {
        return null; // ผู้ใช้กดยกเลิก
    }
}

async function handleSetUnion() {
    const setA = await inputSet();
    if (setA === null) return; // ผู้ใช้กดยกเลิกการป้อนเซต A
    const setB = await inputSet();
    if (setB === null) return; // ผู้ใช้กดยกเลิกการป้อนเซต B
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

        // แยกสมการเป็นด้านซ้ายและขวา
        let sides = equation.split('=');
        let leftSide = sides[0].trim();
        let rightSide = sides[1].trim();

        // ตรวจสอบว่ามีตัวแปร x หรือไม่
        if (!leftSide.includes('x') && !rightSide.includes('x')) {
            throw new Error('สมการต้องมีตัวแปร x');
        }

        // ใช้ math.js ช่วยแก้สมการ
        let solution = math.solve(math.parse(leftSide), math.parse(rightSide), 'x');

        // แสดงผลลัพธ์
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
      // operator
      if (['+', '-', '*', '/', '(', ')', '√', '^', '!', '%', '∪', '∩', '∖'].includes(button.textContent)) {
          button.classList.toggle('operator');
        }
      if (['='].includes(button.textContent)) {
          button.classList.toggle('equal');
      }
    });
  }

function backspace() {
    let inputOutput = document.getElementById('input-output');
    inputOutput.value = inputOutput.value.slice(0, -1); // ลบตัวอักษรสุดท้าย
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
            if (denominator === '0' || numerator === '' || denominator === '') {
                Swal.showValidationMessage('ส่วนต้องไม่เป็น 0 และกรุณาใส่เศษและส่วน');
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
        let formattedText = text.replace(/\s/g, ''); // ลบช่องว่างทั้งหมด
        formattedText = formattedText.replace(/(\d+)\/(\d+)/g, '($1/$2)'); // แปลงเศษส่วนเป็นรูปแบบ (เศษ/ส่วน)
        // เพิ่มการแปลงสัญลักษณ์อื่นๆ ที่คุณต้องการได้ที่นี่ เช่น × -> *, ÷ -> /
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
            return { numVars, expression };
        }
    }).then((result) => {
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
        variables.push(String.fromCharCode(112 + i)); // สร้างชื่อตัวแปร p, q, r, ...
    }

    const header = [...variables, expression];
    const rows = [];

    for (let i = 0; i < Math.pow(2, numVars); i++) {
        const row = [];
        const binary = i.toString(2).padStart(numVars, '0'); // แปลงเป็นเลขฐานสอง

        for (let j = 0; j < numVars; j++) {
            row.push(binary[j] === '1'); // แปลง 0 เป็น false, 1 เป็น true
        }

        const expressionValue = evaluateExpression(expression, variables, row);
        row.push(expressionValue);
        rows.push(row);
    }

    return { header, rows };
}

function evaluateExpression(expression, variables, values) {
    let parsedExpression = expression;

    // แทนที่ชื่อตัวแปรด้วยค่าความจริง
    for (let i = 0; i < variables.length; i++) {
        const regex = new RegExp(variables[i], 'g');
        parsedExpression = parsedExpression.replace(regex, values[i].toString());
    }

    // แปลงสัญลักษณ์ทางตรรกศาสตร์
    parsedExpression = parsedExpression.replace(/&&/g, '&')
                                       .replace(/\|\|/g, '|')
                                       .replace(/!/g, '~')
                                       .replace(/\^/g, '^')
                                       .replace(/->/g, '<=')
                                       .replace(/<->/g, '==');

    // ใช้ math.js ในการคำนวณ
    try {
        return math.evaluate(parsedExpression);
    } catch (error) {
        throw new Error('นิพจน์ตรรกศาสตร์ไม่ถูกต้อง');
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