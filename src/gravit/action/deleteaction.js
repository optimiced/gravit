(function (_) {

    /**
     * Action for deleting the selection from the current document
     * @class EXDeleteAction
     * @extends GUIAction
     * @constructor
     */
    function EXDeleteAction() {
    };
    IFObject.inherit(EXDeleteAction, GUIAction);

    EXDeleteAction.ID = 'edit.delete';
    EXDeleteAction.TITLE = new IFLocale.Key(EXDeleteAction, "title");

    /**
     * @override
     */
    EXDeleteAction.prototype.getId = function () {
        return EXDeleteAction.ID;
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.getTitle = function () {
        return EXDeleteAction.TITLE;
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.getCategory = function () {
        return EXApplication.CATEGORY_EDIT;
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.getGroup = function () {
        return "ccp";
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.getShortcut = function () {
        return [IFKey.Constant.REMOVE];
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.isEnabled = function () {
        var document = gApp.getActiveDocument();
        return document && !!document.getEditor().getSelection();
    };

    /**
     * @override
     */
    EXDeleteAction.prototype.execute = function () {
        var editor = gApp.getActiveDocument().getEditor();
        editor.deleteSelection();
    };

    /** @override */
    EXDeleteAction.prototype.toString = function () {
        return "[Object EXDeleteAction]";
    };

    _.EXDeleteAction = EXDeleteAction;
})(this);