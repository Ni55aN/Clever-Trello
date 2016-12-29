class Tasks {


    constructor(container: JQuery, cards: Array<Card>) {


        for (var i = 0; i < cards.length; i++) {

            if (!Card.hasTime(cards[i])) continue;

            container.append('<item><a target="_blank" href="/c/' + cards[i].shortLink + '">' + cards[i].name + '</a></item>');
        }

    }
}
