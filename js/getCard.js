

var Card = {};

Card.blockedSets = ['Unhinged', 'Unglued'];

Card.search = function(searchString) {

return $.ajax({
        type: "GET",
        dataType: 'json',
        url: "https://api.magicthegathering.io/v1/cards?name=" + searchString,
        async: false,
        contentType: "text/html",
        success: function (msg) {
            return msg.cards;             
        }
 });

};


Card.displaCards = function(playerDeck, parentClass, imgClass){



    var positionCount = 10;
    for(var k=0; k < playerDeck.length; k++) {

        var card = playerDeck[k].card;
        var cardCount = playerDeck[k].count;

        if (card.imageUrl !== undefined) {

            var stringBuilder = '';
            for (var l=0; l < Number(cardCount); l++) {
                stringBuilder += '<img style="left:' + positionCount + 'px;" class="' + imgClass + '" src="' + card.imageUrl + '"/>';

                positionCount += 40;
            }
            $(parentClass).append(stringBuilder);
        }
    }
};







Card.getAllCards = function(cardList){

    var foundList = [];

    var cardArray = cardList.split(/\n/);

    for (var i=0; i < cardArray.length; i++) {

        var cardNameNUmberArray = cardArray[i].split(' ');


        var cardCount = cardNameNUmberArray[0];
        var cardName = '';
        for (var j=1; j < cardNameNUmberArray.length; j++) {
            cardName += ' ' + cardNameNUmberArray[j];
        }

        if (cardName !== '') {
            var cardData = Card.search(cardName.trim());
            if (cardData.responseJSON.cards.length > 0) {

                for(var k=0; k < cardData.responseJSON.cards.length; k++) {

                    var card = cardData.responseJSON.cards[k];

                    if (card !== undefined
                        && card.imageUrl !== undefined
                        && card.name.toLowerCase() == cardName.trim().toLowerCase()
                        && !Card.blockedSets.includes(card.setName)) {

                        foundList.push({count:Number(cardCount), card:card});
                        break;
                    }
                }
            }
        }
    }

    return foundList;
};