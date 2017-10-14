var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

server.roomList = [];

io.on('connection',function(socket){

    socket.on('newplayer',function(username, deckname, decklist){

    	console.log(username + ' logged in');
    	// console.log(deckname);
    	// console.log(decklist);

    	socket.player = {
    		id:username,
    		deckname:deckname,
    		decklist:decklist
    	}


        socket.emit('allplayers',getAllPlayers(), socket.player);
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('disconnect',function(){

            console.log(socket.player.id + ' logged out');

            io.emit('remove',socket.player.id);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('requestnewgame', function(requestingPlayerId, opponentplayerId){

            var requestingPlayer = findPlayerById(requestingPlayerId);

            sendMessageToSocket('requestnewgame', opponentplayerId, requestingPlayer, socket);
            socket.emit('pendinggame');
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('playeraccept', function(acceptingPlayerId, requestingPlayerId) {

            var roomName = createRoom(acceptingPlayerId, requestingPlayerId);

            console.log('creating room - ' + roomName);

            io.sockets.in(roomName).emit('createroom', acceptingPlayerId, requestingPlayerId);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('playerdecline', function(decliningPlayerId, requestingPlayerId) {

            sendMessageToSocket('responsegamedecline', requestingPlayerId, decliningPlayerId + ' has declined!', socket);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('updatePlayerList', function(playerList) {
        	socket.broadcast.emit('updatePlayerList', playerList);
        });
    });

});







function sendMessageToSocket(messageName, playerId, data, socket) {

    Object.keys(io.sockets.connected).forEach(function(socketID){

        var player = io.sockets.connected[socketID].player;
        if(player.id == playerId) {
            socket.broadcast.to(socketID).emit(messageName, data);
            return;
        }
    });

}





function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function findPlayerById(playerId) {
    var foundPlayer = null;
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player.id === playerId) {
            foundPlayer = player;
            return;
        }
    });
    return foundPlayer;
}

function createRoom(playerOneId, playerTwoId) {

    var roomName = getRoomName(playerOneId, playerTwoId);

    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player.id === playerOneId || player.id === playerTwoId) {

            console.log('player ' +player.id+ ' is joining room ' + roomName);
            io.sockets.connected[socketID].join(roomName);
        }
    });

    server.roomList.push(roomName);

    return roomName;
}

function getRoomName(playerOneId, playerTwoId) {
    return playerOneId + '-' + playerTwoId;
}

