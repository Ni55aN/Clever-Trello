/// <reference path="../views.ts" />

class GanttView extends View {

    timeline: Timeline;
    tasks: Tasks;

    constructor(container: JQuery) {
        super("GANTT", container);
    }




    init(cards: Array<Card>) {

        console.log(cards);


        Utils.loadTemplate('views/gantt.html', (el: JQuery) => {


            this.timeline = new Timeline(el.find('timeline'), cards);
            this.tasks = new Tasks(el.find('cards'), cards);


            this.container.empty().append(el);
        });

    }

    onCreate(done: () => void) {

        var res = this.parent.resource;

        //      this.container.append("kkllk");

        Utils.loadTemplate('views/load.html', (el: JQuery) => {
            this.container.empty().append(el);
        });


        switch (res.type) {
            case ResourceType.ORG:

                API.getOrgCards(res.id, (cards, boards) => {

                    this.init(cards);
                    done();
                });

                break;

            case ResourceType.BOARD:

                API.getBoardCards(res.id, (cards) => {

                    this.init(cards);
                    done();
                });

                break;

        }


    }

    onShow() {

    }

    onHide() {
    }


}
