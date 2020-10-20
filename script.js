
var apiKey= "7c36e96a7ada1b2bc2e4e413e55c3965"
var cityEl =document.querySelector("#city-name");
var tempEl=document.querySelector("#temp");
var findEl = document.querySelector("#find");
var weatherEl = document.querySelector("#wheather");
var weakEl = document.querySelector("#weak");
var prev = document.querySelector("#previous");
var inputEl=document.querySelector("#input");
var formSumbitHandler = function(event){
    event.preventDefault();
    var city = inputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        inputEl.value = "";
    } 
    
    find();
    pastSearch(city);
}
var cities = [];
var find = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
   
   tempEl.textContent= "";  
   findEl.textContent=searchCity;

   

   
   var todayEl = document.createElement("span")
   todayEl.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   findEl.appendChild(todayEl);

  
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   findEl.appendChild(weatherIcon);

   
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";

  
   
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
 

   
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";  

   tempEl.appendChild(temperatureEl);

   tempEl.appendChild(humidityEl);

   
   tempEl.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   uvIn(lat,lon)
}

var uvIn = function(lat,lon){

    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            uv(data)
           
        });
    }); 
}
 
var uv = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    // uvIndexEl.classList = "items"

    uvEl = document.createElement("span")
    uvEl.textContent = index.value

    if(index.value < 3){
        uvEl.classList = "good"
    }else if(index.value >3 && index.value<5){
        uvEl.classList = "normal"
    }
    else if(index.value >5){
        uvEl.classList = "bad"
    };

    uvIndexEl.appendChild(uvEl);

    
    tempEl.appendChild(uvIndexEl);
}

var get5Day = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    weakEl.textContent = ""
    weatherEl.textContent = "5-Day Weather:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dayEl = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-4";

       
       var date = document.createElement("h4")
       date.textContent= moment.unix(dayEl.dt).format("MMM D, YYYY");
       date.classList = "card-header text-center"
       forecastEl.appendChild(date);

       
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dayEl.weather[0].icon}@2x.png`);  

       forecastEl.appendChild(weatherIcon);
       
       var foreEl=document.createElement("span");
       foreEl.classList = "card-body text-center";
       foreEl.textContent = dayEl.main.temp + " °F";

        
        forecastEl.appendChild(foreEl);

       var humEl=document.createElement("span");
       humEl.classList = "card-body text-center";
       humEl.textContent = dayEl.main.humidity + "  %";

       
       forecastEl.appendChild(humEl);
     
        weakEl.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){

    preEl = document.createElement("button");
    preEl.textContent = pastSearch;
    preEl.classList = "d-flex w-100 btn-dark border p-2";
    preEl.setAttribute("data-city",pastSearch)
    preEl.setAttribute("type", "submit");

    prev.prepend(preEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

cityEl.addEventListener("submit", formSumbitHandler);
prev.addEventListener("click", pastSearchHandler);
