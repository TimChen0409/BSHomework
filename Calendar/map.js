let mep;
let marker;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 25.041,
            lng: 121.53
        },
        zoom: 13,
    });

    map.addListener('click', function (e) {
        map.setCenter(e.latLng);
        if (marker == null) {
            marker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                title: e.latLng.toString()
            });
        } else {
            marker.setPosition(e.latLng);
        }
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'location': e.latLng
        }, function (results, status) {
            if (status === 'OK') {
                //點擊地圖時存入地點至input
                //console.log(results[0].formatted_address);
                document.querySelector("#position").value = results[0].formatted_address;
            }
        });
    });

    //綁定input輸入後去抓取位置
    const input = document.getElementById("position");
    const searchBox = new google.maps.places.SearchBox(input);
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        markers.forEach(marker => {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location
                })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}