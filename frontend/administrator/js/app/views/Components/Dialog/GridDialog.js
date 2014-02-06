Ext.define('App.views.Components.Dialog.GridDialog', {
    extend      : 'App.views.Components.Dialog.BaseDialog',
    alias       : 'widget.GridDialog',

    initComponent: function () {

        this.grid = Ext.create(this.gridItem, {
            enableButton: false,
            store: this.store,
            border: false,
        });

        this.items = [ this.grid ];

        this.grid.on("itemSelect",      this._onItemSelect,     this);
        this.grid.on("itemDeselect",    this._onItemDeselect,   this);
        this.grid.on('itemEdit',        this._onItemEdit,       this);

        this.callParent();
    },

    setParent: function (id, name) {
        this.parentID = id;
        this.parentIdName = name;
        this.grid.getStore().getProxy().extraParams[this.parentIdName] = this.parentID;
        this.reload();
    },

    reload: function () {
        this.store.load();
    },

    _onItemEdit: function(id) {
        this.itemId = id;
    },

    _updateButton: function (record) {
        if (record != null) {
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