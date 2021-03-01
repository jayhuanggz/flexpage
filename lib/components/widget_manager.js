/**
 * Manage all widgets in a page, maintain a tree structure。
 */
class Manager {
    constructor() {
        this.widgets = {};
        this.roots = [];
    }

    addWidget(id, widget) {
        if (Object.prototype.hasOwnProperty.call(this.widgets, id)) {
            throw new Error("Widget :" + id + " is already added!");
        }
        let newEntry = {
            widget: widget,
            children: []
        };
        this.widgets[id] = newEntry

        let parent = widget.fpParent;
        if (typeof parent === 'object') {
            parent = this.widgets[parent.id];
            if (typeof parent !== 'undefined') {
                parent.children.push(newEntry);
            }
        } else {
            this.roots.push(newEntry);
        }



    }

    findWidget(id) {
        let widget = this.widgets[id];
        return typeof widget === 'undefined' ? undefined : widget.widget;
    }

    removeWidget(id) {
        delete this.widgets[id]
    }

    traverse(cb, widgetIdToStart) {

        if (typeof widgetIdToStart !== 'undefined') {

            let widget = this.widgets[widgetIdToStart];
            if (typeof widget === 'undefined') {
                throw new Error('widget not found: ' + widgetIdToStart);
            }
            this._traverse(widget, cb);
        } else {
            this._traverse(this.roots, cb);
        }

    }

    _traverse(widgets, cb) {
        let self = this;
        if (Array.isArray(widgets)) {
            widgets.forEach(w => {
                cb(w.widget);
                if (w.children.length > 0) {
                    self._traverse(w.children, cb);
                }
            });
        } else {
            cb(widgets.widget);
            if (widgets.children.length > 0) {
                self._traverse(widgets.children, cb);
            }
        }

    }
}



export default Manager;