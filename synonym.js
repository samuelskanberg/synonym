$(document).ready(function() {
    var sound_effect = new Audio("blip.ogg"); // buffers automatically when created

    console.log("document loaded");

    var score_limit = 70;
    //var score_limit = 20;
    var wordlist = ["foo", "bar", "pizza", "kalsonger", "ananas", "bananer", "kall", "varm"];
    var randomizer = 0;

    var team1_count = 0;
    var team2_count = 0;
    
    var current_team = 1;
    var countdown_counter = 60;
    //var countdown_counter = 5;

    var current_word = "foo";
    var correct_words = [];
    var dropped_words = [];
    var stolen_words = [];

    prepare_new_game();

    $(document).keypress(function(e){
        if ($("#activeroundpage").is(':visible')) {
            console.log("is visible");
            switch (e.keyCode) {
                case 40:
                    console.log('down');
                    $("#dropword").trigger("click");
                    break;
                case 38:
                    console.log('up');
                    break;
                case 37:
                    console.log('left');
                    if ($("#wordstolen").is(":visible")) {
                        $("#wordstolen").trigger("click");
                    }
                    break;
                case 39:
                    console.log('right');
                    $("#nextword").trigger("click");
                    break;
                default:
                    console.log('???');  
                } 
        } else {
            console.log("is NOT visible");
        }
    });

    function prepare_new_game() {
        $("#startpage").show();
        $("#winnerresultpage").hide();
        $("#roundpage").hide();
        $("#scorepage").hide();
        $("#scorelimit").val(score_limit);
    }

    $("#startnewgame-button").click(function() {
        score_limit = $("#scorelimit").val();
        console.log("score limit: "+score_limit);
        //var url = "ordlista.txt";
        //var url = "oneword.txt";
        var url = "swe.txt";
        $.ajax({
            url: url,
            success: function (data){
                console.log("done loading");
                wordlist = data.split('\n');
                // Skip last word which is empty because of the last newline
                wordlist.pop();
            }
        });
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
        $("#roundpage").show();
        $("#activeroundpage").hide();
        $("#dropword").show();
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
        $("#activeroundpage").show();

        countdown_counter = 60;
        correct_words = [];
        dropped_words = [];
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

    $("#dropword").click(function() {
        if (countdown_counter > 0) {
            dropped_words.push(current_word);
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
        sound_effect.play();
        $("#wordstolen").show();
    }

    function show_results() {
        $("#activeroundpage").hide();
        console.log("Correct words:");
        console.log(correct_words);

        console.log("Skipped words:");
        console.log(dropped_words);

        var correct_words_string = correct_words.join(", "); 
        $("#correctwords").html(correct_words_string);
        $("#correctwordscount").val(correct_words.length);

        var dropped_words_string = dropped_words.join(", "); 
        $("#droppedwords").html(dropped_words_string);
        $("#droppedwordscount").val(dropped_words.length);

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
        var dropped = parseInt($("#droppedwordscount").val());
        var total = correct-dropped;
        var other_team = parseInt($("#stolenwordscount").val());

        if (current_team == 1) {
            team1_count += total;
            team2_count += other_team;
        } else {
            team2_count += total;
            team1_count += other_team;
        }

        console.log("correct: "+correct);
        console.log("dropped: "+dropped);
        console.log("total: "+total);
        console.log("other_team: "+other_team);

        refresh_score();

        if (has_winner()) {
            console.log("Has winner");
            show_winner();
        } else {
            next_team();
            prepare_new_round();
        }

        return false;
    });

    function has_winner() {
        return (team1_count >= score_limit || team2_count >= score_limit);
    }

    function show_winner() {
        console.log("Show winner");
        var winner_team;
        if (team1_count >= score_limit) {
            winner_team = "Team 1";
        } else {
            winner_team = "Team 2";
        }

        $("#roundresultpage").hide();
        $("#winner").html(winner_team);
        $("#winnerresultpage").show();
    }

    $("#playagain-button").click(function() {
        prepare_new_game();
    });

    function get_random_word() {
        var word = wordlist[Math.floor(Math.random()*wordlist.length)];
        console.log("Random word: "+word);
        return word;
    }
});
