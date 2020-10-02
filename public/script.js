const key = "3965ee9f-3e55-4b74-83cc-dab3874fb6dc";
const baseURL = "https://api.airvisual.com/v2/";

let coords;

const locDisplay = document.getElementById('location');
const wthrIcon = document.getElementById('wthrIcon');
const wthrTxt = document.getElementById('wthrTxt');
const geoBtn = document.getElementById('geoBtn');
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const searchForm = document.querySelector('form');
const infoPanel = document.getElementById('infoPanel');
const polLvl = document.getElementById('polLvl');
const mainPol = document.getElementById('mainPol');
const airRating = document.getElementById('airRating');
const aqiColor = document.querySelector('.aqiColor');

geoBtn.addEventListener('click', getInfoByCoords);

countrySelect.addEventListener('change', getStates);
stateSelect.addEventListener('change', getCities);

searchForm.addEventListener('submit', getInfoByCity);

// options object to pass to getCurrentPosition()
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

// function to be fired off when getCurrentPosition succeeds
function success(pos) {
    coords = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${coords.latitude}`);
    console.log(`Longitude: ${coords.longitude}`);
    console.log(`More or less ${coords.accuracy} meters.`);
}

// function to be fired off if getCurrentPosition fails
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// method to retreive geolocation info upon user's approval
navigator.geolocation.getCurrentPosition(success, error, options);

// build working url for geolocation search
//http://api.airvisual.com/v2/nearest_city?lat={{LATITUDE}}&lon={{LONGITUDE}}&key={{YOUR_API_KEY}}
function getInfoByCoords(e) {
    e.preventDefault();
    infoPanel.style.opacity = "0";

    let coordURL = baseURL + 'nearest_city?lat=' + coords.latitude + '&lon=' + coords.longitude + '&key=' + key;

    console.log('URL:', coordURL);

    fetch(coordURL)
        .then(function (result) {
            return result.json();
        })
        .then(function (json) {
            console.log(json);
            displayInfo(json);
        })
        .catch(error => {
            alert('No location matched your search');
            console.log(error);
        })
}

function displayInfo(json) {
    infoPanel.style.opacity = 0;
    locDisplay.textContent = "closest location: " + json.data.city + ', ' + json.data.state + ' ' + json.data.country;

    setWeather(json);

    polLvl.textContent = `Air Quality Index: ${json.data.current.pollution.aqius}`;
    mainPol.textContent = `Main pollutant: ${json.data.current.pollution.mainus}`;

    setRating(json);

    infoPanel.style.opacity = 1;
}

// set weather info according to API
function setWeather(json) {
    let weather;
    json.data.current.weather.ic == '01d' ? (wthrIcon.setAttribute('class', 'fas fa-sun fa-10x'), weather = 'Clear') :
    json.data.current.weather.ic == '01n' ? (wthrIcon.setAttribute('class', 'fas fa-moon fa-10x'), weather = 'Clear') :
    json.data.current.weather.ic == '02d' ? (wthrIcon.setAttribute('class', 'fas fa-cloud-sun fa-10x'), weather = 'Few clouds') :
    json.data.current.weather.ic == '02n' ? (wthrIcon.setAttribute('class', 'fas fa-cloud-moon fa-10x'), weather = 'Few clouds') :
    json.data.current.weather.ic == '03d' || json.data.current.weather.ic == '03n' || json.data.current.weather.ic == '04d' || json.data.current.weather.ic == '04n' ? (wthrIcon.setAttribute('class', 'fas fa-cloud fa-10x'), weather = 'Cloudy') :
    json.data.current.weather.ic == '09d' ? (wthrIcon.setAttribute('class', 'fas fa-cloud-showers-heavy fa-10x'), weather = 'Rain') :
    json.data.current.weather.ic == '10d' ? (wthrIcon.setAttribute('class', 'fas fa-cloud-sun-rain fa-10x'), weather = 'Scattered Showers') :
    json.data.current.weather.ic == '10n' ? (wthrIcon.setAttribute('class', 'fas fa-cloud-moon-rain fa-10x'), weather = 'Scattered Showers') :
    json.data.current.weather.ic == '11d' ? (wthrIcon.setAttribute('class', 'fas fa-bolt fa-10x'), weather = 'Thunderstorms') :
    json.data.current.weather.ic == '13d' || json.data.current.weather.ic == '13n' ? (wthrIcon.setAttribute('class', 'fas fa-snowflake fa-10x'), weather = 'Snow') :
    json.data.current.weather.ic == '50d' || json.data.current.weather.ic == '50n' ? (wthrIcon.setAttribute('class', 'fas fa-smog fa-10x'), weather = 'Fog') :
    (wthrIcon.setAttribute('class', 'fab fa-aviato fa-10x'), weather = 'Aviato');

    wthrTxt.textContent = weather;
}

// get list of compatible countries from API
function getCountries() {
    let countryURL = baseURL + 'countries?key=' + key;

    console.log('URL:', countryURL);

    fetch(countryURL)
        .then(function (result) {
            return result.json();
        })
        .then(function (json) {
            console.log(json);
            fillCountries(json);
        })
        .catch(error => {
            console.log(error);
        })
}

getCountries()

//set 'country' select element's options to country array from API
function fillCountries(json) {
    let countries = json.data;

    for (var i = 0; i < countries.length; i++) {
        var country = countries[i].country;
        var option = document.createElement("option");
        option.textContent = country;
        option.value = country;
        countrySelect.appendChild(option);
    }
}

function getStates(e) {
    e.preventDefault();
    let stateURL = baseURL + 'states?country=' + countrySelect.value.replace('%20', ' ') + '&key=' + key;

    console.log('URL:', stateURL);

    fetch(stateURL)
        .then(function (result) {
            return result.json();
        })
        .then(function (json) {
            console.log(json);
            fillStates(json);
        })
        .catch(error => {
            alert('No location matched your search');
            console.log(error);
        })
}

function fillStates(json) {
    let states = json.data;

    for(i = stateSelect.options.length - 1; i >= 1; i--) {
        stateSelect.remove(i);
    }

    for(i = citySelect.options.length - 1; i >= 1; i--) {
        citySelect.remove(i);
    }


    for (var i = 0; i < states.length; i++) {
        var state = states[i].state;
        var option = document.createElement("option");
        option.textContent = state;
        option.value = state;
        option.setAttribute('class', '.stateOption')
        stateSelect.appendChild(option);
        stateSelect.disabled = false;
    }
}

function getCities(e) {
    e.preventDefault();
    let cityURL = baseURL + 'cities?state=' + stateSelect.value + '&country=' + countrySelect.value + '&key=' + key;

    console.log('URL:', cityURL);

    fetch(cityURL)
        .then(function (result) {
            return result.json();
        })
        .then(function (json) {
            console.log(json);
            fillCities(json);
        })
        .catch(error => {
            alert('No location matched your search');
            console.log(error);
        })
}

function fillCities(json) {
    let cities = json.data;

    for(i = citySelect.options.length - 1; i >= 1; i--) {
        citySelect.remove(i);
    }


    for (var i = 0; i < cities.length; i++) {
        var city = cities[i].city;
        var option = document.createElement("option");
        option.textContent = city;
        option.value = city;
        option.setAttribute('class', '.cityOption');
        citySelect.appendChild(option);
        citySelect.disabled = false;
    }
}

function getInfoByCity(e) {
    e.preventDefault();
    infoPanel.style.opacity = "0";

    let cityURL = baseURL + 'city?city=' + citySelect.value + '&state=' + stateSelect.value + '&country=' + countrySelect.value + '&key=' + key;

    console.log('URL:', cityURL);

    fetch(cityURL)
        .then(function (result) {
            return result.json();
        })
        .then(function (json) {
            console.log(json);
            displayInfo(json);
        })
        .catch(error => {
            alert('No location matched your search');
            console.log(error);
        })
}

function setRating(json){
    let aqi = json.data.current.pollution.aqius;

    aqi <= 50 ? (airRating.textContent = "Good", aqiColor.style.backgroundColor = "#40f55b") :
    aqi > 50 && aqi <= 100 ? (airRating.textContent = "Moderate", aqiColor.style.backgroundColor = "#e6f74a") :
    aqi > 100 && aqi <= 150 ? (airRating.textContent = "Unhealthy for Sensitive Groups", aqiColor.style.backgroundColor = '#f7c034') :
    aqi > 150 && aqi <= 200 ? (airRating.textContent = "Unhealthy", aqiColor.style.backgroundColor = '#f78534') :
    aqi > 200 && aqi <= 300 ? (airRating.textContent = "Very Unhealthy", aqiColor.style.backgroundColor = '#f75b34') :
    (airRating.textContent = "Hazardous", aqiColor.style.backgroundColor = "#f52525");
}