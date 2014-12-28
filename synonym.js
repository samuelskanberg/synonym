$(document).ready(function() {
    console.log("document loaded");

    var team1_count = 0;
    var team2_count = 0;
    
    var current_team = 1;
    var countdown_counter = 5;

    $("#startnewgame-button").click(function() {
        start_new_game();
        return false;
    });

    function start_new_game() {
        $("#startpage").hide();
        $("#playpage").show();

        team1_count = 0;
        team2_count = 0;
        current_team = 1;
        $("#currentteam").html("Team "+current_team);
    }

    $("#startround").click(function() {
        start_round(current_team);
        return false; 
    }); 

    function start_round(team_count) {
        console.log("Start round!");
        $("#roundpage").show();
        countdown_counter = 5;

        var random_word = get_random_word();
        $("#currentword").html(random_word);

        count_down();
        return false;
    }

    function count_down() {
        console.log("Count down. Counter: "+countdown_counter);
        $("#timeleft").html(""+countdown_counter);
        if (countdown_counter > 0) {
            setTimeout(count_down, 1000);
            countdown_counter = countdown_counter-1;
        } else {
            finish_round();
        }
    }

    function finish_round() {
        alert("FINISHED");
    }

    function get_random_word() {
        return "pizza";
    }

});
