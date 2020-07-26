let operators = document.querySelectorAll(".operator");
let numbers = document.querySelectorAll(".number");
let currentFormula = document.querySelector("#currentFormula");
let recordList = document.querySelector("#recordList");
let recordListTitle = document.querySelector(".modal-body h6");
let deleteBtn = document.querySelector("#deleteBtn");
let currentValue = document.querySelector("#currentValue");
let firstValue = '';//儲存第一次被(加、減、乘、除)數

operators.forEach(op => op.addEventListener('click', operate));
numbers.forEach(num => num.addEventListener('click', inputNum));
deleteBtn.addEventListener('click', deleteRecord);


function operate() {
    let formula = currentFormula.textContent;
    let value = currentValue.textContent;
    if (value.length > 0 || formula.length > 0) {
        switch (this.id) {
            case "%":
                value = operatePercentage(value);
                break;
            case "ce":
                value = operateCurrentEmpty();
                break;
            case "c":
                value = operateClearAll();
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

function operateCurrentEmpty() {
    if (firstValue.length > 0) {
        firstValue = '';
        currentFormula.textContent = '';
    }
    return '0';
}

function operateClearAll() {
    console.log(123);
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
    let formulaAry = currentFormula.textContent.split('').filter(x => { return isNaN(x) });
    if (formulaAry.length == 0) {
        currentFormula.textContent = removeNumberFommat(value) + operator;
        return '0';
    }

}

function operateEqual(value, formula) {
    if (formula != '') {
        let currentOperator = formula.split('').reverse().find(x => { return isNaN(x) && x != '=' });//由後往前找

        if (currentOperator == '/' && removeNumberFommat(value) == '0') {
            operators.forEach(op => op.disabled = true);
            numbers.forEach(num => num.disabled = true);
            document.querySelector("#c").disabled = false;
            return '無法除以零';
        }

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
        currentValue.textContent = '';
    }
    let oldValue = removeNumberFommat(currentValue.textContent);
    let result;

    if (oldValue[0] == '0' && !oldValue.includes('.')) {
        result = this.id;
    } else {
        result = oldValue + this.id;
    }

    currentValue.textContent = getNumberFommat(result);
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