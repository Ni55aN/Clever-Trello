
interface PopOverTemplate {
    elem: JQuery;
}

class PopOver {


    static show(target: JQuery, content: PopOverTemplate, autoClose: boolean = true) {

        let pos = target.offset();
        let h = target.outerHeight();
        let el = $('.pop-over');

        setTimeout(() => {

            el.empty().append(content.elem);

            el.css({ left: pos.left, top: h + pos.top });
            el.addClass('is-shown');


        }, 100);

        $(document.body).click((e: Event) => {
            var parentPopOver = $(e.target).parents(".pop-over");

            if (autoClose || parentPopOver.length == 0)
                PopOver.hide();
        });

    }


    static hide() {

        let el = $('.pop-over');
        el.empty();
        el.removeClass('is-shown');

    }

};


class PopOverViews implements PopOverTemplate {

    elem: JQuery;

    constructor(views: Views) {

        Utils.loadTemplate("views/popover-views.html", (el) => {

            el.find(' a.pop-over-header-close-btn').click((e: Event) => {

                PopOver.hide();
            });

            el.find('a.js-select.light-hover').click((e: Event) => {

                views.choose($(e.target).attr('name'));
            });

            this.elem = el;
        });

    }

};




class calendarSelect {

    dom: JQuery;

    constructor(current: any, name: string, res: any[], onchange: (value: any) => void) {


        this.dom = $('<div class="pika-label"></div>');

        this.dom.append('<span></span><select class="pika-select pika-select-' + name + '" tabindex="-1">');

        var selectDom = this.dom.find('select');


        var options = '';

        for (var i in res)
            options += '<option value="' + i + '" ' + (res[i] == current ? "selected" : "") + '>' + res[i] + '</option>\n';

        selectDom.append(options);

        selectDom.change((e) => {

            var val = parseInt($(e.target).val());

            this.update(res[val]);
            onchange(val);
        });


        this.update(current);
    }


    update(val: string) {

        this.dom.find('span').text(val)
    }
}


class calendarDays {

    dom: JQuery;
    selected: any;
    active: any;

    onDaySelected: any;

    constructor(selected: any, active: any, onDaySelected: () => void) {

        this.selected = selected;
        this.active = active;
        this.onDaySelected = onDaySelected;


        this.dom = $('<tbody></tbody>');

        this.update();
    }


    update() {

        this.dom.empty();
        var days = '';

        var firstWeekDay = new Date(this.active.year, this.active.month, 1).getDay();
        var lastDay = new Date(this.active.year, this.active.month + 1, 0).getDate();

        var dayNum = 1;
        while (dayNum <= lastDay) {
            days += '<tr>'

            for (var j = 0; j < 7; j++)
                if (dayNum == 1 && j < firstWeekDay - 1 || dayNum > lastDay)
                    days += '<td class="is-empty"></td>';
                else {
                    days += '<td date-day="' + dayNum + '" ' + (this.selected.day == dayNum && this.selected.month == this.active.month && this.selected.year == this.active.year ? 'class="is-selected"' : '')
                        + '><button class="pika-button pika-day" type="button" date-pika-year="' + this.active.year + '" date-pika-month="' + this.active.month + '" date-pika-day="' + dayNum + '">' + dayNum + '</button></td>'
                    dayNum++;
                }

            days += '</tr>'
        }



        this.dom.append(days);

        this.dom.find('td[date-day]').click((e: Event) => {

            this.dom.find('td[date-day]').removeClass("is-selected");

            var td = $(e.target).parent('td');
            td.addClass("is-selected");

            this.selected.day = td.attr('date-day');
            this.selected.month = this.active.month;
            this.selected.year = this.active.year;

            this.onDaySelected();

        });

    }
}


class PopOverCalendar implements PopOverTemplate {

    elem: JQuery;

    selected: any;
    active: any;

    dateInput: JQuery;
    timeInput: JQuery;
    card: Card;

    onSave: (data: any) => void;
    onRemove: () => void;


    sendDate() {

        var dval = this.dateInput.val();
        var tval = this.timeInput.val();

        this.onSave(Utils.DateFormat.parseInput(dval, tval));
    }

    update() {

        this.dateInput.val(this.selected.day + '/' + (this.selected.month + 1) + '/' + this.selected.year);
        this.timeInput.val(this.selected.hours + ':' + this.selected.minutes);

    }

    constructor(card: Card, selectedDate: any, onSave: (data: any) => void, onRemove: () => void) {

        this.card = card;
        this.onSave = onSave;
        this.onRemove = onRemove;


        var year: number, monthId: number, day: number, hours: number, minutes: number;

        if (selectedDate) {
            year = selectedDate.year;
            monthId = selectedDate.month;
            day = selectedDate.day;

            hours = selectedDate.hours;
            minutes = selectedDate.minutes;

        }
        else {
            var date = new Date();

            year = date.getFullYear();
            monthId = date.getMonth();
            day = date.getDate();

            hours = 12;
            minutes = 0;
        }

        this.selected = { year: year, month: monthId, day: day, hours: hours, minutes: minutes };
        this.active = { year: year, month: monthId, day: day };

        var years: number[] = [];
        for (var i = year - 10; i <= year + 10; i++)
            years[i] = i;




        Utils.loadTemplate("views/popover-calendar.html", (el: JQuery) => {



            this.dateInput = el.find('input.datepicker-select-input.js-dpicker-date-input.js-autofocus');


            this.dateInput.keypress((e: KeyboardEvent) => {

                if (e.keyCode == 13) {
                    this.sendDate();
                    return false;
                }


            });

            this.dateInput.focus();




            this.timeInput = el.find('input.datepicker-select-input.js-dpicker-time-input');

            this.timeInput.keypress((e: KeyboardEvent) => {

                if (e.keyCode == 13) {
                    this.sendDate();
                    return false;
                }
            });


            var calDays = new calendarDays(this.selected, this.active, () => {
                this.update();
            });

            var selectMonth = new calendarSelect(Assets.months[monthId], 'month', Assets.months, (val: number) => {

                this.active.month = val;

                calDays.update();
            });


            var selectYear = new calendarSelect(year, 'year', years, (val: number) => {

                this.active.year = val;

                calDays.update();
            });


            var prevButton = $('<button class="pika-prev" type="button">Prev</button>');
            var nextButton = $('<button class="pika-next" type="button">Next</button>');


            prevButton.click(() => {

                this.active.month--;

                if (this.active.month < 0)
                { this.active.year--; this.active.month = 11 }

                selectMonth.update(Assets.months[this.active.month]);
                selectYear.update(this.active.year);
                calDays.update();
            });


            nextButton.click(() => {

                this.active.month++;

                if (this.active.month > 11)
                { this.active.year++; this.active.month = 0 }

                selectMonth.update(Assets.months[this.active.monthId]);
                selectYear.update(this.active.year);
                calDays.update();
            });





            el.find('div.pika-title')
                .append(selectMonth.dom)
                .append(selectYear.dom)
                .append(prevButton)
                .append(nextButton);

            el.find('.js-dpicker-cal table').append(calDays.dom);

            el.find('input.primary.wide.confirm').click((e: Event) => {

                e.preventDefault();
                this.sendDate();
            });

            el.find('button.negate.remove-date.js-remove-date').click((e: Event) => {

                e.preventDefault();
                this.onRemove();
            });




            el.find(' a.pop-over-header-close-btn').click((e: Event) => {

                PopOver.hide();
            });

            this.update();

            this.elem = el;
        });
    }


}
