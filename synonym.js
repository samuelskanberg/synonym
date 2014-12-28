$(document).ready(function() {
    console.log("document loaded");

    $("#startplay-button").click(function() {
        $("#startpage").hide();
        $("#playpage").show();
    });
});
