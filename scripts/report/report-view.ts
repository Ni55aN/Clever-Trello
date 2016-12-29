/// <reference path="../views.ts" />
/// <reference path="../def/Chart.d.ts" />


class ChartData {

    labels: string[];
    datasets: IChartDataSet[];

    constructor() {
        this.labels = [];
        this.datasets = [new ChartDataSet()];
    }
}

class ChartDataSet {
    label: string;
    fill: any;
    strokeColor?: string;

    backgroundColor?: any[] = [];
    hoverBackgroundColor?: any[] = [];

    borderColor?: string;
    pointBorderColor?: string;
    pointBackgroundColor?: string;
    pointBorderWidth?: number;
    pointHoverRadius?: number;

    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    pointHoverBorderWidth?: number;
    highlightFill?: string;
    highlightStroke?: string;
    data: number[] = [];
}

class ChartConfig {
    type: string;
    data: ChartData;
    options: any;

    constructor(type: string, data: ChartData, options: any) {

        this.type = type;
        this.data = data;
        this.options = options;
    }
}

class ReportView extends View {


    constructor(container: JQuery) {
        super("REPORT", container);

    }

    ChartFontColor = "white";
    ChartGridColor = "rgba(255,255,255,0.7)";



    initLabelsCharts(cards: Array<Card>, labels: Array<Label>) {


        var options = {
            scales: {
                xAxes: [{
                    gridLines: { color: this.ChartGridColor },
                    ticks: {
                        fontColor: this.ChartFontColor
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: this.ChartFontColor
                    },
                    gridLines: { color: this.ChartGridColor }
                }]
            }
        };

        var chartLabelData = new ChartData();

        for (var i in labels) {


            var useCount = 0;
            for (var j in cards)
                if (cards[j].idLabels.indexOf(labels[i].id) !== -1) useCount++;


            if (labels[i].name == "" && useCount == 0) continue;

            chartLabelData.labels.push(labels[i].name);
            chartLabelData.datasets[0].data.push(useCount);

            var color = labels[i].color;

            if (color == "sky") color = "blue";

            chartLabelData.datasets[0].backgroundColor.push(color);
            chartLabelData.datasets[0].hoverBackgroundColor.push(color);
        }

        var config = new ChartConfig('bar', chartLabelData, options);

        var labelChart = new Chart(this.container.find('#labelsChart'), config);

    }

    initListsChart(cards: Array<Card>, lists: Array<List>) {


        var chartListData = new ChartData();

        for (var i in lists) {
            chartListData.labels.push(lists[i].name);

            var cardCount = 0;
            for (var j in cards)
                if (cards[j].idList == lists[i].id)
                    cardCount++;

            chartListData.datasets[0].data.push(cardCount);


            var lK = Math.floor(Math.random() * (45 + 1));;
            var color = Utils.LightenColor('#a2a4a6', lK);

            chartListData.datasets[0].backgroundColor.push(color);
            chartListData.datasets[0].hoverBackgroundColor.push(Utils.LightenColor(color, 10));
        }
        var config = new ChartConfig('pie', chartListData, {});

        var boardChart = new Chart(this.container.find('#boardChart'), config);
    }

    initBoardsChart(cards: Array<Card>, boards: Array<Board>) {

        var boardChart: Chart;


        var chartBoardData = new ChartData();


        for (var i in boards) {

            chartBoardData.labels.push(boards[i].name);

            var cardCount = 0;
            for (var j in cards)
                if (cards[j].idBoard == boards[i].id)
                    cardCount++;

            chartBoardData.datasets[0].data.push(cardCount);

            var color = boards[i].prefs.backgroundColor;
            var lighten: string;

            if (color != null) {
                if (color == "sky") color = "blue";
                lighten = Utils.LightenColor(color, 15);

                chartBoardData.datasets[0].backgroundColor.push(color);
                chartBoardData.datasets[0].hoverBackgroundColor.push(lighten);
            }
        }
        var config = new ChartConfig('pie', chartBoardData, {});

        boardChart = new Chart(this.container.find('#boardChart'), config);

        boards.forEach((item: any, i: number) => {

            var color = boards[<number>i].prefs.backgroundColor;

            if (color == null) ((num: number) => {

                var src = boards[num].prefs.backgroundImageScaled ? boards[num].prefs.backgroundImageScaled[2].url : boards[num].prefs.backgroundImage;

                var img = new Image();
                img.onload = () => {

                    boardChart.config.data.datasets[0].hoverBackgroundColor[num] = boardChart.config.data.datasets[0].backgroundColor[num] = document.createElement('canvas').getContext('2d').createPattern(img, 'repeat');
                }
                img.src = src;
            })(i);
        });

    }

