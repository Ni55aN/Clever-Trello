
class RelationElement {

    res: RelationResource;
    parent: CardElement;
    child: CardElement;
    dom: JQuery;
    gizmo: JQuery;
    shapes: JQuery;
    lines: JQuery;
    flipped: boolean;
    view: DiagramView;

    constructor(relationRes: RelationResource, parent: CardElement, child: CardElement) {

        if (!child) return;

        this.res = relationRes;
        this.parent = parent;
        this.child = child;

        this.flipped = relationRes.flip || false;


        Utils.loadTemplate('views/relation-line.html', (el) => {

            this.dom = el;
            this.lines = this.dom.find('line');
            this.shapes = this.dom.find('shape');
            this.gizmo = this.dom.find('.handler-gizmo');


            this.dom.attr('title', this.res.type)


            this.gizmo.click((e: Event) => {

                e.stopPropagation();
                this.flipped = !this.flipped;
                this.view.relationManager.updateRelationFlip(this, this.flipped);
                this.update();

            });


            this.dom.click((e: Event) => {

                e.stopPropagation();
                this.view.relationManager.select(this);
            });

            this.view.container.append(this.dom);
            this.update();
        }, { type: this.res.type });

    }

    update() {

        var w1 = this.parent.dom.outerWidth() / 2,
            h1 = this.parent.dom.outerHeight() / 2;

        var w2 = this.child.dom.outerWidth() / 2,
            h2 = this.child.dom.outerHeight() / 2;

        var x1 = w1 + this.parent.position.x,
            y1 = h1 + this.parent.position.y;


        var x2 = w2 + this.child.position.x,
            y2 = h2 + this.child.position.y;

        if (this.flipped) { //swap coord

            var temp = x1;
            x1 = x2;
            x2 = temp;

            temp = y1;
            y1 = y2;
            y2 = temp;

            temp = w1;
            w1 = w2;
            w2 = temp;

            temp = h1;
            h1 = h2;
            h2 = temp;
        }

        var minX = Math.min(x1, x2);
        var minY = Math.min(y1, y2);

        var maxX = Math.max(x1, x2);
        var maxY = Math.max(y1, y2);


        var lineStyle = "solid";

        if (this.res.type == "realization" || this.res.type == "dependency")
            this.lines.addClass('dashed');


        this.lines.eq(0).css({ left: x1 - 5, top: minY - 5, width: 2, height: maxY - minY });
        this.lines.eq(1).css({ left: minX - 5, top: y2 - 5, width: (maxX - minX), height: 2 });
        this.gizmo.css({ left: x1 - 6, top: y2 - 6 });


        var rotate = "right";
        var shapex: number, shapey: number;

        if (this.flipped)//((this.type == "aggregation" || this.type == "composition") && !flipped) || (flipped && this.type != "aggregation" && this.type != "composition"))
        {
            if (y1 + h1 < y2) {

                rotate = "top";
                shapex = x1;
                shapey = y1 + h1;

            } else if (Math.abs(y1 - y2) < h1) {

                if (x1 < x2) {
                    rotate = 'left';
                    shapex = x1 + w1;
                    shapey = y2;
                }
                else {
                    rotate = 'right';
                    shapex = x1 - w1;
                    shapey = y2;
                }

            } else {
                rotate = "bottom";
                shapex = x1;
                shapey = y1 - h1;
            }
        } else {

            if (x1 < x2 - w2) {
                rotate = "right";
                shapex = x2 - w2;
                shapey = y2;

            }
            else if (Math.abs(x1 - x2) < w2) {

                if (y1 + h1 < y2) {

                    rotate = "bottom";
                    shapex = x1;
                    shapey = y2 - h2;
                }
                else {
                    rotate = "top";
                    shapex = x1;
                    shapey = y2 + h2;

                }
            }
            else {
                rotate = "left";
                shapex = x2 + w2;
                shapey = y2;
            }

        }


        this.shapes.eq(0).attr('class', 'icon-' + this.res.type + ' ' + rotate);
        this.shapes.eq(0).css({ left: shapex, top: shapey });
    }


    highlight(need: boolean) {

        if (need)
            this.dom.addClass('highlight');
        else
            this.dom.removeClass('highlight');
    };


    remove() {

        var ind = this.parent.relations.indexOf(this.res);

        this.parent.relations.splice(ind, 1);

        API.setCardClever(this.parent.id, { diagram: { relations: this.parent.relations } }, () => {

            console.log('removed relation ' + this.parent.id);

        });

        this.dom.remove();
    }
}
