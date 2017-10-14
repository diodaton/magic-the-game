

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(username, deckname, decklist){
    Client.socket.emit('newplayer', username, deckname, decklist);
};

Client.requestNewGame = function(requestingPlayerId, opponentPlayerId) {

    Client.socket.emit('requestnewgame', requestingPlayerId, opponentPlayerId);

};

Client.updatePlayerList = function(playerList) {
    Client.socket.emit('updatePlayerList', playerList);
};


Client.acceptJoinGame = function(acceptingPlayerId, requestingPlayerId) {
    Client.socket.emit('playeraccept', acceptingPlayerId, requestingPlayerId);
};

Client.declineJoinGame = function(decliningPlayerId, requestingPlayerId) {

    Client.socket.emit('playerdecline', decliningPlayerId, requestingPlayerId);

};


/**
 * ROOM FUNCTIONS - SCOPE:PAIR
 */

Client.socket.on('createroom', function(acceptingPlayerId, requestingPlayerId) {

    var opponentId = acceptingPlayerId;

    if (opponentId == Game.thisPlayer.id) {
        opponentId = requestingPlayerId;
    }

    Game.createRoom(opponentId);

});













Client.socket.on('requestnewgame',function(requestingPlayer){

    Game.requestNewGame(requestingPlayer);

});

Client.socket.on('responsegamedecline', function(message) {

    Game.responseDeclinedGame(message)
});



Client.socket.on('pendinggame', function() {

    Game.pendingNewGame();

});


/***********************************************************************************************************************
 * PLAYER CREATION
 **********************************************************************************************************************/

Client.socket.on('newplayer',function(newPlayer){
    Game.addNewPlayer(newPlayer);
});

Client.socket.on('allplayers',function(allPlayers, currentPlayer){

    Game.thisPlayer = currentPlayer;

    for(var i = 0; i < allPlayers.length; i++){
        Game.addNewPlayer(allPlayers[i]);
    }

    Game.thisPlayer = currentPlayer;
    Login.toggle(false);
    Game.togglePlayerList(true);
    Game.toggleHeader(true);

    // Client.socket.on('move',function(data){
    //     Game.movePlayer(data.id,data.x,data.y);
    // });

    Client.socket.on('remove',function(removedPlayerId){
        Game.removePlayer(removedPlayerId);
    });

    Client.socket.on('updatePlayerList', function(playerMap) {
        Game.updatePlayerList(playerMap);

    });
});



