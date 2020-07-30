let maskData;
const cities = document.querySelector('#cities');
const area = document.querySelector('#area');
const storeList = document.querySelector('#store-list');
var markers = [];//放所有的Marker

function initMap() {
    var myLatLng = { lat: 25.0415956, lng: 121.5341098 },
        map = new google.maps.Map(document.getElementById("map"), {
            center: myLatLng,
            zoom: 15
        });

    map.data.loadGeoJson("https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", null, function (features) {
        features.map(function (feature) {
            let count = feature.getProperty("mask_adult") + feature.getProperty("mask_child");
            var marker = new google.maps.Marker({
                position: feature.getGeometry().get(0),
                icon: count < 500 ? "./red.png" : count < 1000 ? "./yellow.png" : "./green.png"
            });
            markers.push(marker);

            let infowindow = new google.maps.InfoWindow({
                // 設定想要顯示的內容
                content: `<div class="infoWindow bg-light">
                                        <h5 class="my-2">${feature.getProperty('name')}</h5>
                                        <p class="my-1 h5 text-danger"><span>成人口罩數量：</span>${feature.getProperty('mask_adult')}</p>
                                        <p class="my-1 h5 text-danger"><span>兒童口罩數量：</span>${feature.getProperty('mask_child')}</p>
                                        <p class="my-1 h6">
                                            <i class="fas fa-map-marked-alt"></i>
                                            <a target="_blank" href="https://www.google.com.tw/maps/place/${feature.getProperty('address')}" class="text-info">${feature.getProperty('address')}</a>
                                        </p>                
                                        <p class="my-1 h6"><i class="fas fa-phone-alt"></i>${feature.getProperty('phone')}</p>
                                        <p class="my-1 h6"><i class="far fa-comment-alt"></i></i>${feature.getProperty('note')}</p>
                                        <p class="my-1 h6 text-warning"><span>數據更新時間：</span>${feature.getProperty('updated')}</p>
                                    </div>`,
                // 設定訊息視窗最大寬度
                maxWidth: 450
            });
            marker.addListener("click", () => {
                // 指定在哪個地圖和地標上開啟訊息視窗
                infowindow.open(map, marker);
            });
        });

        const clusterOptions = {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            gridSize: 130, //群集網格內的像素數
            zoomOnClick: true, //單擊時是否放大群集
            maxZoom: 15, //始終顯示常規標記之前，您可以放大的最遠級別
        };
        var markerCluster = new MarkerClusterer(map, markers, clusterOptions);
        map.data.setMap(null);

    });

    getUserLocation(map);
    getMaskData(map, 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
    getCityData('./CityCountyData.json');
}

function getMaskData(map, url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status == 200 && this.readyState == 4) {
            maskData = JSON.parse(xhr.response);
            setOptionsEvent(maskData.features, map);
        } else {
            console.log('Error');
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

//設置目前位置Maker
function getUserLocation(map) {
    if (navigator.geolocation) {
        function showPosition(position) {
            var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
            var marker = new google.maps.Marker({
                position: myLatLng,
                icon: 'http://earth.google.com/images/kml-icons/track-directional/track-8.png',
                map: map
            });
            map.setCenter(myLatLng);
        }
        function showError() {
            console.log('無法取得你的地理位置。')
        }
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log('你的裝置不支援定位功能。');
    }
}

function setOptionsEvent(data, map) {
    cities.addEventListener("change", function () {
        storeList.innerHTML = '';
    })

    area.addEventListener("change", function () {
        storeList.innerHTML = '';

        data.forEach(item => {
            let itemValues = item.properties;
            let itemLocation = item.geometry.coordinates;
            if (itemValues.county == cities.value && itemValues.town == area.value) {

                let card = document.querySelector('#cardTemplate');
                let cloneContent = card.content.cloneNode(true);
                cloneContent.querySelector('#shopName').innerText = itemValues.name;
                cloneContent.querySelector('.fa-eye').setAttribute('data-lat', itemLocation[1]);
                cloneContent.querySelector('.fa-eye').setAttribute('data-lng', itemLocation[0]);
                cloneContent.querySelector('#adult').innerText = "成人口罩數量：" + itemValues.mask_adult;
                cloneContent.querySelector('#child').innerText = "兒童口罩數量：" + itemValues.mask_child;
                cloneContent.querySelector('#address').innerText = itemValues.name;
                cloneContent.querySelector('#address').setAttribute('href', `https://www.google.com.tw/maps/place/${itemValues.address}`);
                cloneContent.querySelector('#phone').innerHTML = '<i class="fas fa-phone-alt"></i>' + itemValues.phone;
                cloneContent.querySelector('#note').innerHTML = '<i class="far fa-comment-alt"></i>' + itemValues.note;

                //綁定icon事件
                cloneContent.querySelector('.fa-eye').addEventListener('click', function () {
                    let newlat = Number(this.dataset.lat);
                    let newlng = Number(this.dataset.lng);
                    map.setCenter({ lat: newlat, lng: newlng });
                })

                storeList.append(cloneContent);
            }
        })
    })
}

function getCityData(url) {
    let xhr = new XMLHttpRequest(); xhr.onload = function () {
        if (this.status == 200 && this.readyState == 4) {
            let geoData = JSON.parse(this.response); let countriesOptions = ''; let cytiesOptions = '';
            countriesOptions = `<option value="" selected disabled>選擇縣市</option>`;
            geoData.forEach((item, index) => {
                countriesOptions += `<option value="${item.CityName}">${item.CityName}</option>`;

            })
            cities.innerHTML = `<select name="" id="countries">${countriesOptions}</select>`;

            cities.addEventListener('change', function () {
                cytiesOptions = '';
                cytiesOptions = `<option value="" selected disabled>選擇區域</option>`;
                geoData[cities.selectedIndex - 1].AreaList.forEach(item => {
                    cytiesOptions += `<option value="${item.AreaName}">${item.AreaName}</option>`;
                })
                area.innerHTML = `<select name="" id="countries">${cytiesOptions}</select>`;
            })
        } else {
            console.log('Error');
        }
    };
    xhr.open('GET', url);
    xhr.send();
}