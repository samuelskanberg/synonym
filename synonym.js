$(document).ready(function() {
    console.log("document loaded");

    var wordlist = ["foo", "bar", "pizza", "kalsonger", "ananas", "bananer", "kall", "varm"];
    var randomizer = 0;

    var team1_count = 0;
    var team2_count = 0;
    
    var current_team = 1;
    var countdown_counter = 5;

    var current_word = "foo";
    var correct_words = [];
    var skipped_words = [];
    var stolen_words = [];

    $("#startnewgame-button").click(function() {
        start_new_game();
        return false;
    });

    function start_new_game() {
        $("#startpage").hide();
        $("#playpage").show();
        $("#scorepage").show();

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
        correct_words = [];
        skipped_words = [];
        stolen_words = [];

        set_new_random_word();

        count_down();
        return false;
    }

    $("#nextword").click(function() {
        correct_words.push(current_word);
        if (countdown_counter > 0) {
            set_new_random_word();
        } else {
            show_results();
        }

        return false;
    });

    $("#skipword").click(function() {
        skipped_words.push(current_word);
        if (countdown_counter > 0) {
            set_new_random_word();
        } else {
            show_results();
        }

        return false;
    });

    $("#wordstolen").click(function() {
        stolen_words.push(current_word);
        show_results();

        return false;

    });

    function set_new_random_word() {
        current_word = get_random_word();
        $("#currentword").html(current_word);
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
        $("#skipword").hide();
        $("#wordstolen").show();
    }

    function show_results() {
        console.log("Correct words:");
        console.log(correct_words);

        console.log("Skipped words:");
        console.log(skipped_words);

        var correct_words_string = correct_words.join(", "); 
        $("#correctwords").html(correct_words_string);
        $("#correctwordscount").val(correct_words.length);

        var skipped_words_string = skipped_words.join(", "); 
        $("#skippedwords").html(skipped_words_string);
        $("#skippedwordscount").val(skipped_words.length);

        var stolen_words_string = stolen_words.join(", "); 
        $("#stolenwords").html(stolen_words_string);
        $("#stolenwordscount").val(stolen_words.length);

        $("#roundresultpage").show();

    }

    function get_random_word() {
        randomizer++;
        return wordlist[randomizer%wordlist.length];
    }

});
