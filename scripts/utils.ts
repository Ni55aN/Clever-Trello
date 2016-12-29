/// <reference path="def/jquery.d.ts" />


namespace Utils {

    export namespace DateFormat {

        export function parseTrello(str: string, datetype: boolean = false): Date | any {

            var found = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):/);

            var date = new Date(parseInt(found[1]), parseInt(found[2]) - 1, parseInt(found[3]), parseInt(found[4]), parseInt(found[5]) - new Date().getTimezoneOffset());

            if (datetype) return date;

            return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), hours: date.getHours(), minutes: date.getMinutes() };
        }

        export function parseInput(date: string, time: string) {

            var d = date.split('/');
            var t = time.split(':');

            return { year: parseInt(d[2]), month: parseInt(d[1]) - 1, day: parseInt(d[0]), hours: parseInt(t[0]), minutes: parseInt(t[1]) };
        }

        export function stringifyTrello(year: number, month: number, day: number, hours: number, minutes: number) {

            var date = new Date(year, month, day, hours, minutes + new Date().getTimezoneOffset());

            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':00.000Z';
        }

        export function stringifyInputDate(year: number, month: number, day: number) {

            return day + '/' + month + '/' + year;
        }

        export function stringifyInputTime(hours: number, minutes: number) {

            return hours + ':' + minutes;
        }

        export function formatOutput(date: any) {

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var coming = '';
            var text = '';


            var current: Date = new Date();
            var currentTime = current.getTime() / 1000;

            var currentMidNight = new Date(current.getFullYear(), current.getMonth(), current.getDate());
            var currentMidNightTime = currentMidNight.getTime() / 1000;

            var start = new Date(date.year, date.month, date.day, date.hours, date.minutes);
            var startTime = start.getTime() / 1000;


            if (startTime < currentTime - 32 * 60 * 60)
                coming = 'past';
            else if (startTime < currentTime)
                coming = 'now';
            else if (startTime < currentTime + 24 * 60 * 60)
                coming = 'soon';





            if (startTime < currentMidNightTime - 24 * 60 * 60 || startTime > currentMidNightTime + 2 * 24 * 60 * 60) {
                text += date.day + ' ' + months[start.getMonth()];

                if (current.getFullYear() != date.year) text += ' ' + date.year;
            }
            else if (startTime < currentMidNightTime)
                text += 'yesterday';
            else if (startTime < currentMidNightTime + 24 * 60 * 60)
                text += 'today';
            else
                text += 'tomorrow';


            text += ' at ' + date.hours + ':' + date.minutes;

            return { coming: coming, text: text };
        }

    }

    export function loadTemplate(path: string, callback: (elem: JQuery) => void, scope?: any): void {

        // runtime replace @{scope.var}

        function parse(data: string): JQuery {

            data = data.replace(/@{(.+?)}/g, (str: string, a: string) => { return eval(a); });

            return $(data);
        }

        var url = chrome.extension.getURL(path);

        $.get(url, function(data) {

            callback(parse(data));
        });

    }


    export function LightenColor(col: string, amt: number) {

        col = col.slice(1);


        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) {
            b = 255;
        } else if (b < 0) {
            b = 0;
        }
        var g = (num & 0x0000FF) + amt;
        if (g > 255) {
            g = 255;
        } else if (g < 0) {
            g = 0;
        }

        var c = (g | (b << 8) | (r << 16)).toString(16);
        if (c.length < 6) c = '0' + c;

        return "#" + c;
    }
}
