let resultDisplayed = false;
let angleMode = 'deg'; // เริ่มต้นด้วยโหมดองศา
let lastResult = null; // เก็บผลลัพธ์ล่าสุด

// ฟังก์ชันแปลงเรเดียนเป็นองศา (ใช้ math.js)
function toDegrees(radians) {
    return math.divide(math.multiply(radians, 180), math.pi);
}

// ฟังก์ชันแปลงองศาเป็นเรเดียน (ใช้ math.js)
function toRadians(degrees) {
    return math.divide(math.multiply(degrees, math.pi), 180);
}

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
        let number;
        try {
            number = math.evaluate(arg);
        } catch (error) {
            throw new Error('Invalid argument for trigonometry function');
        }

        // คำนวณค่าตรีโกณมิติโดยใช้ math.js
        let result;
        if (angleMode === 'deg') {
            number = toRadians(number); // แปลงเป็นเรเดียนก่อนคำนวณ
        }
        switch (funcName) {
            case 'sin':
                result = math.sin(number);
                break;
            case 'cos':
                result = math.cos(number);
                break;
            case 'tan':
                result = math.tan(number);
                break;
            case 'asin':
                result = math.asin(number);
                if (angleMode === 'deg') {
                    result = toDegrees(result); // แปลงผลลัพธ์กลับเป็นองศา
                }
                break;
            case 'acos':
                result = math.acos(number);
                if (angleMode === 'deg') {
                    result = toDegrees(result); // แปลงผลลัพธ์กลับเป็นองศา
                }
                break;
            case 'atan':
                result = math.atan(number);
                if (angleMode === 'deg') {
                    result = toDegrees(result); // แปลงผลลัพธ์กลับเป็นองศา
                }
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

// เพิ่มปุ่มสลับโหมดเรเดียน/องศา
function toggleAngleMode() {
    angleMode = angleMode === 'deg' ? 'rad' : 'deg';
    document.getElementById('angle-mode').textContent = angleMode.toUpperCase();
}

function factorial(n) {
    if (n < 0) {
        return "Error"; // แฟกทอเรียลไม่นิยามสำหรับจำนวนลบ
    } else if (!Number.isInteger(n)) {
        return math.gamma(n + 1); // ใช้ฟังก์ชันแกมมาสำหรับจำนวนจริง
    } else {
        return math.factorial(n); // ใช้ฟังก์ชัน factorial จาก math.js
    }
}

function calculate() {
    try {
        let expression = document.getElementById('input-output').value;
        console.log("Expression:", expression);

        // ถ้ามีการใช้ = ให้นำผลลัพธ์ก่อนหน้ามาต่อ
        if (resultDisplayed && lastResult !== null && !isNaN(parseFloat(expression))) {
            expression = lastResult + expression;
        }

        // จัดการกับ sin, cos, tan, asin, acos, atan
        const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
        for (const func of trigFunctions) {
            while (expression.includes(func + '(')) {
                calculateTrigonometry(func);
                expression = document.getElementById('input-output').value; // อัปเดต expression
            }
        }

        // จัดการกับแฟกทอเรียล
        expression = expression.replace(/(\d+(?:\.\d+)?)!/g, (match, num) => {
            let parsedNum = parseFloat(num);
            if (isNaN(parsedNum)) {
                throw new Error("Invalid input for factorial");
            }
            return factorial(parsedNum);
        });

        // ใช้ Math.js คำนวณ
        let result = math.evaluate(expression);
        console.log("Result:", result);

        document.getElementById('input-output').value = result;
        resultDisplayed = true;
        lastResult = result; // เก็บผลลัพธ์ล่าสุด
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
    if (str === null || str.trim() === '' || str.trim() === '{}') {
      return new Set(); // คืนค่าเซตว่าง
    }
    str = str.replace(/[{}]/g, ''); // ลบวงเล็บปีกกาออก
    let elements = str.split(/[\s,]+/).map(x => {
      let trimmed = x.trim();
      if (trimmed === '') {
        return NaN; // ไม่ควรเกิดขึ้น เพราะ split ควรจัดการช่องว่างได้
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
function setUnion(setA, setB) {
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
        return 'Error: Invalid set input';
    }
    return math.setUnion(setA, setB);
}

// ฟังก์ชันสำหรับดำเนินการกับเซต (อินเตอร์เซกชัน)
function setIntersection(setA, setB) {
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
        return 'Error: Invalid set input';
    }
    return math.setIntersect(setA, setB);
}

// ฟังก์ชันสำหรับดำเนินการกับเซต (ผลต่าง)
function setDifference(setA, setB) {
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
        return 'Error: Invalid set input';
    }
    return math.setDifference(setA, setB);
}

function calculateSetOperation(operation, ...sets) {
    try {
        // ใช้ math.evaluate เพื่อรองรับการดำเนินการกับหลายเซต
        let result = math.evaluate(`${operation.name}(${sets.map(s => formatSet(s)).join(',')})`);
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

        // ใช้ math.js ช่วยแก้สมการ
        let solution = math.solveEquation(equation);

        // แสดงผลลัพธ์
        document.getElementById('input-output').value = 'x = ' + math.format(solution, {fraction: 'ratio'});
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
