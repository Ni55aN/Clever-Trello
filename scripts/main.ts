/// <reference path="def/jquery.d.ts" />
/// <reference path="def/chrome.d.ts" />
/// <reference path="def/Trello.d.ts" />
/// <reference path="def/es6-promise.d.ts" />
/// <reference path="diagram/diagram-view.ts" />
/// <reference path="report/report-view.ts" />

enum PageLocation {
    NONE, MAIN, BOARD, CARD
}

enum ResourceType {
    ORG, BOARD
}

class Resource {

    id: string;

    location: PageLocation;
    type: ResourceType;

    constructor(id: string, location: PageLocation, type: ResourceType) {

        this.id = id;
        this.location = location;

        this.type = type;
    }
}

class CleverButton {

    constructor(target: JQuery, name: string, views: Views) {

        Utils.loadTemplate("views/button-" + name + ".html", function(elem: JQuery) {


            elem.click((e: Event) => {
                PopOver.show($(e.target), new PopOverViews(views));
            });

            target.append(elem);

        });
    }
}




class Clever {

    static isAuth: boolean = false;
    static location: PageLocation = PageLocation.NONE;

    static auth() {


        Trello.authorize({
            type: "popup",
            name: "Getting Started Application",
            scope: {
                read: true,
                write: true
            },
            expiration: "never",
            success: function() {

                Clever.isAuth = true;
                localStorage.setItem("cleverAuth", "true");
                console.log("Auth success");

            },
            error: function(e: Event) {

                console.log(e);
                alert("Auth error");
            }
        });
    }

    static onPageLoaded(loc: PageLocation) {

        Clever.location = loc;
        let target: JQuery;


        switch (loc) {

            case PageLocation.MAIN:

                target = $('.boards-page-board-section-header .boards-page-board-section-header-options');
                target.addClass('clever-inited');

                for (let i = 0; i < target.length; i++) {

                    let org = target.eq(i);
                    let container = org.parents('.boards-page-board-section');

                    let orgname = org.find(".boards-page-board-section-header-options-item").attr('href').substring(1);

                    let views = new Views(new Resource(orgname, PageLocation.MAIN, ResourceType.ORG));

                    views.add(<View>new DefaultView(container.find('.boards-page-board-section-list')));
                    views.add(<View>new DiagramView($('<ul class="boards-page-board-section-diagram" style="display:none"></ul>').appendTo(container)));
                    views.add(<View>new GanttView($('<ul class="boards-page-board-section-gantt" style="display:none"></ul>').appendTo(container)));
                    views.add(<View>new ReportView($('<ul class="boards-page-board-section-report" style="display:none"></ul>').appendTo(container)));


                    new CleverButton(org, 'main', views);

                }


                break;
            case PageLocation.BOARD:

                target = $('.board-header.u-clearfix.js-board-header');
                target.addClass('clever-inited');


                let container = $('.board-canvas');

                let boardname = location.pathname.split('/')[2];

                let views = new Views(new Resource(boardname, PageLocation.MAIN, ResourceType.BOARD));

                views.add(<View>new DefaultView(container.find('#board')));
                views.add(<View>new DiagramView($('<div id="diagram" style="display:none"></div>').appendTo(container)));
                views.add(<View>new GanttView($('<div id="gantt" style="display:none"></div>').appendTo(container)));
                views.add(<View>new ReportView($('<div id="report" style="display:none"></div>').appendTo(container)));


                new CleverButton(target, 'board', views);

                break;
            case PageLocation.CARD:

                target = $('.window-title');
                target.addClass('clever-inited');


                var desc = $('.description-content .js-card-desc a[href^="clever:"]');

                var card = new Card();

                card.shortLink = location.pathname.split('/')[2];
                card.clever = desc.length == 0 ? {} : JSON.parse(desc.attr('href').split('clever:')[1].split(':clever')[0]);

                var selectedStartDate = card.clever.startDate && card.clever.startDate != "null" ? Utils.DateFormat.parseTrello(card.clever.startDate) : null;

                var onSave = function(date: any) {

                    var strDate = Utils.DateFormat.stringifyTrello(date.year, date.month, date.day, date.hours, date.minutes);
                    this.card.clever.startDate = strDate;
                    selectedStartDate = date;

                    API.setCardClever(this.card.shortLink, { startDate: strDate }, function(e) {

                        //console.log(e);
                    });

                    PopOver.hide();

                    this.selected = date;
                    update(this.selected);
                    stlabel.css('display', 'block');
                };

                var onRemove = function() {

                    API.setCardClever(this.card.shortLink, { startDate: 'null' }, function(e) {

                        //console.log(e);
                    });

                    PopOver.hide();
                    this.selected = null;
                    stlabel.css('display', 'none');

                };




                var startDateButton = $('<a class="button-link js-add-start-date" href="#"><span class="icon-sm icon-clock"></span> Start Date</a>');

                startDateButton.click((e: Event) => {

                    e.preventDefault();


                    PopOver.show(startDateButton, new PopOverCalendar(card, selectedStartDate, onSave, onRemove), false);

                });

                $('a.button-link.js-add-due-date').before(startDateButton);




                var stlabel = $('<div class="card-detail-item js-card-detail-start-date">'
                    + '<h3 class="card-detail-item-header">Start Date</h3>'
                    + '<a class="card-detail-badge js-card-detail-start-date-badge is-start-now js-details-edit-start-date is-clickable" href="#">'
                    + 'dfg</a></div>');

                var aStLabel = stlabel.find('a');
                aStLabel.click(function() {

                    PopOver.show(stlabel, new PopOverCalendar(card, selectedStartDate, onSave, onRemove), false);
                });

                var update = function(date: any) {

                    aStLabel.removeClass('is-due-soon');
                    aStLabel.removeClass('is-due-now');
                    aStLabel.removeClass('is-due-past');

                    var dataObj = Utils.DateFormat.formatOutput(date);

                    if (dataObj.coming == 'soon')
                        aStLabel.addClass('is-due-soon');
                    else if (dataObj.coming == 'now')
                        aStLabel.addClass('is-due-now');
                    else if (dataObj.coming == 'past')
                        aStLabel.addClass('is-due-past');

                    aStLabel.text(dataObj.text);
                }


                if (selectedStartDate)
                    update(selectedStartDate);
                else
                    stlabel.css('display', 'none');

                $('div.card-detail-item.js-card-detail-due-date').before(stlabel);


                break;
        }
    }


    static init() {

        Clever.isAuth = localStorage.getItem("cleverAuth") == "true" ? true : false;

        Clever.auth();

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

            if (!request.url) return;

            let loc = Detector.location(request.url);


            if (Detector.loaded(loc) && !Detector.inited(loc))
                Clever.onPageLoaded(loc);
        });
    }

}


window.onload = Clever.init;
