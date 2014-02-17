Ext.define('App.views.BaseComponents.Dialog.TreeDialog', {
    extend      : 'App.views.BaseComponents.Dialog.BaseDialog',
    alias       : 'widget.GridDialog',
    
    initComponent: function () {

        this.tree = Ext.create(this.treeItem, {
            border: false,
        });

        this.items = [ this.tree ];

        this.tree.on("itemSelect",   this._onItemSelect,    this);
        this.tree.on("itemDeselect", this._onItemDeselect,  this);

        this.callParent();
    },

    setParent: function (id, name) {
        this.parentID = id;
        this.parentIdName = name;
        this.tree.setParent(this.parentIdName, this.parentID)
    },

    reload: function () {
        this.tree.reload();
    },

    _updateButton: function (record) {
        if (record.get('isCategory') != true) {
            this.addButton.setDisabled(false);
        } else {
            this.addButton.setDisabled(true);
        }
    },

    _onItemSelect: function (record) {
        this._updateButton(record);
        this.record = record;
    },

    _onItemDeselect: function (record) {
        this._updateButton(record);
        this.record = record;
    }
});