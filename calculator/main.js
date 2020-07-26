const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
const currentFormula = document.querySelector("#currentFormula");
const recordList = document.querySelector("#recordList");
const recordListTitle =document.querySelector(".modal-body h6");
const deleteBtn = document.querySelector("#deleteBtn");
let currentValue = document.querySelector("#currentValue");
let firstValue = '';//儲存第一次被(加、減、乘、除)數

operators.forEach(op => op.addEventListener('click', operate));
numbers.forEach(num => num.addEventListener('click', inputNum));
deleteBtn.addEventListener('click', deleteRecord);


function operate() {
    let formula = currentFormula.textContent;
    let value = currentValue.textContent;
    if (value.length > 0) {
        switch (this.id) {
            case "%":
                value = operatePercentage(value);
                break;
            case "ce":
                value = operateCurrentEmpty(value);
                break;
            case "c":
                value = operateClearAll(value);
                break;
            case "backspace":
                value = removeNumberFommat(value);
                value = operateBackspace(value);
                break;
            case "fraction":
                value = operateFraction(value);
                break;
            case "power":
                value **= 2;
                break;
            case "sqrt":
                value = Math.sqrt(value);
                break;
            case "plusOrMinus":
                value = operateToAddPlusOrMinus(value);
                break;
            case ".":
                if (!value.includes('.'))
                    value += '.';
                break;
            case "=":
                value = operateEqual(value, formula);
                break;
            case "/":
            case "*":
            case "-":
            case "+":
                value = operateArithmetic(value, this.id);
                break;
            default:
                break;
        }

    } else {
        value = '';
    }
    //reassign
    currentValue.textContent = value;
}


function operatePercentage(value) {
    return value * 0.01;
}

function operateCurrentEmpty(value) {
    if (firstValue.length > 0) {
        firstValue = '';
        currentFormula.textContent = '';
    }
    return '0';
}

function operateClearAll(value) {
    operators.forEach(op => op.disabled = false);
    numbers.forEach(num => num.disabled = false);
    currentFormula.textContent = '';
    return '0';
}

function operateBackspace(value) {
    if (value.length > 1) {
        return value.substring(0, value.length - 1);
    } else {
        return 0;
    }
}

function operateToAddPlusOrMinus(value) {
    if (value == '0') {
        return value;
    }

    if (value.includes('-')) {
        return value.replace('-', '');
    }
    else {
        return '-' + value;
    }
}

function operateFraction(value) {
    if (value != 0) {
        return Number(1 / value);
    }
    else {
        operators.forEach(op => op.disabled = true);
        numbers.forEach(num => num.disabled = true);
        document.querySelector("#c").disabled = false;
        return '無法除以零';
    }
}

function operateArithmetic(value, operator) {
    currentFormula.textContent = removeNumberFommat(value) + operator;
    return '';
}

function operateEqual(value, formula) {
    if (formula != '') {
        let currentOperator = formula.split('').reverse().find(x => { return isNaN(x) && x != '=' });//由後往前找
        if (!formula.includes('=')) {
            firstValue = removeNumberFommat(value);
            currentFormula.textContent = formula + removeNumberFommat(value) + '=';
            value = eval(formula.replace('=', '') + value);

        }
        else {
            currentFormula.textContent = removeNumberFommat(value) + currentOperator + firstValue + '=';
            value = eval(removeNumberFommat(value) + currentOperator + firstValue);
        }
        addRecord(currentFormula.textContent, value);
    }

    return value;
}

function addRecord(formula, value) {
    recordListTitle.classList.toggle("d-none");
    let str = `<li class="list-group-item list-group-item-action text-right">${formula}<br>${value}</li>`;
    recordList.innerHTML += str;
}

function deleteRecord() {
    recordListTitle.classList.toggle("d-none");
    recordList.innerHTML = '';
}


function inputNum() {
    if (currentFormula.textContent.includes('=')) {
        currentFormula.textContent = '';
    }

    let currentOutput = removeNumberFommat(currentValue.textContent);
    let output;

    if (currentOutput[0] == '0' && !currentOutput.includes('.')) {
        output = this.id;
    } else {
        output = currentOutput + this.id;
    }

    currentValue.textContent = getNumberFommat(output);
}

//add dot per 3digits
function getNumberFommat(num) {
    let reg = /(?=(\B)(\d{3})+$)/g;
    return num.replace(reg, ",");
}
//remove dot
function removeNumberFommat(num) {
    return num.replace(/,/g, '');
}