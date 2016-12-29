class Timeline {

    static PAST_COLOR = 'rgb(176, 70, 50)';
    static FURUTE_COLOR = 'rgb(81, 152, 57)';


    private container: JQuery;
    private header: JQuery;
    private scale: number = Math.pow(10, 10);
    private zoom: number = 1;
    private cards: Array<Card>

    private minTime: number;
    private maxTime: number;

    private currentTime: number;



    constructor(container: JQuery, cards: Array<Card>) {



        this.container = container;
        this.header = container.find('header');
        this.cards = cards;

        this.currentTime = new Date().getTime();




        this.minTime = this.currentTime - 1000 * 60 * 60 * 12;
        this.maxTime = this.currentTime + 1000 * 60 * 60 * 12;

        for (var i = 0; i < this.cards.length; i++)
            if (Card.hasTime(this.cards[i])) {

                var due = this.cards[i].due ? Utils.DateFormat.parseTrello(this.cards[i].due, true).getTime() : null;
                var start = this.cards[i].clever.startDate ? Utils.DateFormat.parseTrello(this.cards[i].clever.startDate, true).getTime() : null;

                if (start) {


                    if (start > this.maxTime)
                        this.maxTime = start + 1000 * 60 * 60 * 12;
                    else if (start < this.minTime)
                        this.minTime = start;

                }

                if (due) {

                    if (due > this.maxTime)
                        this.maxTime = due;
                    else if (due < this.minTime)
                        this.minTime = due;
                }

            }


        this.container.bind('mousewheel', (e: any) => {

            e.preventDefault();

            var o = e.originalEvent.pageX - this.container.position().left;

            if (e.originalEvent.wheelDelta / 120 > 0)
                this.setZoom(this.zoom + 0.2, o);
            else if (this.zoom > 2)
                this.setZoom(this.zoom - 0.2, o);

        });


        this.insertItems();
        setTimeout(() => { this.setZoom(2, 0); }, 100);


    }
    yyyymm(date: any) {

        var mm = date.getMonth() + 1;

        return [date.getFullYear(), !mm[1] && '.', mm].join('');
    }

    yyyymmdd(date: any) {

        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [date.getFullYear(), !mm[1] && '.', mm, !dd[1] && '.', dd].join('');
    }



    hhmm(date: any) {

        var hh = date.getHours();
        var mm = date.getMinutes();

        return [hh, ':', mm].join('');
    }



    insertItems() {

        this.cards.forEach((e, i) => {
            if (Card.hasTime(this.cards[i])) {

                var item = $('<item style="width:10px"></item>');
                item.dblclick(() => { window.open('c/' + this.cards[i].shortLink); });
                this.container.append(item)

            }
        });

    }

    updateHeader() {



        var start = new Date(this.minTime);
        var end = new Date(this.maxTime);


        if (this.zoom > 5) {

            var first = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours() + 1);
            var last = new Date(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours());
            var width = this.time2px(1000 * 60 * 60);

            var html = '<cell style="width:' + this.time2px(first.getTime() - start.getTime()) + 'px;" title="' + this.hhmm(start) + '"></cell>';

            for (var day = first; day.getTime() < last.getTime(); day.setHours(day.getHours() + 1))
                html += '<cell style="width:' + width + 'px;">' + this.hhmm(day) + '</cell>';


            html += '<cell style="width:' + this.time2px(end.getTime() - last.getTime()) + 'px;" title="' + this.hhmm(end) + '"></cell>';
        }
        else if (this.zoom > 4) {
            var first = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
            var last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            var width = this.time2px(1000 * 60 * 60 * 24);

            var html = '<cell style="width:' + this.time2px(first.getTime() - start.getTime()) + 'px;" title="' + this.yyyymmdd(start) + '"></cell>';

            for (var day = first; day.getTime() < last.getTime(); day.setDate(day.getDate() + 1))
                html += '<cell style="width:' + width + 'px;">' + this.yyyymmdd(day) + '</cell>';

            html += '<cell style="width:' + this.time2px(end.getTime() - last.getTime()) + 'px;" title="' + this.yyyymmdd(end) + '"></cell>';
        }
        else {
            var first = new Date(start.getFullYear(), start.getMonth() + 1);
            var last = new Date(end.getFullYear(), end.getMonth());
            var width = this.time2px(1000 * 60 * 60 * 24 * 30);

            var html = '<cell style="width:' + this.time2px(first.getTime() - start.getTime()) + 'px;" title="' + this.yyyymm(start) + '"></cell>';

            for (var day = first; day.getTime() < last.getTime(); day.setMonth(day.setMonth() + 1))
                html += '<cell style="width:' + width + 'px;">' + this.yyyymm(day) + '</cell>';

            html += '<cell style="width:' + this.time2px(end.getTime() - last.getTime()) + 'px;" title="' + this.yyyymm(end) + '"></cell>';

        }

        this.header.html(html);
    }

    setZoom(val: number, mouseOffset: number) {

        var timestamp = this.maxTime - this.minTime;
        var minZoom = this.minZoom(timestamp, this.container.width());

        var prev_w = this.time2px(timestamp);
        this.zoom = val < minZoom ? minZoom : val;
        var curr_w = this.time2px(timestamp);

        this.updateHeader();
        this.container.scrollLeft((curr_w / prev_w) * (this.container.scrollLeft() + mouseOffset) - mouseOffset);


        var items = this.container.find('item');

        for (var i = 0, j = 0; i < this.cards.length; i++)
            if (Card.hasTime(this.cards[i])) {

                var itemElement = items.eq(j++);
                var card = this.cards[i];
                itemElement.attr('title', (Card.hasStart(card) ? 'Start: ' + Utils.DateFormat.parseTrello(card.clever.startDate, true).toString() : '') + (Card.hasDue(card) ? '  Due: ' + Utils.DateFormat.parseTrello(card.due, true).toString() : ''));
                itemElement.css(this.getItemProperties(card));
            }


        this.container.find('present').css('left', this.time2px(new Date().getTime() - this.minTime) + 'px');

    }



    getItemProperties(card: Card): any {

        var offset = 0;
        var width = 0;

        var due = card.due ? Utils.DateFormat.parseTrello(card.due, true).getTime() : null;
        var start = card.clever.startDate ? Utils.DateFormat.parseTrello(card.clever.startDate, true).getTime() : null;

        var bg: string, offset: number, width: number;

        if (due && start) {

            bg = due < this.currentTime ? Timeline.PAST_COLOR : Timeline.FURUTE_COLOR;
            offset = Math.abs(start - this.minTime);
            width = Math.abs(due - start);

        } else if (due) {

            if (due > this.currentTime) {
                bg = 'linear-gradient(to right, transparent,' + Timeline.FURUTE_COLOR + ')';
                offset = Math.abs(this.currentTime - this.minTime);
                width = Math.abs(due - this.currentTime);
            } else {
                bg = 'linear-gradient(to left, transparent, ' + Timeline.PAST_COLOR + ')';
                offset = Math.abs(due - this.minTime);
                width = Math.abs(due - this.currentTime);
            }
        }
        else if (start) {

            if (start > this.currentTime) {
                bg = 'linear-gradient(to left, transparent, ' + Timeline.FURUTE_COLOR + ')';
                offset = Math.abs(start - this.minTime);
                width = Math.abs(start - this.maxTime);
            } else {
                bg = 'linear-gradient(to left, transparent, ' + Timeline.PAST_COLOR + ')';
                offset = Math.abs(start - this.minTime);
                width = Math.abs(start - this.maxTime);
            }

        }

        return {
            background: bg,
            marginLeft: this.time2px(offset),
            width: this.time2px(width)
        };

    }

    time2px(time: number) {

        return time / this.scale * Math.pow(10, this.zoom);
    }

    px2time(px: number) {

        return px * this.scale / Math.pow(10, this.zoom);
    }

    minZoom(time: number, width: number) {

        return Math.log((width * this.scale) / time) / Math.log(10);
    }

}
