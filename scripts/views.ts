/// <reference path="def/jquery.d.ts" />

enum ViewState {
    EMPTY, CREATING, READY
}

class Views {

    list: Array<View> = [];

    resource: Resource;

    constructor(resource: Resource) {

        this.resource = resource;
    }

    add(view: View) {

        view.parent = this;
        this.list.push(view);

    }

    choose(id: string) {

        for (let i = 0; i < this.list.length; i++) {

            let view: View = this.list[i];

            if (id == view.id) { if (!view.visible) view.show(); } else if (view.visible) view.hide();

        }

    }
}

abstract class View {

    id: string;
    container: JQuery;
    parent: Views;
    visible: boolean;
    private state: ViewState = ViewState.EMPTY;

    abstract onCreate(done: () => void): void;
    abstract onShow(): void;
    abstract onHide(): void;

    constructor(id: string, container: JQuery) {

        this.id = id;
        this.container = container;

        this.visible = this.container.css('display') != "none";
    }

    show() {

        this.visible = true;
        this.container.show();

        switch (this.state) {
            case ViewState.EMPTY:

                this.onCreate(() => {

                    this.onShow();
                    this.state = ViewState.READY;
                });

                this.state = ViewState.CREATING;

                break;
            case ViewState.CREATING: break;
            case ViewState.READY: this.onShow(); break;
        }

    }

    hide() {

        this.visible = false;
        this.container.hide();

        this.onHide();
    }
};

class DefaultView extends View {

    constructor(container: JQuery) {
        super("DEFAULT", container);
    }

    onCreate() {

    }

    onShow() {

        alert("DEFAULT");

    }

    onHide() { }
}
