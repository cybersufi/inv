Ext.define('App.views.Components.Dialog.BaseDialog', {
	extend              : 'Ext.window.Window',
    alias               : 'widget.BaseDialog',
    layout              : 'fit',
    
    store               : null,
    model               : null,
    itemClass           : null,
    cancelButton        : null,
    cancelButtonText    : 'Cancel',
    addButton           : null,
    addButtonText       : 'Add Item',
    record              : null,
    itemId              : null,
    parentName          : null,
    parentID            : null, 

    initComponent: function () {

    	this.addEvents("itemAdd");

    	this.cancelButton = Ext.create("Ext.button.Button", {
            text: this.cancelButtonText,
            tooltip: this.cancelButtonText,
            icon: App.getResource('resources/silkicons/cancel.png'),
            handler: Ext.bind(function () {
                this.fireEvent("itemCancel");
                this.close();
            }, this),
        });
        
        this.addButton = Ext.create("Ext.button.Button", {
            text: this.addButtonText,
            tooltip: this.addButtonText,
            icon: App.getResource('resources/fugue-icons/icons/disk.png'),
            handler: this.onAddButtonClick,
            scope: this,
            disabled: true,
        });

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            defaults: {minWidth: 80},
            layout: {
                pack: 'center'
            },
            items: [ this.addButton, this.cancelButton ]
        }];

        this.callParent();
    },

    createStore: function (config) {
        Ext.Object.merge(config, {
            autoLoad: true,
            model: this.model,
            autoSync: false,
            remoteFilter: true,
            remoteSort: true,
            pageSize: 15
        });

        this.store = Ext.create('Ext.data.Store', config);
    },

    onAddButtonClick: function() {
        this.fireEvent("itemAdd", this.record.get('id'));
        this.close();
    },
});