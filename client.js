

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(username, deckname, decklist){
    Client.socket.emit('newplayer', username, deckname, decklist);
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.updatePlayerList = function(playerList) {
    Client.socket.emit('updatePlayerList', playerList);
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i]);
    }

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



