'use strickt';

// elements
const dayTemperature = document.querySelector('.day-temperature'),
    currentDate = document.querySelector('.current-date'),
    cardTitle = document.querySelectorAll('.card-title')
    currentCity = document.querySelector('.current-city'),
    currentGeo = document.querySelector('.current-geo'),
    nightTemperature = document.querySelector('.night-temperature'),
    windInfo = document.querySelector('.wind'),
    humidityInfo = document.querySelector('.humidity'),
    cloudyInfo = document.querySelector('.cloudy'),
    sunRise = document.querySelector('.sunrise'),
    sunSet = document.querySelector('.sunset'),
    pressureInfo = document.querySelector('.pressure'),
    weatherImg = document.querySelector('.weather-img'),
    cardTemperatureDay = document.querySelectorAll('.card-temperature-day'),
    cardTemperatureNight = document.querySelectorAll('.card-temperature-night'),
    weatherDesc = document.querySelectorAll('.weather-desc'),
    weatherMain = document.querySelectorAll('.weather-main'),
    cardIcon = document.querySelectorAll('.card-icon'),
    searchForm = document.querySelector('.search-form'),
    citySearch = document.querySelector('.city-search'),
    clearSearch = document.querySelector('.clear-search'),
    dropDown = document.querySelector('.dropdown'),
    warningMessage = document.querySelector('.warning'),
    helpText = document.querySelector('.help-text');

// data
const WEATHER_API_KEY = KEYS.weatherApiKey,
    GEOCODE_API_KEY = KEYS.geocodeApiKey,
    citiesApi = 'dataBase/cities.json';
    weatherIcons= {
        clearsky: 'imgs/card_imgs/clear_sky.svg',
        fewclouds: 'imgs/card_imgs/few_clouds.svg',
        scatteredclouds: 'imgs/card_imgs/scattered_clouds.svg',
        brokenclouds: 'imgs/card_imgs/broken_clouds.svg',
        showerrain: 'imgs/card_imgs/shower_rain.svg',
        rain: 'imgs/card_imgs/rain.svg',
        thunderstorm: 'imgs/card_imgs/thunderstorm.svg',
        snow: 'imgs/card_imgs/snow.svg',
        mist: 'imgs/card_imgs/mist.svg',
};
let cities = [];
let filtered = [];


// swiper-slider init
const mySwiper = new Swiper('.swiper-container', {
    spaceBetween: 59,
    slidesPerView: 4,
    inverse: true,
    navigation: {
        nextEl: '.next',
        prevEl: '.prev',
    },
    breakpoints: {
        360: {
            slidesPerView: 'auto',
            spaceBetween: 18,
        },
        540: {
            slidesPerView: 'auto',
            spaceBetween: 18,
        },
        605: {
            slidesPerView: 3,
            spaceBetween: 18,
        },
        768: {
            slidesPerView: 3,
        },
        1025: {
            slidesPerView: 2,
        },
        1300: {
            slidesPerView: 3,
        },
        1600: {
            slidesPerView: 4,
        }
    },
});

const mySwiper1 = new Swiper('.swiper-container1', {
    spaceBetween: 34,
    slidesPerView: 3,
    inverse: true,
    navigation: {
        nextEl: '.btn-next',
        prevEl: '.btn-prev',
    },
    breakpoints: {
        360: {
            slidesPerView: 'auto',
            spaceBetween: 13,
        },
        540: {
            slidesPerView: 3,
            spaceBetween: 13,
        },
        768: {
            slidesPerView: 3,
        },
        1025: {
            slidesPerView: 2,
        },
        1360: {
            slidesPerView: 2,
            spaceBetween: 29,
        },
        1600: {
            slidesPerView: 3,
        }
    }
});


// functions
const getCitiesData = async (url) => {   
    const request = await fetch(url);

    if(request.status === 200) {
        cities = await request.json();
    } else {
        console.error('Error ' + request.status)
    }
};

const showCities = (input, list, citiesData) => {
    list.textContent = '';

    if(input.value === '' || /[а-яА-ЯЁё]+/.test(input.value)) return;

    const filterCities = citiesData.filter(item => {
        if(item.name) {
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        }
    });
    
    filterCities.forEach((item, i) => {
        const li = document.createElement('li');
        li.textContent = `${item.name}, ${item.country}`;
        li.setAttribute('data-index', i)
        li.classList.add('dropdown_city');
        list.append(li);
    });

    filtered = filterCities;
    list.style.display = 'block';
};

