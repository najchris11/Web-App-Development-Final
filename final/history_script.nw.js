var URL = "https://coulibcn.aws.csi.miamioh.edu/final.php?method=getTemp";
var location = "";
var date;
var dateRequested;
var low;
var high;

$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        $("#loading").html("Polling Database...");
        loadHistory();
    });
});

function loadHistory() {
    var dateURIEncoded = encodeURI($("#date").val());
    var sortURIEncoded = encodeURI($("#sortType").val());

    console.log(URL + "&date=" + dateURIEncoded + "&sort=" + sortURIEncoded)
    var a = $.ajax({
        url : URL + "&date=" + dateURIEncoded + "&sort=" + sortURIEncoded,
        method : "GET"
    }).done(function(serverResponse) {
        console.log(serverResponse.result);

        if (serverResponse.status == 0) {
            
            for (var i = 1; i < serverResponse.result.length; i++) {
                location = serverResponse.result[i].location;
                date = serverResponse.result[i].date
    
                $("#historyTable").append("<tr><th scope=\"row\">" + location + "</th><th scope=\"row\">" + date + "</td><td><em>Data Fills Here</em></td><td>ex. low</td><td>ex. high</td><td>ex. forecast</td></tr>");
                
            }
            $("#loading").html("Request Successful");

        }
    }).fail(function(error) {
        console.log("Error: ", error.statusText);
        $("#loading").html("Error: " + error.statusText + ". Please try again.");
        setTimeout(updateSensor(), 1000);
    });
}