    initActionsChart(actions: Array<Action>) {

        var options = {
            scales: {
                xAxes: [{
                    gridLines: { color: this.ChartGridColor },
                    ticks: {
                        fontColor: this.ChartFontColor
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: this.ChartFontColor
                    },
                    gridLines: { color: this.ChartGridColor }
                }]
            }
        };


        var lineData = new ChartData();
        lineData.datasets[0].label = "All actions ";
        lineData.datasets[0].fill = true;
        lineData.datasets[0].backgroundColor = "rgba(220,220,220,0.2)";
        lineData.datasets[0].borderColor = "rgba(220,220,220,1)";
        lineData.datasets[0].pointBorderColor = "rgba(220,220,220,1)";
        lineData.datasets[0].pointBackgroundColor = "#fff";
        lineData.datasets[0].pointBorderWidth = 2;
        lineData.datasets[0].pointHoverRadius = 7;
        lineData.datasets[0].pointHoverBackgroundColor = "rgba(220,220,220,1)";
        lineData.datasets[0].pointHoverBorderColor = "rgba(220,220,220,1)";
        lineData.datasets[0].pointHoverBorderWidth = 2
        lineData.datasets[0].data = [];

        var selectedYear: number = new Date().getFullYear();
        var selectedMonth: number = null;
        var selectedMode: string = 'year';

        var title = this.container.find('#title');
        title.click(function(e) { if (selectedMode == 'month') { selectedMode = 'year'; initYear(); } });

        var prev = this.container.find('#prev');
        prev.click(function(e) { if (selectedMode == 'year') { selectedYear--; initYear(); } else { selectedMonth--; initMonth(); } });

        var next = this.container.find('#next');
        next.click(function(e) { if (selectedMode == 'year') { selectedYear++; initYear(); } else { selectedMonth++; initMonth(); } });

        var actionsChart: Chart;

        var initYear = () => {

            selectedMode = 'year';
            title.text(selectedYear);

            lineData.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            lineData.labels = Assets.months;
            for (var i in actions) {
                if (parseInt(actions[i].date.split('-')[0]) !== selectedYear) continue;

                var monthIndex = parseInt(actions[i].date.split('-')[1]) - 1;

                lineData.datasets[0].data[monthIndex]++;
            }


            var config = new ChartConfig('line', lineData, options);

            actionsChart = new Chart(this.container.find('#actionsChart'), config);

        }


        var initMonth = () => {

            selectedMode = 'month';
            title.text(Assets.months[selectedMonth]);

            lineData.labels = [];

            for (var i = 0, days = new Date(selectedYear, selectedMonth + 1, 0).getDate(); i < days; i++) {

                lineData.labels[i] = String(i) + 1;
                lineData.datasets[0].data[i] = 0;
            }

            for (var i = 0; i < actions.length; i++) {

                if (parseInt(actions[i].date.split('-')[0]) !== selectedYear || parseInt(actions[i].date.split('-')[1]) - 1 !== selectedMonth) continue;

                var dayIndex = parseInt(actions[i].date.split('-')[2]) - 1;


                lineData.datasets[0].data[dayIndex]++;
            }

            var config = new ChartConfig('line', lineData, options);

            actionsChart = new Chart(this.container.find('#actionsChart'), config);

        }

        this.container.find('#actionsChart').click(function(evt: Event) {

            var activePoints = actionsChart.getElementsAtEvent(evt);

            if (activePoints.length == 0 || selectedMode != 'year') return;

            selectedMonth = activePoints[0]._index;
            initMonth();

        });



        initYear();
    }



    onCreate(done: () => void) {

        var res = this.parent.resource;

        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.responsive = true;



        if (res.type == ResourceType.ORG) {
            this.ChartFontColor = "gray";
            this.ChartGridColor = "rgba(50,50,50,0.5)";
        }

        Utils.loadTemplate('views/load.html', (el: JQuery) => {
            this.container.empty().append(el);
        });



        switch (res.type) {
            case ResourceType.BOARD:

                API.getBoardCards(res.id, (cards) => {

                    API.getBoardLists(res.id, (lists) => {

                        API.getBoardLabels(res.id, (labels) => {

                            API.getBoardActions(res.id, (actions) => {

                                //    console.log('cards:', cards);
                                //    console.log('labels:', labels, 'actions:', actions);

                                Utils.loadTemplate('views/report.html', (el: JQuery) => {
                                    this.container.empty().append(el);
                                    this.initListsChart(cards, lists);
                                    this.initLabelsCharts(cards, labels);
                                    this.initActionsChart(actions);
                                });

                            });
                        });
                    });
                });

                break;
            case ResourceType.ORG:


                API.getOrgCards(res.id, (cards, boards) => {
                    API.getBoardsLabels(boards, (labels) => {
                        API.getBoardsActions(boards, (actions) => {

                            //  console.log('cards:', cards, 'boards:', boards);
                            //  console.log('labels:', labels, 'actions:', actions);
                            Utils.loadTemplate('views/report.html', (el: JQuery) => {
                                this.container.empty().append(el);
                                this.initBoardsChart(cards, boards);
                                this.initLabelsCharts(cards, labels);
                                this.initActionsChart(actions);
                            });

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
