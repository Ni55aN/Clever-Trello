/// <reference path="def/Trello.d.ts" />


namespace API {

    export function getOrgBoards(orgId: string, callback: (b: Array<Board>) => void): void {

        Trello.rest('GET', 'organizations/' + orgId + '/boards', (boards: Array<Board>) => {

            callback(boards);

        }, (e: Event) => {

            console.log(e);
        });

    };


    export function getOrgCards(orgId: string, callback: (cards: Array<Card>, boards: Array<Board>) => void): void {

        var loaded = 0;
        var cardsList: Array<Card> = [];

        API.getOrgBoards(orgId, (boards: Array<Board>) => {



            for (var i = 0; i < boards.length; i++)
                Trello.rest('GET', 'boards/' + boards[i].id + '/cards', (cards: Array<Card>) => {

                    loaded++;
                    for (var j = 0; j < cards.length; j++)
                        cardsList.push(API.Util.formatCardData(cards[j]));

                    if (loaded >= boards.length)
                        callback(cardsList, boards);

                }, (e: Event) => {

                    console.log(e);
                });


        });

    };

    export function getBoardCards(id: string, callback: (cards: Array<Card>) => void): void {

        var cardsList: Array<Card> = [];
        Trello.rest('GET', 'boards/' + id + '/cards', (cards: Array<Card>) => {

            for (var j = 0; j < cards.length; j++)
                cardsList.push(API.Util.formatCardData(cards[j]));

            callback(cardsList);
        },
            (e: Event) => {

                console.log(e);
            });
    };


    export function getBoardActions(id: string, callback: (actions: Array<Action>) => void): void {


        Trello.rest('GET', 'boards/' + id + '/actions', (actions: Array<Action>) => {

            callback(actions);
        }, (e: Event) => { });

    };


    export function getBoardsActions(boards: Array<Board>, callback: (actions: Array<Action>) => void): void {


        var loaded = 0;
        var actionsList: Array<Action> = [];

        for (var i = 0; i < boards.length; i++)
            Trello.rest('GET', 'boards/' + boards[i].id + '/actions', (actions: Array<Action>) => {

                loaded++;
                actionsList = actionsList.concat(actions);

                if (loaded >= boards.length)
                    callback(actionsList);
            }, (e: Event) => { });

    };


    export function getBoardLists(id: string, callback: (lists: Array<List>) => void): void {

        Trello.rest('GET', 'boards/' + id + '/lists', (lists: Array<List>) => {

            callback(lists);
        }, (e: Event) => { });
    };


    export function getBoardsLists(boards: Array<Board>, callback: (lists: Array<List>) => void): void {

        var loaded = 0;
        var listsList: Array<List> = [];

        for (var i = 0; i < boards.length; i++)
            Trello.rest('GET', 'boards/' + boards[i].id + '/lists', (lists: Array<List>) => {

                loaded++;
                listsList = listsList.concat(lists);

                if (loaded >= boards.length)
                    callback(listsList);
            }, (e: Event) => { });

    };

    export function getBoardLabels(id: string, callback: (labels: Array<Label>) => void): void {

        Trello.rest('GET', 'boards/' + id + '/labels', (lists: Array<Label>) => {

            callback(lists);
        }, (e: Event) => { });
    };


    export function getBoardsLabels(boards: Array<Board>, callback: (labels: Array<Label>) => void): void {


        var loaded = 0;
        var labelsList: Array<Label> = [];

        for (var i = 0; i < boards.length; i++)
            Trello.rest('GET', 'boards/' + boards[i].id + '/labels', (labels: Array<Label>) => {

                loaded++;
                labelsList = labelsList.concat(labels);

                if (loaded >= boards.length)
                    callback(labelsList);
            }, (e: Event) => { });

    };


    export function getCard(shortUrlOrID: string, callback: (card: Card) => void): void {

        Trello.rest('GET', '/cards/' + shortUrlOrID + '/', (card: Card) => {

            console.log('Desc:' + card.desc);
            callback(API.Util.formatCardData(card));

        }, (e: Event) => {

            console.log(e);

        });
    };


    export function setCardClever(shortUrlOrID: string, params: any, callback: (e: Event) => void): void {


        API.getCard(shortUrlOrID, (data: Card) => {


            var mergedData = API.Util.mergeCleverData(data.clever, params);

            Trello.rest('PUT', '/cards/' + shortUrlOrID + '/', { desc: data.desc + API.Util.stringifyCleverData(mergedData) }, (card: Card) => {

                console.log('Desc updated:' + card.desc);
                //	console.log('Data changed:',e);

            }, (e: Event) => { });

        });
    }

    export var Util = {
        parseCleverData: function(desc: string) {

            if (desc.indexOf('[](clever:') === -1) return {};

            var data = desc.split('[](clever:')[1].split(':clever')[0];

            return JSON.parse(data);
        },
        parseDescription: function(desc: string) {

            return desc.split('[](clever:')[0].replace(/[\n]+$/g, ' ');;
        },
        stringifyCleverData: function(data: string) {

            return '\n\n\n\n\n[](clever:' + JSON.stringify(data) + ':clever)';
        },
        formatCardData: function(card: Card) {

            return {
                id: card.id,
                name: card.name,
                idList: card.idList,
                idBoard: card.idBoard,
                idLabels: card.idLabels,
                clever: API.Util.parseCleverData(card.desc),
                desc: API.Util.parseDescription(card.desc),
                due: card.due,
                shortLink: card.shortLink,
                created: parseInt(card.id.substring(0, 8), 16)
            };
        },
        mergeCleverData: function(oldClever: any, newClever: any) {

            var cleverObj = $.extend(true, oldClever, newClever);

            if (cleverObj.diagram && cleverObj.diagram.relations && newClever.diagram && newClever.diagram.relations)
                cleverObj.diagram.relations = newClever.diagram.relations;

            return cleverObj;
        }
    };


}