const handlerCities = (e, list, input) => {
    const target = e.target;

    if(target.tagName === 'LI') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getHourly = (data) => {
    const date = new Date();
    const chartData = new Object();
    chartData.time = [];
    chartData.temperature = [];
    const tempData = new Object();
    tempData.time = ["02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"];
    tempData.temperature = [17, 18, 20, 21, 22, 23, 24, 24, 23, 23, 21, 21];

    if(data) {
        data.forEach(item => {
            for(const key in item) {
                if(key === 'dt' && chartData.time.length < 12) {
                    date.setTime(item[key] * 1000);
                    chartData.time.push(date.toLocaleString('en-GB', {timeStyle: 'short'}));
                }
                if(key === 'temp' && chartData.temperature.length < 12) {
                    chartData.temperature.push(parseInt(item[key]));
                }
            }
        });

        return chartData;    
    } else {
        return tempData;
    }
};

const createChart = (hourly) => {
    const {time, temperature} = getHourly(hourly);
    const ctx = document.getElementById('myChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, -10, 0, 165);
    
    gradient.addColorStop(0, 'rgba(0, 0, 20, 0)');
    gradient.addColorStop(0.5, 'rgba(23, 27, 20, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');

    Chart.defaults.global.defaultFontColor = '#ffffff';
    Chart.defaults.global.defaultFontSize = 17;
    Chart.defaults.global.defaultFontFamily = "Roboto";

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                backgroundColor: gradient,
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1,
                pointRadius: 2,
                pointBorderWidth: 0,
                pointBackgroundColor: '#fff',
                lineTension:0,
                fill: 'start',
                data: temperature,
            }],
        },
        options: {
            tooltips: {
                enabled: false,
                mode: false,
            },
            hover: {
                mode: null
            },
            maintainAspectRatio: false,
            aspectRatio: 1,
            responsive: true,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            display: false,
                            min: -10,
                            stepSize: 10,
                            autoSkip: true,
                        },
                        gridLines: {
                            display: false
                        },
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                        display: false
                        },
                    },
                ],
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    let chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = 'white';

                    this.data.datasets.forEach(function (dataset, i) {
                        let meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            let data = `${dataset.data[index]}\u00B0`;
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: document.documentElement.clientWidth < 1600 && document.documentElement.clientWidth >= 360 ? 18 : -12,
                },
            },
        }
    });
};

