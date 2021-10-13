var URL = "https://coulibcn.aws.csi.miamioh.edu/final.php?method=getTemp";

$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        $("#loading").html("Polling Database...");
        $("#historyTable").html("");
        loadHistory();
    });
});

function loadHistory() {
    var dateURIEncoded = encodeURI($("#date").val());
    var sortURIEncoded = encodeURI($("#sortType").val());

    var a = $.ajax({
        url : URL + "&date=" + dateURIEncoded + "&sort=" + sortURIEncoded,
        method : "GET"
    }).done(function(serverResponse) {
        console.log(serverResponse.result);
            $("#historyTable").html();
            for (var i = 0; i < serverResponse.result.length; i++) {
    
                $("#historyTable").append("<tr><th scope=\"row\">" + serverResponse.result[i].location + "</th><th scope=\"row\">" + serverResponse.result[i].date + "</td><td>" + serverResponse.result[i].DateRequested + "</td><td>" + serverResponse.result[i].Low + "</td><td>" + serverResponse.result[i].High + "</td><td>" + serverResponse.result[i].Forecast + "</td></tr>");
                console.log("hey")
            }
            $("#loading").html("Request Successful");

    }).fail(function(error) {
        console.log("Error: ", error.statusText);
        $("#loading").html("Error: " + error.statusText + ".");
        setTimeout(loadHistory(), 1000);
    });
}
