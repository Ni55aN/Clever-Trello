class Card {

    id: string;
    name: string;
    idList: string;
    idBoard: string;
    idLabels: string;
    desc: string;
    due: string;
    shortLink: string;
    clever: any;
    created: any;

    static hasTime(card: Card) {

        return Card.hasDue(card) || Card.hasStart(card);
    }

    static hasDue(card: Card) {

        return card.due;
    }

    static hasStart(card: Card) {

        return (card.clever.startDate && card.clever.startDate != "null");
    }
}