const getSunSchedule = (data) => {
    const date = new Date();
    const res = [];

    for(let key in data) {
        if(key === 'sunrise' || key === 'sunset') {
            date.setTime(data[key] * 1000);
            res.push(date.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit'}));
        }
    }

    return res;
};

const showCurrentWeather = (current, daily) => {
    const sunSchedule = getSunSchedule(current);
    sunRise.textContent = sunSchedule[0];
    sunSet.textContent = sunSchedule[1];

    dayTemperature.textContent = `${parseInt(current.temp)}\u2103`;
    nightTemperature.textContent = `${parseInt(daily['0'].temp.night)}\u00B0`;
    windInfo.textContent = `${(current.wind_speed).toFixed(1)} km/h`;
    humidityInfo.textContent = `${current.humidity}%`;
    cloudyInfo.textContent = `${current.clouds}%`;
    pressureInfo.textContent = `${(current.pressure) * 0.75} mm`;

    if(weatherIcons[current.weather['0'].description.replace(/\s+/g, '')] === undefined) {
        weatherImg.src = `imgs/card_imgs/${current.weather['0'].main.toLowerCase()}.svg`;
    } else {
        weatherImg.src = `imgs/card_imgs/${current.weather['0'].description.replace(/\s+/g, '')}.svg`;
    }
};

const showDayliWeather = (daily) => {
    for(let i = 0; i < cardTemperatureDay.length; i++) {
        cardTemperatureDay[i].textContent = `${parseInt(daily[i].temp.day)}\u00B0`;
        cardTemperatureNight[i].textContent = `${parseInt(daily[i].temp.night)}\u00B0`;
        weatherDesc[i].textContent = `${daily[i].weather['0'].description.substr(0, 1).toUpperCase()}${daily[i].weather['0'].description.substr(1)}`;
        weatherMain[i].textContent = `${daily[i].weather['0'].main}`;

        if(weatherIcons[daily[i].weather['0'].description.replace(/\s+/g, '')] === undefined) {
            cardIcon[i].src = `imgs/card_imgs/${daily[i].weather['0'].main.toLowerCase()}.svg`;
        } else {
            cardIcon[i].src = `imgs/card_imgs/${daily[i].weather['0'].description.replace(/\s+/g, '')}.svg`;
        }
    }
};

const getWeather = async (lat, lng, weatherApi) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=${weatherApi}`);
    const {current, daily, hourly} = await response.json();

    showCurrentWeather(current, daily);
    showDayliWeather(daily);
    createChart(hourly);
};

const getCurrentDate = (elem, cards) => {
    let date = new Date();
    const dateToString = date.toLocaleString('en-GB', {weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});

    elem.textContent = dateToString;

    for(let i = 0; i < cards.length; i++) {
        cards[i].textContent = date.toLocaleString('en-GB', {weekday: 'short', day: 'numeric'});
        date.setDate(date.getDate() + 1);
    }
};

const getRandomCity = () => {
    const citiesCoords = [
        {name: 'New-York', lat: '40.73', lng: '-73.93'},
        {name: 'London', lat: '51.50', lng: '-0.11'},
        {name: 'Los-Angeles', lat: '34.05', lng: '-118.24'},
        {name: 'Oslo', lat: '59.91', lng: '10.75'},
    ];
    const num = Math.floor(Math.random() * (citiesCoords.length));
    return citiesCoords[num];
};

const setLocationName = (data, elem1, elem2) => {
    let cityName = '';

    if(Array.isArray(data)) {
        cityName = data[0].components.city;

        elem1.textContent = `${cityName}, Today`;
        elem2.textContent = `${cityName}, ${data[0].components.country_code.toUpperCase()}`;
    } else {
        elem1.textContent = `${data.name}, Today`;
        elem2.textContent = `${data.name}, ${data.country}`;    
    }
};

const getCurrentLocation = async (args, lat, lng) => {
    if(lat === undefined && lng === undefined) {
        const coords = getRandomCity();
        lat = coords.lat;
        lng = coords.lng;
    }
    getWeather(lat, lng, args[2]);

    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GEOCODE_API_KEY}`);
    const {results} = await response.json();

    setLocationName(results, args[0], args[1]);
};

const getCoords = (...rest) => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                getCurrentLocation(rest, position.coords.latitude.toFixed(2), position.coords.longitude.toFixed(2));
            }, 
            function(errorMessage) {
                console.error('An error has occured while retreiving location', errorMessage);
                getCurrentLocation(rest);            
            }
        );
    } else {
        console.log('Geolocation is not supported with this browser');
    }
};


// event handlers
window.addEventListener('load', () => {
    if(document.documentElement.clientWidth > 1600 || document.documentElement.clientWidth < 1024 && document.documentElement.clientWidth > 541) {
        mySwiper1.destroy(true, false);
    } else if(document.documentElement.clientWidth < 1600 || document.documentElement.clientWidth < 541) {
        mySwiper1.init();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getCoords(currentCity, currentGeo, WEATHER_API_KEY);
    getCurrentDate(currentDate, cardTitle);
    createChart();
});

citySearch.addEventListener('input', ({target}) => {
    if(/[а-яА-ЯЁё]+/.test(target.value)) {
        helpText.style.display = 'block';
    } else {
        helpText.style.display = 'none';
        setTimeout(showCities, 700, target, dropDown, cities);
    }
});

dropDown.addEventListener('click', (e) => {
    const targetIndex = e.target.getAttribute('data-index');
    const choosenCity = filtered[targetIndex];
    getWeather(choosenCity.lat, choosenCity.lng, WEATHER_API_KEY);
    setLocationName(filtered[targetIndex], currentCity, currentGeo);
    handlerCities(e, dropDown, citySearch);
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getCityCoords(citySearch, GEOCODE_API_KEY);
});

clearSearch.addEventListener('click', () => {
    citySearch.value = '';
    dropDown.textContent = '';
    helpText.style.display = 'none';
});

// functions call
getCitiesData(citiesApi, citySearch);