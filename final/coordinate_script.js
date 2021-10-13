var clearllcCoordinatesURL = "https://api.clearllc.com/api/v2/miamidb/_table/zipcode";
var clearllcCoordinatesAPIKey = "bed859b37ac6f1dd59387829a18db84c22ac99c09ee0f5fb99cb708364858818";
var lat = "";
var lon = "";
var city = "";
var state = "";

$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        $("#coordinatesheader").html("Processing request...");
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
        $("#coordinatesheader").html("Coordinates for " + city + ", " + state + " (" + $("#zip").val() + "):");

        $("#coordinatesheader").append("<h3 style=\"margin: auto; width: 50%;\">" + lat + ", " + lon + "</h3></div>");

    }).fail(function(error) {
        console.log("Error: ", error.statusText);
        $("#coordinatesheader").html("Error with ClearLLC: " + error.statusText + ".");
        setTimeout(getCoordinates(), 1000);
    });
}
