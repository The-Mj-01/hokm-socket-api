define(["game", "jquery", "domBinding", "layout", "config"],
function(game,    $,        domBinding,   layout,   config){
    window.game=game;

    return function () {
        //config.setNames(['a','b','c','d']);
        game.load();
    $(".cornerButton").removeClass("hide").addClass("show");
        
    layout.region = $('#game-region')[0];
    layout.adjust();

    domBinding.fragmentToDom($('#game-region')[0]);
        game.run.adjustLayout();

    $(window).resize(function () {
        layout.adjust();
        game.run.adjustLayout();
    });

   // var nums = ['one', 'two', 'three', 'four'];
    $('#control-region>button').on("click", function () {
        $('#control-region')[0].hidden = true;
    });
    $('#control-region>.newgame-but').on("click", function () {
        config.names.forEach(function (n, ind) {
            config.levels[ind] = $('.player-diff.' + nums[ind] + ' input').val();
            config.names[ind] = $('.player-set-name.' + nums[ind]).text();
        });
        config.sync();
    });
    
    $('#settings-but').on("click", function () {
        $('#settings-dialog')[0].hidden = false;
        config.names.forEach(function (n, ind) {
            $('.player-set-name.' + nums[ind])[0].innerHTML = n;
            $('.player-diff.' + nums[ind] + ' input').val(parseInt(config.levels[ind]));
            console.log(parseInt(config.levels[ind]));
        });
        $('#control-region')[0].hidden = false;
    });

        $(window).on('wheel', function(event) {
            if (event.originalEvent.deltaY < 0) {
                $("#team-score").removeClass("show").addClass("hide");
            }
            else {
                $("#team-score").removeClass("hide").addClass("show");
            }


        });
        game.run.newGame();//




    }
});