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

        prepare_new_round();
    }

    function prepare_new_round() {
        refresh_score();
       
        $("#startround").show();     
        $("#roundpage").hide();
        $("#skipword").show();
        $("#wordstolen").hide();
        $("#roundresultpage").hide();

        $("#currentteam").html("Team "+current_team);
    }

    $("#startround").click(function() {
        start_round(current_team);
        return false; 
    }); 

    function start_round(team_count) {
        console.log("Start round!");
        $("#startround").hide();
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
            $("#currentword").html("");
            show_results();
        }

        return false;
    });

    $("#skipword").click(function() {
        skipped_words.push(current_word);
        if (countdown_counter > 0) {
            set_new_random_word();
        } else {
            $("#currentword").html("");
            show_results();
        }

        return false;
    });

    $("#wordstolen").click(function() {
        stolen_words.push(current_word);
        $("#currentword").html("");
        show_results();

        return false;
    });

    function set_new_random_word() {
        current_word = get_random_word();
        $("#currentword").html(current_word);
    }

    function count_down() {
        countdown_counter = countdown_counter-1;
        console.log("Count down. Counter: "+countdown_counter);
        $("#timeleft").html(""+countdown_counter);
        if (countdown_counter > 0) {
            setTimeout(count_down, 1000);
        } else {
            finish_round();
        }
    }

    function finish_round() {
        $("#wordstolen").show();
    }

    function show_results() {
        $("#roundpage").hide();
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

    function refresh_score() {
        $("#team1score").html(team1_count);
        $("#team2score").html(team2_count);
    }

    function next_team() {
        if (current_team == 1) {
            current_team = 2;
        } else {
            current_team = 1;
        }
    }

    $("#submitscore").click(function() {
        var correct = parseInt($("#correctwordscount").val());
        var skipped = parseInt($("#skippedwordscount").val());
        var total = correct-skipped;
        var other_team = parseInt($("#stolenwordscount").val());

        if (current_team == 1) {
            team1_count += total;
            team2_count += other_team;
        } else {
            team2_count += total;
            team1_count += other_team;
        }

        console.log("correct: "+correct);
        console.log("skipped: "+skipped);
        console.log("total: "+total);
        console.log("other_team: "+other_team);

        refresh_score();
        next_team();
        prepare_new_round();

        return false;
    });

    function get_random_word() {
        randomizer++;
        return wordlist[randomizer%wordlist.length];
    }

});
