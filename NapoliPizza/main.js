import { $g, $c } from '../NapoliPizza/Modules/helpers.js';

let pdBlock = $g('#pdBlock');
let xhr = new XMLHttpRequest();
let msg = $g("#msg");
let buttonGroup = $g('.nav-item');
const url = 'https://raw.githubusercontent.com/TimChen0409/FileStorage/master/Pizza.json';
let dataList;

window.onload = function () {
    getDataByAJAX();
}

function getDataByAJAX() {
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = function () {
        dataList = JSON.parse(this.responseText);
        setBtnValueAndEvent(Object.keys(dataList));
        renderData(dataList.pizzaProduct);
    }
}

function setBtnValueAndEvent(dataKeysArray) {
    dataKeysArray.forEach((item, index) => {
        buttonGroup[index].setAttribute('id', item);
        buttonGroup[index].addEventListener('click', function () {
            renderData(Object.values(dataList)[index]);
        })
    })
}



function renderData(dataArray) {
    clearAllData();
    let card = $g('#cardPizza');
    dataArray.forEach(item => {
        let cloneContent = card.content.cloneNode(true);
        cloneContent.querySelector('h5').innerText = item.pdName;
        cloneContent.querySelector('p').innerText = item.pdEnName;
        cloneContent.querySelector('img').src = 'img/' + item.pdImage;

        cloneContent.querySelector('.btn').addEventListener('click', function () {
            this.setAttribute("data-toggle", "modal");
            this.setAttribute("data-target", "#exampleModal");
            let modal = $g('#exampleModal');
            modal.querySelector('h5').innerText = item.pdName;
            modal.querySelector('p').innerText = item.pdEnName;
            modal.querySelector('#pizzaImage').src = 'img/' + item.pdImage;
            modal.querySelector('#stuffing').innerText = item.stuffing;
            modal.querySelector('#description').innerText = item.description;
            modal.querySelector('#price').innerText = item.price;
        });
        pdBlock.append(cloneContent);
    });
}

function clearAllData() {
    pdBlock.innerHTML = '';
}