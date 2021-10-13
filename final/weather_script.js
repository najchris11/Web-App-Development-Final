var clearllcCoordinatesURL = "https://api.clearllc.com/api/v2/miamidb/_table/zipcode";
var openWeatherMapURL = "https://api.openweathermap.org/data/2.5/onecall"
var clearllcCoordinatesAPIKey = "REDACTED";
var openWeatherMapAPIKey = "REDACTED";
var lat = "";
var lon = "";
var city = "";
var state = "";

$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        $("#sevenDayWeather").html("");
        $("#WeatherHeader").html("Loading...");
        getCoordinates();
    });
});

function getCoordinates() {
    var zipURIEncoded = encodeURI($("#zip").val());
    var a = $.ajax({
        url : clearllcCoordinatesURL + "?api_key=" + clearllcCoordinatesAPIKey + "&ids=" + zipURIEncoded,
        method : "GET"
    }).done(function(coordinatesResult) {
        console.log(coordinatesResult.resource[0].latitude + ", " + coordinatesResult.resource[0].longitude);
        lat = coordinatesResult.resource[0].latitude;
        lon = coordinatesResult.resource[0].longitude;
        city = coordinatesResult.resource[0].city;
        state = coordinatesResult.resource[0].state;

        getWeather();
    }).fail(function(error) {
        console.log("Error: ", error.statusText);
        $("#WeatherHeader").html("Error with ClearLLC:" + error.statusText + ".");
        setTimeout(getCoordinates(), 1000);
    });
}

function getWeather() {
    console.log(openWeatherMapURL + "?lat=" + lat + "&lon=" + lon + "&exclude=hourly&appid=" + openWeatherMapAPIKey);

    var a = $.ajax({
        url : openWeatherMapURL + "?lat=" + lat + "&lon=" + lon + "&exclude=hourly&appid=" + openWeatherMapAPIKey,
        method : "GET"
    }).done(function(weatherResult) {
        console.log(JSON.stringify(weatherResult));
        
        $("#WeatherHeader").html(city + ", " + state + "'s (" + $("#zip").val() + ") Forecast:");

        var currentWeatherTemp;
        var currentWeatherTempRounded;
        var weatherCondition = "";
        var high;
        var highRounded;
        var low;
        var lowRounded;
        var iconURL = "";
        var dt;
        var monthNum;
        var day;
        var month;
        var date;
        var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        dt = new Date(weatherResult.daily[0].dt * 1000);
        currentWeatherTemp = ((weatherResult.current.temp - 273.15) * 1.8) + 32;
        currentWeatherTempRounded = Math.round((currentWeatherTemp + Number.EPSILON) * 100) / 100;
        weatherCondition = weatherResult.current.weather[0].description.titleCase();
        iconURL = "http://openweathermap.org/img/wn/" + weatherResult.current.weather[0].icon + "@2x.png";
        high = ((weatherResult.daily[0].temp.max - 273.15) * 1.8) + 32;
        highRounded = Math.round(high);
        low = ((weatherResult.daily[0].temp.min - 273.15) * 1.8) + 32;
        lowRounded = Math.round(low);
        $("#sevenDayWeather").append("<div class=\"col-md-3 sevenDayWeatherIndividualDay\"><h5>Current Weather</h5><br><h5>" + weatherCondition + "<h5><img src=\"" + iconURL + "\" alt=\"Weather Icon\"><h5>" + highRounded + "°F | " + lowRounded + "°F</h5></div>");
        if (dt.getMonth() < 9) {
            monthNum = "0"+(dt.getMonth()+1);
        } else {
            monthNum = dt.getMonth() + 1;
        }
        $.ajax({
            url : "https://coulibcn.aws.csi.miamioh.edu/final.php?method=setTemp" + "&date=" + dt.getFullYear()+"-"+(monthNum)+"-"+dt.getDate() + "&location=" + $("#zip").val() + "&low=" + lowRounded + "&high=" + highRounded + "&forecast=" + weatherCondition ,
            method : "POST"
        });

        for (var i = 1; i < 4; i++) {
            dt = new Date(weatherResult.daily[i].dt * 1000);
            day = daysOfWeek[dt.getDay()];
            month = monthsOfYear[dt.getMonth()];
            date = dt.getDate();
            weatherCondition = weatherResult.daily[i].weather[0].description.titleCase();
            iconURL = "http://openweathermap.org/img/wn/" + weatherResult.daily[i].weather[0].icon + "@2x.png";
            high = ((weatherResult.daily[i].temp.max - 273.15) * 1.8) + 32;
            highRounded = Math.round(high);
            low = ((weatherResult.daily[i].temp.min - 273.15) * 1.8) + 32;
            lowRounded = Math.round(low);

            $("#sevenDayWeather").append("<div class=\"col-md-3 sevenDayWeatherIndividualDay\"><h5>" + day + ", " + month + " " + date + "</h5><br><h5>" + weatherCondition + "<h5><img src=\"" + iconURL + "\" alt=\"Weather Icon\"><h5>" + highRounded + "°F | " + lowRounded + "°F</h5></div>");
            if (dt.getMonth() < 9) {
                monthNum = "0"+(dt.getMonth()+1);
            } else {
                monthNum = dt.getMonth() + 1;
            }
            $.ajax({
                url : "https://coulibcn.aws.csi.miamioh.edu/final.php?method=setTemp" + "&date=" + dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate() + "&location=" + $("#zip").val() + "&low=" + lowRounded + "&high=" + highRounded + "&forecast=" + weatherCondition ,
                method : "POST"
            });
        }
        $("#sevenDayWeather").append("<div class=\"col-md-3 sevenDayWeatherIndividualDay\">" + "</div>");

        for (var i = 4; i < 7; i++) {
            dt = new Date(weatherResult.daily[i].dt * 1000);
            day = daysOfWeek[dt.getDay()];
            month = monthsOfYear[dt.getMonth()];
            date = dt.getDate();
            weatherCondition = weatherResult.daily[i].weather[0].description.titleCase();
            iconURL = "http://openweathermap.org/img/wn/" + weatherResult.daily[i].weather[0].icon + "@2x.png";
            high = ((weatherResult.daily[i].temp.max - 273.15) * 1.8) + 32;
            highRounded = Math.round(high);
            low = ((weatherResult.daily[i].temp.min - 273.15) * 1.8) + 32;
            lowRounded = Math.round(low);

            if (dt.getMonth() < 9) {
                monthNum = "0"+(dt.getMonth()+1);
            } else {
                monthNum = dt.getMonth() + 1;
            }
            $.ajax({
                url : "https://coulibcn.aws.csi.miamioh.edu/final.php?method=setTemp" + "&date=" + dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate() + "&location=" + $("#zip").val() + "&low=" + lowRounded + "&high=" + highRounded + "&forecast=" + weatherCondition ,
                method : "POST"
            });
            $("#sevenDayWeather").append("<div class=\"col-md-3 sevenDayWeatherIndividualDay\"><h5>" + day + ", " + month + " " + date + "</h5><br><h5>" + weatherCondition + "<h5><img src=\"" + iconURL + "\" alt=\"Weather Icon\"><h5>" + highRounded + "°F | " + lowRounded + "°F</h5></div>");
        }

    }).fail(function(error) {
        console.log("Error: ", error.statusText);
        $("#WeatherHeader").html("Error with OWM: " + error.statusText + ".");
        setTimeout(getWeather(), 1000);
    });
}

String.prototype.titleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
