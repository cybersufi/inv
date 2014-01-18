Ext.define('App.views.Components.Dashboard.ContentPanel', {
    extend              : 'Ext.panel.Panel',
    require             :   [
                                'App.models.DashboardItem',
                                'App.stores.DashboardItemStore',
                            ], 
	alias               : 'widget.ContentPanel',
    layout              : 'fit',

	itemstore           : null,
    model               : 'App.models.ServerGroup',

    buttonTextMode      : 'hide',
    
    editorDialog        : null,

    deleteButtonText    : "Delete Item",
    deleteButtonIcon    : App.getResource('resources/silkicons/delete.png'),    

    editButtonText      : "Edit Item",
    editButtonIcon      : App.getResource('resources/silkicons/add.png'),
	
	initComponent: function () {

        this.addEvents(
            'itemOpen'
        );

        this.itemstore = Ext.create('App.stores.ServerGroupStore', {});
        this.itemstore.proxy.limitParam = null;

        this.viewpanel = Ext.create('App.views.Components.Dashboard.DashboardDataView', {
            store: this.itemstore,
            model: this.model,
            border: false,
        });

        this.viewpanel.on('itemClick', this.onItemClick, this);

        this.items = this.viewpanel;

        this.menu = this.createMenu();

        this.callParent();
	},

    setFlag: function(flag) {
        this.viewpanel.setFlag(flag);
    },

    createMenu: function() {
        this.itemMenuOpen = Ext.create("Ext.menu.Item", {
            text: "View Members",
            handler: Ext.bind(this.onItemOpen, this),
            icon: App.getResource('resources/silkicons/folder_explore.png'),
        });

        this.itemMenuDelete = Ext.create("Ext.menu.Item", {
            text: "Delete Item",
            handler: Ext.bind(this.onItemDelete, this),
            icon: App.getResource('resources/silkicons/delete.png'),
        });
        
        this.itemMenuEdit = Ext.create("Ext.menu.Item", {
            text: "Edit Item",
            handler: Ext.bind(this.onItemEdit, this),
            icon: App.getResource('resources/fugue-icons/icons/property.png')
        });
        
        var menu = Ext.create('widget.menu', {
            items: [
                this.itemMenuOpen,
                this.itemMenuEdit,
                this.itemMenuDelete
            ]
        });

        return menu;
    },

    createDialog: function(dialogmode) {
        if (this.editorDialog != null) {
            this.editorDialog.close();
            this.editorDialog = null;
        }

        this.editorDialog = Ext.create('App.views.Components.Dashboard.ItemEditorWindow', {
            mode: dialogmode,
            modal: true,
        });

        this.editorDialog.on('itemSaved',    Ext.bind(this.onItemSaved,  this));
    },

    onItemClick: function(view, record, xy, object) {
        var menu = this.menu;
        menu.showAt(xy);
        this.rec = record;
    },

    addItem: function() {
        this.createDialog('create');
        var def = null;
        Ext.apply(def, {});
        record = Ext.create(this.model, def);
        this.editorDialog.addDefault(def);
        this.editorDialog.editItem(record);
        this.editorDialog.show();  
    },

    onItemOpen: function() {
        var rec = this.viewpanel.getSelected();
        this.fireEvent('itemOpen', rec);
    },

    onItemSaved: function() {
        this.viewpanel.reload();
    },

    onItemDelete: function() {
        var r = this.viewpanel.getSelected();
        var recordName;
        
        if (r.getRecordName) {
            recordName = r.getRecordName();
        } else {
            recordName = r.get("groupname");
        }

        Ext.Msg.confirm(
            "Confirm Item Delete", 
            sprintf("Do you really wish to delete selected item: '%s'?", recordName), 
            function (but) {
                if (but == "yes") {
                    r.destroy();
                    this.itemstore.load();
                    this.fireEvent("itemDeleted");
                }
            }, 
            this
        );
    },

    onItemEdit: function() {
        var rec = this.viewpanel.getSelected();
        if (rec) {
            this.createDialog('edit');
            this.editorDialog.editItem(rec);
            this.editorDialog.show();
        }
    },
});