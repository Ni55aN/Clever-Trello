class Detector {


    static location(url: string): PageLocation {

        if (url == "https://trello.com/")
            return PageLocation.MAIN;
        else if (url.indexOf("https://trello.com/b/") === 0)
            return PageLocation.BOARD;
        else if (url.indexOf("https://trello.com/c/") === 0)
            return PageLocation.CARD;

        return PageLocation.NONE;
    }

    static loaded(loc: PageLocation): boolean {

        switch (loc) {

            case PageLocation.MAIN: return $(".boards-page-board-section").length > 0;
            case PageLocation.BOARD: return $(".board-header.u-clearfix.js-board-header").length > 0;
            case PageLocation.CARD: return $(".window-title").length > 0;
            default: return null;
        }
    }

    static inited(loc: PageLocation): boolean {

        switch (loc) {

            case PageLocation.MAIN: return $(".boards-page-board-section-header .boards-page-board-section-header-options.clever-inited").length > 0;
            case PageLocation.BOARD: return $(".board-header.u-clearfix.js-board-header.clever-inited").length > 0;
            case PageLocation.CARD: return $(".window-title.clever-inited").length > 0;
            default: return null;
        }

    }

}
