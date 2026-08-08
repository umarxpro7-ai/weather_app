const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const clickSound = new Audio("images/click.mp3.mp3")
clickSound.preload = "auto";

function playClickSound() {
    clickSound.currentTime = 0;
    const playPromise = clickSound.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Audio playback blocked or waiting for user interaction:", error);
        });
    }   
}

async function checkWeather(city) {
    const trimmedCity = city.trim();
    if (!trimmedCity || /^\d+$/.test(trimmedCity)) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return;
    }

    const response = await fetch(apiUrl + encodeURIComponent(trimmedCity) + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
    const data = await response.json();

    const temp = data.main.temp;
    const card = document.querySelector(".card");
    if (temp <= 10) {
        card.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('images/snow-biome.png')";
    } else if (temp >=30) {
        card.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('images/desert-biome.png')";
    }else {
        card.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('images/normal-biome.png')";
    }
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";    


    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

   const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
   const cityTime = new Date(utcTime + (data.timezone * 1000));
   const formattedTime = cityTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

   document.querySelector(".time").innerHTML = formattedTime;

    const condition = data.weather[0].main;
    const iconMap = {
        "Clouds": "images/clouds2.png",
        "Clear": "images/clear2.png",
        "Rain": "images/rain.png",
        "Drizzle": "images/drizzle.png",
        "Mist": "images/mist.png",
        "Fog": "images/mist.png",
        "Haze": "images/mist.png",
        "Smoke": "images/mist.png",
        "Snow": "images/snow.png"
    };

    weatherIcon.src = iconMap[condition] || "images/clear2.png";
    if (condition === "Clear") {
        weatherIcon.classList.add("sun-glow");
    } else {
        weatherIcon.classList.remove("sun-glow");
    } 

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchBtn.addEventListener("click", ()=>{
    playClickSound();
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        playClickSound();
        checkWeather(searchBox.value);
    }
});
