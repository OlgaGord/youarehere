mapboxgl.accessToken =
    "pk.eyJ1Ijoib2dvMTIzIiwiYSI6ImNqdnh6OXN3eTA4aDQ0OXM3ZXpiNDFmZW0ifQ.QmSIcOHd48rHQEZJb0WU6Q";

const geoIp = "https://api.ipgeolocation.io/ipgeo?apiKey=dddaf9a00c144d27ad55df11e7dd3816";

const geocodeURI = address => {
    return (
        "https://api.opencagedata.com/geocode/v1/json?q=" +
        address +
        "&key=5239c9312b8b43c3805341ff83fa60e6"
    );
};

let map = null;
let locInfo = null;
let loading = null;


const centerOnUser = async () => {

    if (map != null) {

        let mapInfo = await fetch(geoIp);
        let mapInfoJSON = await mapInfo.json();
        let loc = [mapInfoJSON.longitude, mapInfoJSON.latitude];

        map.easeTo({ center: loc });
        return mapInfoJSON;

    }

}

document.addEventListener("DOMContentLoaded", async () => {
    loading = document.getElementById("loading");
    map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/ogo123/cjvxzfx1i6jd61cqio0wrsd4w",
        center: [-75.765, 45.4553],
        zoom: 16
    });

    document.getElementById("btnFindIt").addEventListener("click",
        async () => {

            let address = document.getElementById("txtAddress").value;
            address = address.trim();
            console.log(address);
            if (address.length >= 3) {
                console.log(geocodeURI(address));

                const data = await fetch(geocodeURI(address));
                const dataJson = await data.json();
                console.log(dataJson);

                if (dataJson.results.length >= 1) {
                    const geo = dataJson.results[0].geometry;
                    console.log(geo);
                    map.easeTo({ center: [geo.lng, geo.lat] });
                }
            }
        });
    document.getElementById("easeToTokyo").addEventListener("click", async () => {

        loading.style.display = "block";
        const data = await fetch(geocodeURI("Tokyo"));
        const dataJson = await data.json();

        const tokyo = dataJson.results[0].geometry;

        map.easeTo({ center: [tokyo.lng, tokyo.lat] });
    });

    document.getElementById("easeHome").addEventListener("click", async () => {

        if (locInfo === null) {
            locInfo = await centerOnUser();
        } else {
            console.log(locInfo);
            map.easeTo({ center: [locInfo.longitude, locInfo.latitude] });
        }
    });
    //  centerOnUser();
    locInfo = await centerOnUser();
    console.log(locInfo);

    let userMarker = new mapboxgl.Marker()
        .setLngLat([locInfo.longitude, locInfo.latitude])
        .setPopup(
            new mapboxgl.Popup({ className: 'here' }).setHTML(
                '<h1>You are here</h1><img src="' + locInfo.country_flag + '" />'
            ))
        .addTo(map)
        .togglePopup();
});


