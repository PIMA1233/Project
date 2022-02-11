async function serRenderBackground() {
    // https://picsum.photos/200/300
    const result = await axios.get("https://picsum.photos/800/1200", {
        responseType: "blob"
    })
    // console.log(result.data)
    const data = URL.createObjectURL(result.data)
    // console.log(data)
    document.querySelector("body").style.backgroundImage = `url(${data})`
}

function setTime() {
    const timer = document.querySelector(".timer")
    setInterval(() => {
        const date = new Date()
        const hour = String(date.getHours()).padStart(2, "0")
        const minute = String(date.getMinutes()).padStart(2, "0")
        const second = String(date.getSeconds()).padStart(2, "0")
        timer.textContent = `${hour} : ${minute} : ${second}`
    }, 1000)
}

function setTimeContent() {
    const timerContent = document.querySelector(".timer-content")
    setInterval(() => {
        if (new Date().getHours() < 17) {
            timerContent.textContent = "Good moring, sir. Have a nice day."
        }
        else {
            timerContent.textContent = "Good evening, sir. How was your today?"
        }
    })
}

function getMemo() {
    const memo = document.querySelector(".memo")
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input")
    memoInput.addEventListener("keyup", function (e) {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value)
            getMemo();
            memoInput.value = ""
        }
    })
}

function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo")
            e.target.textContent = ""
        }
    })
}

function getPoisiton(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

async function getWeather(lat, lon) {
    // console.log(lat, lon)

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2719e331e07a6af0547cfe7df2754c8c`)
        return data
    }

    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=2719e331e07a6af0547cfe7df2754c8c")
    return data
}

async function renderWeather() {
    let latitude = ""
    let longitude = ""

    try {
        const position = await getPoisiton();
        // console.log(position)
        latitude = position.coords.latitude
        longitude = position.coords.longitude
    } catch {

    }

    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    // console.log(weatherData.list)
    // 배열이 너무 많음
    // 오전, 오후만 남길 수 있는 로직 만들기
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if ((cur.dt_txt.indexOf("18:00:00") > 0)) {
            acc.push(cur)
        }
        return acc
    }, [])
    // console.log(weatherList)
    const modalBody = document.querySelector(".modal-body")
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponet(e);
    })
}

async function TodayWeather() {
    let latitude = ""
    let longitude = ""

    try {
        const position = await getPoisiton();
        // console.log(position)
        latitude = position.coords.latitude
        longitude = position.coords.longitude
    } catch {

    }

    const result = await getWeather(latitude, longitude);
    const TodayweatherData = result.data;

    const TodayWeather = TodayweatherData.list[0].weather[0].main;

    const modalButton = document.querySelector(".modal-button")
    modalButton.innerHTML = `
        <img src="${matchIcon(TodayWeather)}" class="modal-button-div" alt="...">
    `
}

function weatherWrapperComponet(e) {
    // console.log(e)
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1)
    return `
        <div class="card" style="width: 18rem;">
            <div class="card-header text-red text-center">
                ${e.dt_txt.split(" ")[0]}
            </div>
            <div class="card-body">
                <h5>${e.weather[0].main}</h5>
                <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
                <p class="card-text">${changeToCelsius(e.main.temp)}</p>
            </div>
        </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png"
    if (weatherData === "Clouds") return "./images/001-cloud.png"
    if (weatherData === "Rain") return "./images/003-rainy.png"
    if (weatherData === "Snow") return "./images/006-snowy.png"
    if (weatherData === "Thunderstorm") return "./images/008-storm.png"
    if (weatherData === "Drizzle") return "./images/031-snowflake.png"
    if (weatherData === "Atomsphere") return "./images/033-hurricane.png"
}

renderWeather();

TodayWeather();

deleteMemo();

getMemo();
setMemo();

setTime();
setTimeContent();

serRenderBackground();
setInterval(() => {
    serRenderBackground();
}, 5000)