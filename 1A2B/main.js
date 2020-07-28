var answer = [];
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const showAnswerBtn = document.querySelector('#showAnswerBtn');
const submitBtn = document.querySelector('#submitBtn');
const recordList = document.querySelector('#recordList');
const userInput = document.querySelector('#userInput');

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', init);
showAnswerBtn.addEventListener('click', showAnswer);
submitBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('input', checkUserInput);//oninput Event
userInput.addEventListener('input', checkUserInput);//oninput Event

init();

function init() {
    answer = [];
    startBtn.disabled = false;
    resetBtn.disabled = true;
    showAnswerBtn.disabled = true;
    submitBtn.disabled = true;
    userInput.disabled = true;
    recordList.innerHTML = '';
    userInput.value = '';
}

function startGame() {
    let numAry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 4; i++) {
        let num = Math.floor(Math.random() * numAry.length);
        answer.push(numAry[num].toString());
        numAry.splice(num, 1);
    }
    startBtn.disabled = true;
    resetBtn.disabled = false;
    showAnswerBtn.disabled = false;
    submitBtn.disabled = false;
    userInput.disabled = false;
}

function showAnswer() {
    Swal.fire(`Answer: ${answer.join('')}`);
}

function checkUserInput() {
    let inputAry = userInput.value.split('');
    checkRepeatedNum(inputAry);
    validateNum(userInput);
}

function checkRepeatedNum(sourceAry) {
    let uniqueAry = sourceAry.filter((item, index, selfAry) => {
        return selfAry.indexOf(item) === index;
    })

    if (sourceAry.length != uniqueAry.length) {
        Swal.fire('請勿輸入重複數字', '', 'warning').then(() => {
            userInput.value = userInput.value.substring(0, userInput.value.length - 1);
        });
    }
}

function validateNum(input) {
    let reg = /^\d+$/;
    if (!reg.test(input.value)) {
        Swal.fire('僅可輸入數字', '', 'warning').then(() => {
            userInput.value = userInput.value.substring(0, userInput.value.length - 1);
        });
    }
}

function checkAnswer() {
    let inputAry = userInput.value.split('');
    if (inputAry.length < 4) {
        Swal.fire('輸入數字小於4位');
        return;
    }
    else {
        let a = 0;
        let b = 0;
        let intersectAry = answer.filter(x => {
            return inputAry.indexOf(x) != -1
        })

        intersectAry.forEach(y => {
            if (answer.indexOf(y) == inputAry.indexOf(y)) {
                a++;
            }
            else {
                b++;
            }
        })
        addRecord(userInput.value, a, b);
        userInput.value = '';
        checkWin(a);
    }
}

function addRecord(input, a, b) {
    let str = '';
    if (a == 4) {
        str += `<li class="list-group-item">${input}：<span class="badge badge-success">${a} A ${b} B</span></li>`
    } else {
        str += `<li class="list-group-item">${input}：<span class="badge badge-danger">${a} A ${b} B</span></li>`
    }
    recordList.innerHTML += str;
}

function checkWin(num) {
    if (num == 4) {
        Swal.fire({
            title: 'Congratulations! You win the game',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '重新遊戲',
        }).then((result) => {
            if (result.value) {
                init();
            }
            else {
                submitBtn.disabled = true;
                userInput.disabled = true;
            }
        });
    }
}