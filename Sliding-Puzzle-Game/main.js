let uploadImg = document.querySelector("#uploadImg");
let examplePicBtn = document.querySelector("#examplePicBtn");
let gameMapContent = document.querySelector("#gameMap .row");
let imgPreview = document.querySelector("#imgPreview");
let resetBtn = document.querySelector("#resetBtn");
let gobackOneBtn = document.querySelector("#gobackOne");
let gobackAllBtn = document.querySelector("#gobackAll");
let Options = document.querySelectorAll(".form-check-input");
let btnSet = document.querySelectorAll(".btnSet");
var timerSpan = document.getElementById("timer");
let puzzleSize;
let puzzles;
let moveRecord = [];
let answer = [];
let nowAns = [];
let winID;
let shuffleExcuted = false;
let timer;
uploadImg.addEventListener('change', startGame);
examplePicBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
gobackOneBtn.addEventListener('click', goback);
gobackAllBtn.addEventListener('click', gobackAll);

function goback() {
    puzzles.forEach(x => x.style.transition = "none");
    let step = moveRecord.pop();
    movePuzzle(puzzles[step], 'back');
    puzzles.forEach(x => x.style.transition = "all .3s");
}

function gobackAll() {
    puzzles.forEach(x => x.style.transition = "none");//後來再綁定transition屬性避免洗牌時觸發click事件

    while (moveRecord.length > 0) {
        let step = moveRecord.pop();
        movePuzzle(puzzles[step], 'backAll');
    }
    checkWin(puzzles);
}


function startGame() {
    timer = setInterval("Check_Time()", 1000);
    let selectedSize = getRadioValue();
    let imgUrl;
    uploadImg.disabled = true;
    btnSet.forEach(x => x.disabled = false);
    examplePicBtn.disabled = true;

    if (this.id == 'examplePicBtn') {
        imgUrl = './duke.jpg';
    }
    else {
        let selectedImg = this.files[0];//inputfile上傳的資料會在files[0]
        imgUrl = URL.createObjectURL(selectedImg);//讓該圖片產生url
    }

    imgPreview.src = imgUrl;
    Options.forEach(x => {
        x.disabled = true;
    })

    gameMapContent.classList.add("border");
    createPuzzles(imgUrl, selectedSize);
    puzzles = Array.from(document.querySelectorAll(".puzzle"));

    puzzles.forEach(x => {
        if (x.classList.contains('empty')) {
            return
        }
        x.addEventListener("click", function () {
            movePuzzle(this, 'click');
        })
    })
    shuffle();
}

function getRadioValue() {
    let val;
    Options.forEach(x => {
        if (x.checked) {
            val = x.value;
        }
    })
    return val;
}

function createPuzzles(imgUrl, size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let div = document.createElement("div");
            puzzleSize = (500 / size);
            div.classList.add("border", "puzzle");
            if (i == 0 && j == 0) {
                div.classList.add("empty");
            }
            div.style.height = `${puzzleSize}px`;
            div.style.width = `${puzzleSize}px`;
            div.style.position = "absolute";
            div.style.left = `${Math.floor(j) * puzzleSize}px`;
            div.style.top = `${Math.floor(i) * puzzleSize}px`;
            div.style.backgroundImage = `url('${imgUrl}')`;
            div.style.backgroundPosition = `-${Math.floor(j) * puzzleSize}px -${Math.floor(i) * puzzleSize}px`;
            gameMapContent.append(div);

            answer.push({ left: `${Math.floor(j) * puzzleSize}px`, top: `${Math.floor(i) * puzzleSize}px` });//save position to answer
        }
    }
}

function shuffle() {
    let count = 0;
    while (count < 100) {
        let randomCount = Math.floor(Math.random() * puzzles.length);
        movePuzzle(puzzles[randomCount]);
        moveRecord.push(randomCount);
        count++;
    }
    puzzles.forEach(x => x.style.transition = "all .3s");//後來再綁定transition屬性避免洗牌時觸發click事件
    shuffleExcuted = true;
}

function movePuzzle(thisPuzzle, type) {
    let clickPuzzleIndex = puzzles.indexOf(thisPuzzle);
    let emptyIndex = puzzles.findIndex((item) => { return item.classList.contains("empty"); })
    let left = thisPuzzle.offsetLeft;
    let top = thisPuzzle.offsetTop;
    let targetLeft = puzzles[emptyIndex].offsetLeft;
    let targetTop = puzzles[emptyIndex].offsetTop;

    if (CanMoveOrNot(left, top, targetLeft, targetTop)) {
        let tempX = left + 'px';
        let tempY = top + 'px';
        puzzles[clickPuzzleIndex].style.left = puzzles[emptyIndex].style.left;
        puzzles[clickPuzzleIndex].style.top = puzzles[emptyIndex].style.top;
        puzzles[emptyIndex].style.left = tempX;
        puzzles[emptyIndex].style.top = tempY;
    }

    if (shuffleExcuted) {
        if (type != 'back' && type != 'backAll') {
            moveRecord.push(clickPuzzleIndex);
        }
        if (type != 'backAll') {
            checkWin(puzzles);
        }
    }
}

function CanMoveOrNot(left, top, targetLeft, targetTop) {
    //check left right
    if (Math.abs(top - targetTop) == 0 && Math.abs(left - targetLeft) <= Math.ceil(puzzleSize)) {
        return true;
    }
    //check up down
    if (Math.abs(left - targetLeft) == 0 && Math.abs(top - targetTop) <= Math.ceil(puzzleSize)) {
        return true;
    }
    return false;
}

function checkWin(nowAnsArray) {
    let result = 0;
    for (let i = 0; i < nowAnsArray.length; i++) {
        if (nowAnsArray[i].style.top == answer[i].top && nowAnsArray[i].style.left == answer[i].left) {
            result++;
        }
    }
    if (result == nowAnsArray.length) {
        winID = setTimeout(() => {
            alert("You win！");
            resetGame();
        }, 500);
    }
}

function resetGame() {
    moveRecord.length = 0;
    shuffleExcuted = false;
    uploadImg.value = '';//清空input的value，這樣選同一張圖片才能觸發change事件
    imgPreview.src = "";
    gameMapContent.innerHTML = '';
    uploadImg.disabled = false;
    examplePicBtn.disabled = false;
    Options.forEach(x => {
        x.disabled = false;
    })
    btnSet.forEach(x => x.disabled = true);
    gameMapContent.classList.remove("border");
    clearTimeout(winID);
    clearInterval(timer);
    timerSpan.innerHTML = '0分0秒';
}

var SetMinute = 0;
function Check_Time() {
    SetMinute += 1;
    var Cal_Minute = Math.floor(Math.floor(SetMinute % 3600) / 60);
    var Cal_Second = SetMinute % 60;
    timerSpan.innerHTML = Cal_Minute + "分" + Cal_Second + "秒";
}
