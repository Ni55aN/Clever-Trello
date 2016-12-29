
class CardElement {

    position: any;
    name: string;
    id: string;
    board: Board;
    dom: JQuery;
    relations: RelationResource[] = [];
    relationHandlers: RelationElement[] = [];
    view: DiagramView;
    static defaultHeight = 100;

    constructor(view: DiagramView, card: Card, board: Board, labels: Array<Label>, callback: () => void) {

        this.view = view;
        this.name = card.name;
        this.id = card.id;
        this.board = board;

        if (card.clever.diagram && card.clever.diagram.relations)
            this.relations = card.clever.diagram.relations;


        var x: number, y: number;
        this.position = { x: 0, y: 0 };

        Utils.loadTemplate('views/diagram-card.html', (el) => {

            el.dblclick(function() {

                window.open('https://trello.com/c/' + card.shortLink, '_blank');
            });

            el.find('.list-card-operation').click((e: Event) => {

                this.view.relationManager.menuFor(this, this.view.container);
            });


            el.click(() => {

                this.view.relationManager.relationWith(this);
            });

            el.hover(
                () => { el.addClass('active-card') },
                () => { el.removeClass('active-card') }
            );

            var labelsDom = el.find('.list-card-labels');

            for (var i in labels)
                labelsDom.append('<span class="card-label card-label-' + labels[i].color + ' mod-card-front" title="' + labels[i].name + '">' + labels[i].name + '</span>');


            this.dom = el;


            if (card.clever.diagram && card.clever.diagram.x && card.clever.diagram.y) {
                x = card.clever.diagram.x;
                y = card.clever.diagram.y;
            }
            else {
                x = this.view.container.outerWidth() - 200 + 20 * Math.random();
                y = this.view.container.outerHeight() - 100 + 20 * Math.random();
            }




            this.setPosition(x, y);
            this.view.container.append(this.dom);

            callback();

        }, { index: this.view.cardManager.list.length, board: board, card: card });


    }


    setPosition(x: number, y: number) {


        this.position.x = x;
        this.position.y = y;

        if (y + CardElement.defaultHeight > this.view.canvasLength) { this.view.canvasLength = y + CardElement.defaultHeight; this.view.resizeCanvas(); }

        this.dom.css({ left: x, top: y });

        for (var i in this.relationHandlers)
            this.relationHandlers[i].update();
    }


};
