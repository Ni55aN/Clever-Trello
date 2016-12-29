interface RelationResource {
    type: string;
    flip?: boolean;
    card: string;
}


class RelationManager {

    keepCard: CardElement = null;
    relationType: string = '';
    list: RelationElement[] = [];
    selected: any = null;
    container: JQuery;
    view: DiagramView;

    constructor(view: DiagramView) {

        this.view = view;
        $('html').click(() => {

            this.select(null);
        });

        $(document).keydown((e: KeyboardEvent) => {

            if (e.keyCode == 46 && this.selected !== null) this.remove(this.selected);

        });
    }



    add(rel: RelationElement) {

        rel.view = this.view;
        this.list.push(rel);
    }
    menuFor(card: CardElement, container: JQuery) {

        $('div.quick-card-editor-buttons').remove();
        this.container = container;

        Utils.loadTemplate("views/diagram-menu.html", (el: JQuery) => {

            el.mouseleave((e: Event) => {

                el.remove();
            });


            el.find('a').click((e: Event) => {


                this.keep($(this).data().relationType, card);

            });



            var x = card.position.x + card.dom.outerWidth();
            var y = card.position.y;

            var widthOverflow = this.container.outerWidth() - (x + el.outerWidth());
            var heightOverflow = this.container.outerHeight() - (y + el.outerHeight());

            if (widthOverflow < 0) x += widthOverflow;
            if (heightOverflow < 0) y += heightOverflow;


            el.css({ position: 'absolute', left: x + 'px', top: y + 'px' });

            this.container.empty().append(el);

        });

    }


    remove(relation: RelationElement) {

        relation.remove();
        this.list.splice(this.list.indexOf(relation), 1);
    }

    select(relation: RelationElement) {

        for (var i in this.list)
            if (this.list[i].highlight) this.list[i].highlight(false);

        if (relation !== null)
            relation.highlight(true);

        this.selected = relation;
    }


    keep(type: string, card: CardElement) {

        this.unkeep();

        this.relationType = type;
        this.keepCard = card;
        this.keepCard.dom.addClass('keep');

    }


    unkeep() {

        if (this.keepCard != null) this.keepCard.dom.removeClass('keep');

        this.relationType = null;
        this.keepCard = null;

    }


    updateRelationFlip(relation: RelationElement, flipped: boolean) {

        var ind = relation.parent.relations.indexOf(relation.res);

        if (ind === -1) { console.log(relation); alert('Ooops'); }

        relation.parent.relations[ind].flip = flipped;

        API.setCardClever(relation.parent.id, { diagram: { relations: relation.parent.relations } }, function() {

            console.log('flip saved for ' + relation.parent.id);

        });

    }


    relationWith(card: CardElement) {

        var keepCard = this.keepCard;

        if (keepCard == null || keepCard == card) return;


        keepCard.relations.push({ type: this.relationType, card: card.id });

        API.setCardClever(keepCard.id, { diagram: { relations: keepCard.relations } }, function() {

            console.log(keepCard.name + ' relations with ' + card.name + ' by ' + this.relationType);

        });

        var relatInst = new RelationElement(keepCard.relations[keepCard.relations.length - 1], keepCard, card);
        this.container.append(relatInst.dom);
        this.list.push(relatInst);
        this.view.cardManager.list[this.view.cardManager.list.indexOf(keepCard)].relationHandlers.push(relatInst);
        this.view.cardManager.list[this.view.cardManager.list.indexOf(card)].relationHandlers.push(relatInst);

        this.unkeep();
    }


}
