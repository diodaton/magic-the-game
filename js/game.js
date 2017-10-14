
$(document).ready(function(){

    Game.create();

});

var Game = {};


Game.CARD_BACK = '/img/card-back.jpg';



Game.playerMap = [];
Game.thisPlayer;
Game.thisPlayerDeck = [];


/**
 * OPPONENT DETAILS
 */
Game.opponent = {};


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

Game.toggleGame = function(val) {

    if (val) {
        $(".game-container").show();
    } else {
        $(".game-container").hide();
    }
};

Game.create = function(){

    Login.requestUsername();
};

Game.addNewPlayer = function(player){

    if (Game.thisPlayer !== undefined) {
        Game.playerMap.push(player);

        Game.updatePlayerList(Game.playerMap);
    }
};


Game.removePlayer = function(removedPlayerId){
    var indexToRemove = -1;
    for (var i = 0; i < Game.playerMap.length; i++) {
        if (Game.playerMap[i].id === removedPlayerId) {
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


Game.requestNewGame = function(requestingPlayer) {

        if (confirm(requestingPlayer.id + ' would like to play a game of Magic. Do you accept?')) {

            Client.acceptJoinGame(Game.thisPlayer.id, requestingPlayer.id);

        } else {
            Client.declineJoinGame(Game.thisPlayer.id, requestingPlayer.id)
        }


};

Game.responseDeclinedGame = function(message) {

    alert(message);

}

Game.pendingNewGame = function() {

    confirm('Waiting for opponent to accept. You will be automatically placed in the game.');

};

Game.toggleHeader = function(value) {

    if (value) {
        $(".header").html(HTML_header);
        $('.username').html('Welcome, ' + Game.thisPlayer.id);
    } else {
        $(".header").empty();
    }

};


Game.findPlayer = function(playerId) {

    for(var i=0; i < Game.playerMap.length; i++) {
        if (Game.playerMap[i].id == playerId) {
            return Game.playerMap[i];
        }
    }

    return null;
}


/***********************************************************************************************************************
 * ROOM FUNCTIONS
 **********************************************************************************************************************/

Game.createRoom = function(opponentId) {

    Game.togglePlayerList(false);



    Game.opponent.deck = Card.getAllCards(Game.findPlayer(opponentId).decklist);

    $('.game-container').append('<h3>you are in a game! It is you ' + Game.thisPlayer.id + ' versus ' + opponentId + '</h3> <br />')
        .append('Your deck <br />');

    Card.displaCards(Game.thisPlayerDeck, '.game-container', 'this-player-card');

    $('.game-container').append('<br /> And your opponents deck <br />');

    Card.displaCards(Game.opponent.deck , '.game-container', 'opponent-player-card');

    Game.toggleGame(true);


};


