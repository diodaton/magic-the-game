

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(username, deckname, decklist){
    Client.socket.emit('newplayer', username, deckname, decklist);
};

Client.requestNewGame = function(currentPlayerId, opponentPlayerId) {

    Client.socket.emit('requestnewgame', currentPlayerId, opponentPlayerId);

};

Client.updatePlayerList = function(playerList) {
    Client.socket.emit('updatePlayerList', playerList);
};


Client.acceptJoinGame = function(currentPlayerId, opponentPlayerId) {

};

Client.declineJoinGame = function(currentPlayerId, opponentPlayerId) {



};








Client.socket.on('newplayer',function(newPlayer){
    Game.addNewPlayer(newPlayer);
});

Client.socket.on('requestnewgame',function(data){

    Game.requestNewGame(data);

});

Client.socket.on('pendinggame', function() {

    Game.pendingNewGame();

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

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });

    Client.socket.on('updatePlayerList', function(playerMap) {
        Game.updatePlayerList(playerMap);

    });
});



