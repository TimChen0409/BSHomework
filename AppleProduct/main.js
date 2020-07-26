$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
//手風琴功能
var acc = document.querySelectorAll(".accordion");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 20 + "px";
        }
    });
}


//Data structure
var products = {
    iphone: {

    },
    ipad: {
        color: [{
            colorName: "太空灰色",
            colorEnName: "gray",
            img: "img/colorgray.png"
        },
        {
            colorName: "銀色",
            colorEnName: "silver",
            img: "img/colorsilver.png"
        },
        {
            colorName: "金色",
            colorEnName: "gold",
            img: "img/colorgold.png"
        }],
        storage: [{
            size: "32GB",
            description: "32<small>GB<sup>1</sup></small>",
            lowestPrice: "10,900"
        }, {
            size: "128GB",
            description: "128<small>GB<sup>1</sup></small>",
            lowestPrice: "13,900"
        }],
        connection: [{
            title: "WiFi",
            value: "WiFi",
            lowestPrice: "10,900"
        }, {
            title: "WiFi + 行動網路",
            value: "WiFiCell",
            lowestPrice: "15,400"
        }],
        productPriceAry: [{
            title: "32GB,WiFi",
            price: "10,900",
            tex: "544",
            monthPay: "908"
        },
        {
            title: "128GB,WiFi",
            price: "13,900",
            tex: "687",
            monthPay: "1,158"
        }, {
            title: "32GB,WiFiCell",
            price: "15,400",
            tex: "758",
            monthPay: "1,283"
        }, {
            title: "128GB,WiFiCell",
            price: "18,400",
            tex: "901",
            monthPay: "1,533"
        }]
    }
}

let colorTitle = document.querySelector('#colorTitle');
let storageTitle = document.querySelector('#storageTitle');
let connectionTitle = document.querySelector('#connectionTitle');

let colorOptions = document.getElementsByName('color');
let storageOptions = document.getElementsByName('storage');
let connectOptions = document.getElementsByName('connection');
let productImg = document.querySelector('#productImg');
let price = document.querySelector('#price');
let tex = document.querySelector('#tex');
let monthPay = document.querySelector('#monthPay');

init();

function init() {
    renderColorOption();
    renderStorageOption();
    renderConnectionOption();
    firstchecked();
}

function renderColorOption() {
    let colorPanel = document.querySelector('#colorTitle + .panel');
    let str = '';
    products.ipad.color.forEach(x => {

        str += `<div class="col-6">
                <input type="radio" name="color" id="${x.colorEnName}" value="${x.colorEnName}" class="d-none">
                    <label class="item d-block color-item m-1" for="${x.colorEnName}">
                        <div class="content text-center py-2">
                            <img src="${x.img}" class="w-25">
                            <h4 class="h6">${x.colorName}</h4>
                        </div>
                    </label>
            </div>`
    })
    colorPanel.insertAdjacentHTML('beforeend', str);
}

function renderStorageOption() {
    let storagePanel = document.querySelector('#storageTitle + .panel .storage-area');
    let str = '';
    products.ipad.storage.forEach(x => {

        str += `<div class="col-6">
                    <input type="radio" name="storage" id="${x.size}" value="${x.size}" class="d-none">
                    <label class="item d-block storage-item m-1" for="${x.size}">
                        <div class="content text-center py-2">
                            <h4>${x.description}</h4>
                            <p><small>NT$${x.lowestPrice}</small></p>
                        </div>
                    </label>
                </div>`
    })
    storagePanel.innerHTML = str;
}

function renderConnectionOption() {
    let connectionPanel = document.querySelector('#connectionTitle + .panel .connection-area');
    let str = '';
    products.ipad.connection.forEach(x => {

        str += `<div class="col-6">
                    <input type="radio" name="connection" id="${x.value}" value="${x.value}" class="d-none">
                    <label class="item d-block connection-item m-1" for="${x.value}">
                        <div class="content text-center py-2">
                            <h4>${x.title}</h4>
                            <p><small>NT$13,900</small></p>
                        </div>
                    </label>
                </div>`
    })
    connectionPanel.innerHTML = str;
}

function firstchecked() {
    colorOptions[0].checked = true;
    storageOptions[0].checked = true;
    connectOptions[0].checked = true;

}

colorOptions.forEach(x => {
    x.addEventListener('click', ChangeImg);
})
storageOptions.forEach(x => {
    x.addEventListener('click', changePrice);
})

connectOptions.forEach(x => {
    x.addEventListener('click', changePrice);
    x.addEventListener('click', ChangeImg);
})

function changePrice() {
    let checkStorage;
    let checkConnection;
    let checkStorageName;
    let checkConnectionType;
    storageOptions.forEach(x => {
        if (x.checked) {
            checkStorage = (x.value).toString();
            checkStorageName = changeStorageTitle(checkStorage);
            storageTitle.textContent = checkStorageName;
        }
    });
    connectOptions.forEach(y => {
        if (y.checked) {
            checkConnection = (y.value).toString();
            checkConnectionType = changeConnectionTitle(checkConnection);
            connectionTitle.textContent = checkConnectionType;
        }
    });
    var itemPrice = products.ipad.productPriceAry.filter(x => {
        return x.title == checkStorage + ',' + checkConnection;
    })

    price.textContent = `NT$${itemPrice[0].price}`;
    tex.textContent = itemPrice[0].tex;
    monthPay.textContent = itemPrice[0].monthPay;
}

function ChangeImg() {
    let checkColor;
    let checkColorName;
    let checkConnection;
    let checkConnectionType;
    colorOptions.forEach(x => {
        if (x.checked) {
            checkColor = (x.value).toString();
            checkColorName = changeColorTitle(checkColor);
            colorTitle.textContent = checkColorName;
        }
    });
    connectOptions.forEach(y => {
        if (y.checked) {
            checkConnection = (y.value).toString();
            checkConnectionType = changeConnectionTitle(checkConnection);
            connectionTitle.textContent = checkConnectionType;

        }
    });

    let imgName = checkColor;
    if (checkConnection == "WiFiCell")
        imgName += '2';
    productImg.innerHTML = `<img src="img/${imgName}.png" class="w-100">`
}

function changeColorTitle(color) {
    var filterAry = products.ipad.color.filter(x => x.colorEnName == color);
    return filterAry[0].colorName;
}

function changeStorageTitle(size) {
    var filterAry = products.ipad.storage.filter(x => x.size == size);
    return filterAry[0].size;
}

function changeConnectionTitle(connection) {
    var filterAry = products.ipad.connection.filter(x => x.value == connection);
    return filterAry[0].title;
}