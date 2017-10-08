
$(document).ready(function(){

    Game.create();

});

var Game = {};


var HTML_header = '<ul>'
    + '<li><a class="active" href="#home">Home</a></li>'
    + '</ul>';


Game.togglePlayerList = function(val) {

    if (val) {
        $(".player-list-container").show();
    } else {
        $(".player-list-container").hide();
    }
};

Game.create = function(){
    Game.playerMap = [];

    Login.requestUsername();
};

Game.addNewPlayer = function(player){
    Game.playerMap.push(player);

    Login.toggle(false);
    Game.togglePlayerList(true);
    Game.toggleHeader(true);

    Game.updatePlayerList(Game.playerMap);
};


Game.removePlayer = function(player){
    var indexToRemove = -1;
    for (var i = 0; i < Game.playerMap.length; i++) {
        if (Game.playerMap[i].id === player.id) {
            indexToRemove = i;
            break;
        }
    }

    if (indexToRemove > -1) {
        Game.playerMap.splice(indexToRemove, 1);
    }

    // Game.playerMap = $.grep(Game.playerMap, function(value) {
    //     return value != id;
    // });
    Game.updatePlayerList(Game.playerMap);
};

Game.updatePlayerList = function(playerMap) {

    var playerList = '<h3>Current list of logged in users</h3>'
        + '<table>'
        + '<tr>'
            + '<th>Username</th>'
            + '<th>Deckname</th>'
        + '</tr>';
    for (var i = 0; i < playerMap.length; i++) {
        playerList += '<tr>'
            + '<td class="player-list-single-player-username">' + playerMap[i].id + '</td>'
            + '<td class="player-list-single-player-deckname">' + playerMap[i].deckname + '</td>'
            + '</tr>';
    }

    playerList += "</table>";

    $(".player-list-wrapper").html(playerList);
};

Game.toggleHeader = function(value) {

    if (value) {
        $(".header").html(HTML_header);
    } else {
        $(".header").empty();
    }

}