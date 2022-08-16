//selecting element by passing class names

const icon = document.querySelector(".weather-icon");

const temp = document.querySelector(".temperature p");

const desc = document.querySelector(".description p");

//const humi = document.querySelector(".humidity p");

const locate = document.querySelector(".location p");

const notif = document.querySelector(".notification");

//creating weather object to store data

const weather={};

weather.temp = {
    unit : "celsius"
}


const KELVIN= 273;

//api key
//const key = "82005d27a116c2880c8f0fcb866998a0"

const key ="32deadd4d5a1f5ad4f17163425966c48"



//changing elements in html
function displayWeather(){
    icon.innerHTML =`<img src="icons/${weather.iconId}.png"/>`;

    temp.innerHTML =`${weather.temp.value}°<sup><span>c</span></sup>`;

    desc.innerHTML = weather.desc;

   // humi.innerHTML = `${weather.humi.value} %`;

    locate.innerHTML = `${weather.city}, ${weather.country}`;
}

//getting weather info from api provider
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    //sending request
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
            weather.temp.value= Math.floor(data.main.temp - KELVIN);

            weather.desc = data.weather[0].description;

           // weather.humidity.value =Math.floor(data.main.humidity);

            weather.iconId = data.weather[0].icon;

            weather.city = data.name;
            weather.country = data.sys.country;
    })
    .then( function(){
        displayWeather();
    });
}

// Celcius to Fahrenheit
 function celToFah(temp){
    return (temp * 9/5) + 32;
 }

 temp.addEventListener("click", function(){

    if(weather.temp.value === undefined)
    return;

    if(weather.temp.unit === "celsius"){
        let fahrenheit = celToFah(weather.temp.value);

        fahrenheit = Math.floor(fahrenheit);

        temp.innerHTML = `${fahrenheit}°<sup><span>F</span></sup>`;
        weather.temp.unit="fahrenheit";
    }else{

        temp.innerHTML = `${weather.temp.value}°<sup><span>c</span></sup>`;
        weather.temp.unit="celsius";

    }
 });


 function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
 }

 function showError(error){
    notif.style.display= "block";
    notif.innerHTML=`<p> ${error.message} </p>`;
 }

  //check if geolocation services are available in that location
 if(`geolocation` in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
 }else{

    notif.style.display = "block";
    notif.innerHTML= "<p>Browser Doesn't support Geolocation.</p>"
 }