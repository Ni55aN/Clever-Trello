/// <reference path="jquery.d.ts" />

interface IChartData {
    labels: string[];
    datasets: IChartDataSet[];
}

interface IChartDataSet {
    label: string;
    fill: any;
    strokeColor?: string;

    backgroundColor?: any;
    hoverBackgroundColor?: any;

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
    data: number[];
}


interface IChartConfig {
    type: string;
    data: IChartData;
    options: any;
}


declare class Chart {

    static defaults: any;
    config: any;
    constructor(ctx: JQuery, ops: IChartConfig);
    getElementsAtEvent(e: Event): any;
}
