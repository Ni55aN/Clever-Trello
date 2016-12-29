interface ITrello {

    authorize(ops: any): void;
    rest(type: string, path: any, callback: (boards: Array<Card>) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, callback: (boards: Array<Action>) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, callback: (boards: Array<Board>) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, callback: (boards: Array<List>) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, callback: (CharacterData: Card) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, callback: (card: Card) => void, callback2: (e: Event) => void): void;
    rest(type: string, path: any, put: any, callback: (card: Card) => void, callback2: (e: Event) => void): void;



}

interface Card {

    id: string;
    name: string;
    idList: string;
    idBoard: string;
    idLabels: string;
    desc: string;
    due: string;
    shortLink: string;
    clever: any;

}

interface Board {
    id: string;
    name: string;
    prefs: any;
}

interface Action {
    date: string;

}

interface List {
    id: string;
    name: string;
}

interface Label {
    id: string;
    name: string;
    color: string;
}


declare var Trello: ITrello;
