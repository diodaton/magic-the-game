

var Login = {};

Login.HTML_login = '<h1>Login</h1>'
    + 'Username <br /> <input id="username" type="text" name="username" class="login-input-text">'
    + '<br />'
    + 'Deck Name <br /> <input id="deck-name", type="text" name="deck-name" class="login-input-text">'
    + '<br />'
    + 'Deck List <br /> <textarea rows="20" cols="50" id="decklist" resize="false" class="login-input-text" placeholder="Paste your decklist here. Your cards will appear below. Make sure each card and the number are correct."/>'
    + '<br />'
    + '<input id="continueLogin" type="submit" value="Continue">';

Login.delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

Login.verifyRequired = function() {

    var usernameVal = $('#username').val();
    var decknameVal = $('#deck-name').val();
    var deckVal = $('#decklist').val();

    var success = true;

    if (usernameVal === undefined || usernameVal == '') {
        $('#username').notify('Username is required', { position:"right middle", autohide: true, clickToHide: true, autoHideDelay:3000 });
        success = false;
    }

    if (decknameVal === undefined || decknameVal == '') {
        $('#deck-name').notify('Deck Name is required', { position:"right middle", autohide: true, clickToHide: true, autoHideDelay:3000 });
        success = false;
    }

    if (deckVal === undefined || deckVal == '') {
        $('#decklist').notify('Deck List is required', { position:"right middle", autohide: true, clickToHide: true, autoHideDelay:3000 });
        success = false;
    }

    return success;
};




Login.requestUsername = function() {

    $("#login").html(Login.HTML_login);

    $("#continueLogin").click(function(){

        if (Login.verifyRequired()) {

            $('#card-list').html('');

            Client.askNewPlayer($("#username").val(), $("#deck-name").val(), $("#decklist").val());
        }

    });

    $('#decklist').keyup(function (e) {

        if (Login.skipSearch()) {
            return;
        }

        Login.delay(function(){
            Login.searchCards($('#decklist').val());
        }, 1000 );

        // Login.searchCards(e);
    });

    $('#decklist').on('paste', function() {

        if (Login.skipSearch()) {
            return;
        }

        Login.delay(function() {
            Login.searchCards($('#decklist').val());
        }, 1000 );
    });


};


Login.skipSearch = function() {

    var decklist = $('#decklist').val();

     if(decklist === undefined || decklist === '' || decklist.trim() == '') {
         return true;
    }

    return false;
};



Login.searchCards = function(cardList) {

    $('#card-list').html('');
    Game.thisPlayerDeck = [];

    var cardArray = cardList.split(/\n/);

    var stringBuilder_Fail = '';

    var hasCards = false;

    var totalCardCount = 0;

    for (var i=0; i < cardArray.length; i++) {

        var cardNameNUmberArray = cardArray[i].split(' ');


        var cardCount = cardNameNUmberArray[0];
        var cardName = '';
        for (var j=1; j < cardNameNUmberArray.length; j++) {
            cardName += ' ' + cardNameNUmberArray[j];
        }



        if (isNaN(cardCount)) {
            if (stringBuilder_Fail !== '') {
                stringBuilder_Fail += '\n';
            }
            stringBuilder_Fail += cardArray[i];
            continue;
        }

        if (cardName !== '') {
            var cardData = Card.search(cardName.trim());


            var foundCard = false;
            if (cardData.responseJSON.cards.length > 0) {


                for(var k=0; k < cardData.responseJSON.cards.length; k++) {

                    var card = cardData.responseJSON.cards[k];
 
                    if (card !== undefined 
                        && card.imageUrl !== undefined 
                        && card.name.toLowerCase() == cardName.trim().toLowerCase() 
                        && !Card.blockedSets.includes(card.setName)) {

                        var stringBuilder = '';
                        for (var l=0; l < Number(cardCount); l++) {
                            stringBuilder += '<img src="' + card.imageUrl + '"/>';
                        }

                        totalCardCount += Number(cardCount);

                        Game.thisPlayerDeck.push({count:Number(cardCount), card: card});

                        foundCard = true;
                        hasCards = true;
                        $('#card-list').append(stringBuilder);
                        break;
                    }
                }
            }



            if (!foundCard) {

                if (stringBuilder_Fail !== '') {
                    stringBuilder_Fail += '\n';
                }
                stringBuilder_Fail += cardArray[i];
            }
        }
    }

    if (hasCards) {
        $('#card-list').prepend('<h3>You have ' + totalCardCount + ' cards in your deck</h3>');
    }

    if (!hasCards || stringBuilder_Fail != '') {

        $.notify('The Following Cards could not be found:\n\n' + stringBuilder_Fail, { position:"top right", autohide: false, clickToHide: true, autoHideDelay:7500 });
    } 

};



Login.toggle = function(val) {

    if(val) {
        $("#login").show();
    } else {
        $("#login").hide();
    }
}

