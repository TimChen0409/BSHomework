let uploadImg = document.querySelector("#uploadImg");
let examplePicBtn = document.querySelector("#examplePicBtn");
let gameMapContent = document.querySelector("#gameMap .row");
let imgPreview = document.querySelector("#imgPreview");
let resetBtn = document.querySelector("#resetBtn");
let Options = document.querySelectorAll(".form-check-input");
let puzzleSize;
let puzzles;
let moveRecord = [];
let answer = [];
let nowAns = [];
let winID;
uploadImg.addEventListener('change', startGame);
examplePicBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);


function startGame() {

    let selectedSize = getRadioValue();
    let imgUrl;
    if (this.id == 'examplePicBtn') {
        imgUrl = './duke.jpg';
    }
    else {
        let selectedImg = this.files[0];//inputfile上傳的資料會在files[0]
        imgUrl = URL.createObjectURL(selectedImg);//讓該圖片產生url
    }

    imgPreview.src = imgUrl;
    uploadImg.disabled = true;
    Options.forEach(x => {
        x.disabled = true;
    })
    resetBtn.disabled = false;
    examplePicBtn.disabled = true;

    gameMapContent.classList.add("border");
    createPuzzles(imgUrl, selectedSize);

    puzzles = Array.from(document.querySelectorAll(".puzzle"));
    puzzles.forEach(x => {
        x.addEventListener("click", function () {
            movePuzzle(this);
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
            gameMapContent.append(div)

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
}

function movePuzzle(thisPuzzle) {
    let emptyPuzzle = document.querySelector(".empty");
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

        if (moveRecord.length >= 100) {
            moveRecord.push(clickPuzzleIndex);
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
        }, 500);
    }
}

function resetGame() {
    moveRecord.length = 0;//清空紀錄
    uploadImg.value = '';//清空input的value，這樣選同一張圖片才能觸發change事件
    imgPreview.src = "";
    gameMapContent.innerHTML = '';
    uploadImg.disabled = false;
    examplePicBtn.disabled = false;
    Options.forEach(x => {
        x.disabled = false;
    })
    resetBtn.disabled = true;
    gameMapContent.classList.remove("border");
    clearTimeout(winID);
}
