
class CardManager {

    list: CardElement[] = [];
    containerOffset: any;
    view: DiagramView;

    constructor(view: DiagramView) {

        this.view = view;
        var deltaPos: any = null;
        var target: CardElement = null;
        this.containerOffset = this.view.container.offset();

        this.view.container.mousedown((e: JQueryMouseEventObject) => {


            var cardElem = $(e.target).parents('.list-card.diagram-card');
            if (cardElem.length == 0) return;


            target = this.list[cardElem.data().cardIndex];


            deltaPos = { x: e.pageX - this.containerOffset.left - target.position.x, y: e.pageY - this.containerOffset.top - target.position.y };


        });

        this.view.container.mousemove((e: JQueryMouseEventObject) => {

            e.preventDefault();
            if (!target) return;

            target.setPosition(e.pageX - this.containerOffset.left - deltaPos.x, e.pageY - this.containerOffset.top - deltaPos.y)

        });

        this.view.container.mouseup((e: Event) => {

            if (!target) return;

            this.confirmPosition(target);
            target = null;

        });
    }

    add(cardEl: CardElement) {

        this.list.push(cardEl);
    }

    searchCardInstance(id: string) {

        for (var i in this.list)
            if (this.list[i].id == id) return this.list[i];


        return null;
    }

    confirmPosition(target: CardElement) {

        var id = target.id;
        var x = target.position.x;
        var y = target.position.y;

        API.setCardClever(id, { diagram: { x: x, y: y } }, (e: Event) => {



        });

    }

}
