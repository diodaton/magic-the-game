
$(document).ready(function(){

    Game.create();

});

var Game = {};

Game.playerMap = [];

Game.thisPlayer;


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

    Login.requestUsername();
};

Game.addNewPlayer = function(player){
    Game.playerMap.push(player);

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

        if (playerMap[i].id != Game.thisPlayer.id) {
            playerList += '<tr class="player-button" val="' + playerMap[i].id + '">'
                + '<td class="player-list-single-player-username">' + playerMap[i].id + '</td>'
                + '<td class="player-list-single-player-deckname">' + playerMap[i].deckname + '</td>'
                + '</tr>';
        }
    }
    playerList += "</table>";

    $(".player-list-wrapper").html(playerList);

    $('.player-button').click(function(){

        Client.requestNewGame(Game.thisPlayer.id, $(this).attr('val'))

    });
};


Game.requestNewGame = function(opponentPlayer) {

        var askToJoin = confirm(opponentPlayer.id + ' would like to play a game of Magic. Do you accept?');

        if (askToJoin == true) {

            Client.acceptJoinGame(Game.thisPlayer.id, opponentPlayer);

            return;
        }

        Client.declineJoinGame(Game.thisPlayer.id, opponentPlayer)

};

Game.pendingNewGame = function() {

    confirm('Waiting for opponent to accept. You will be automatically placed in the game.');

};

Game.toggleHeader = function(value) {

    if (value) {
        $(".header").html(HTML_header);
    } else {
        $(".header").empty();
    }

};