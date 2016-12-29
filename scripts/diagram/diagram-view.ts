/// <reference path="../views.ts" />

class DiagramView extends View {

    canvasLength = 0;
    cardManager: CardManager;
    relationManager: RelationManager;

    constructor(container: JQuery) {
        super("DIAGRAM", container);

        this.cardManager = new CardManager(this);
        this.relationManager = new RelationManager(this);
    }

    resizeCanvas() {
        this.container.css({ height: this.canvasLength + 'px' });
    }


    initRelations() {

        var cm = this.cardManager;
        var rm = this.relationManager;

        for (var i in cm.list) {

            for (var j in cm.list[i].relations)
                this.relationManager.add(new RelationElement(cm.list[i].relations[j], cm.list[i], cm.searchCardInstance(cm.list[i].relations[j].card)));
        }

        for (var i in cm.list) {

            for (var j in rm.list)
                if (rm.list[j].parent == cm.list[i] || rm.list[j].child == cm.list[i])
                    cm.list[i].relationHandlers.push(rm.list[j]);



        }

    }

    onCreate(done: () => void) {


        var res = this.parent.resource;

        this.container.css({ position: 'relative', display: 'table', width: '100%', overflow: 'hidden' });
        Utils.loadTemplate('views/load.html', (el: JQuery) => {
            this.container.empty().append(el);
        });



        var isDark = res.type == ResourceType.ORG;


        switch (res.type) {
            case ResourceType.ORG:


                API.getOrgCards(res.id, (cards, boards) => {

                    API.getBoardsLabels(boards, (labels) => {

                        this.container.empty();

                        /*	var extraMenu = $('<a class="list-header-extras-menu dark-hover js-open-list-menu" style="float:right;z-index:25;position:relative;"><span class="icon-sm icon-overflow-menu-horizontal"></span></a>');
                          extraMenu.click(function(e){

                            e.stopPropagation();
                            e.preventDefault();
                            PopOver.show("Settings",this,$("<span>test</span>")[0],true);

                          });
                          this.container.append(extraMenu);
                      */


                        var created = 0;
                        var done = () => {
                            created++;
                            if (created == cards.length) { this.initRelations(); this.resizeCanvas(); }
                        }



                        cards.forEach((card: Card, i: number) => {

                            var card = cards[i];
                            var match_board: Board = null;
                            var match_labels: Array<Label> = [];

                            for (var j in boards)
                                if (boards[j].id == cards[i].idBoard) { match_board = boards[j]; break; }

                            for (var j in labels)
                                if (card.idLabels.indexOf(labels[j].id) !== -1) match_labels.push(labels[j]);


                            this.cardManager.add(new CardElement(this, card, match_board, match_labels, done));


                        });

                    });
                });


                break;
        }


    }

    onShow() {


    }

    onHide() { }

}
