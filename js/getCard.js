

var GetCard = {};

GetCard.blockedSets = ['Unhinged', 'Unglued'];

GetCard.search = function(searchString) {

return $.ajax({
        type: "GET",
        dataType: 'json', //mispelled
        url: "https://api.magicthegathering.io/v1/cards?name=" + searchString,
        async: false,
        contentType: "text/html",
        success: function (msg) {
            return msg.cards;             
        }
 });

}