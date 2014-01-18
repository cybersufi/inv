Ext.define('App.views.Components.Dashboard.ContentPanel', {
    extend              : 'Ext.panel.Panel',
    require             :   [
                                'App.models.DashboardItem',
                                'App.stores.DashboardItemStore',
                                'Ext.toolbar.TextItem',
                                'Ext.view.View',
                                'Ext.ux.DataView.Animated',
                            ], 
	alias               : 'widget.ContentPanel',
    layout              : 'fit',

	itemstore           : null,
    model               : 'App.models.ServerGroup',

    buttonTextMode      : 'hide',
    
    itemStore           : null,
    editorDialog        : null,

    addButtonText       : "Add Item",
    addButtonIcon       : App.getResource('resources/silkicons/add.png'),

    deleteButtonText    : "Delete Item",
    deleteButtonIcon    : App.getResource('resources/silkicons/delete.png'),    

    editButtonText      : "Edit Item",
    editButtonIcon      : App.getResource('resources/silkicons/add.png'),
	
	initComponent: function () {

        this.itemstore = Ext.create('App.stores.ServerGroupStore', {});
        this.itemstore.on('update', this.onStoreLoad, this);

        this.topbar = this.createTopBar();

        this.tbar = this.topbar;

        this.viewPanel = this.createViewPanel();

        this.items = this.viewPanel;

        this.createMenu();

        this.callParent();

        this.changeButton(null);
	},

    setFlag: function(flag) {
        if (this.itemstore != null ) {
            this.itemstore.getProxy().extraParams['flag'] = flag;
            this.reload();
        } else {
            alert('no store');
        }
    },

    reload: function() {
        this.setLoading();
        this.itemstore.load({
            scope: this,
            callback: this.onStoreLoad
        })
    },

    onStoreLoad: function(records, operation, success) {
        this.setLoading(false);
        this.updateStoreSorters();
    },

    createViewPanel: function() {
        var template = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="dataview-multisort-item" /*{[this.switchClass(values.status)]}"*/>',
                    '<div class="{[this.switchClass(values.status)]}">',
                        '<p><h1>{groupname}</h1></p>',
                        '<p><span>Overal Status: <c>{[this.switchValue(values.status)]}</c></span></p>',
                    '</div>',
                '</div>',
            '</tpl>',{
                switchClass: function(value) {
                    var cls = "";
                    switch(value) {
                        case 1      : cls = 'green'; break;
                        case 2      : cls = 'yellow'; break;
                        case 3      : cls = 'red'; break;
                        default     : cls = 'netral';
                    }
                    return cls;
                },

                switchValue: function(value) {
                    var text = '';
                    switch(value) {
                        case 1      : text = 'Good'; break;
                        case 2      : text = 'Warning'; break;
                        case 3      : text = 'Alert'; break;
                        default     : text = 'N/A';
                    }
                    return text;
                },
            }
        );

        var viewpanel = Ext.create('Ext.view.View', {
            id: 'viewpanel',
            trackOver: true,
            overItemCls: 'dataview-multisort-item-select',
            itemSelector: 'div.dataview-multisort-item',
            selectedItemCls: 'x-item-selected',
            tpl: template,
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            },
            autoScroll: true,
            plugins: Ext.create('Ext.ux.DataView.Animated',{}),
            store: this.itemstore,
        })

        viewpanel.on('itemclick',   this.onItemClick, this);

        return viewpanel;
    },

    changeButton: function(selection) {
        var stat = (count(selection) >= 1) ? false : true;
    },

    onItemClick: function(view, record, item, index, event, object) {
        var menu = this.menu;
        event.stopEvent();
        menu.showAt(event.getXY());
        this.rec = record;
    },

    onSelectionChange: function(dv, nodes){
        this.changeButton(nodes);
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
        
        this.menu = Ext.create('widget.menu', {
            items: [
                this.itemMenuOpen,
                this.itemMenuEdit,
                this.itemMenuDelete
            ]
        });
    },

    createTopBar: function () {
        this.searchField = Ext.create("Ext.ux.SearchField",{
            store: this.itemstore,
            reorderable: false,
        });

        this.sortNameButton = Ext.create("App.views.BaseComponents.Button.MultiSortButton", {
            text : 'Name',
            dataIndex: 'groupname',
            listeners: {
                scope: this,
                changeDirection: this.updateStoreSorters
            }
        });

        this.sortStatusButton = Ext.create("App.views.BaseComponents.Button.MultiSortButton", {
            text : 'Status',
            dataIndex: 'status',
            listeners: {
                scope: this,
                changeDirection: this.updateStoreSorters
            }
        });

        var topbar = Ext.create("Ext.toolbar.Toolbar",{
            dock: 'top',
            enableOverflow: true,

            plugins: Ext.create('Ext.ux.BoxReorderer', {
                listeners: {
                    scope: this,
                    drop: this.updateStoreSorters
                }
            }),

            items: [
                Ext.create('Ext.toolbar.TextItem', {
                    text: 'Sort on these fields:',
                    reorderable: false
                }),
                this.sortStatusButton, this.sortNameButton,
                { xtype: 'tbfill' }, '-',
                this.searchField
            ]
        });

        return topbar;
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

    onItemOpen: function() {
        return null;
    },

    onItemAdd: function() {
        this.createDialog('create');
        var def = null;
        Ext.apply(def, {});
        record = Ext.create(this.model, def);
        this.editorDialog.addDefault(def);
        this.editorDialog.editItem(record);
        this.editorDialog.show();  
    },

    onItemSaved: function() {
        this.reload();
    },

    onItemDelete: function() {
        var r = this.viewPanel.getSelectionModel().getLastSelected();
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
        var rec = this.viewPanel.getSelectionModel().getLastSelected();
        var node = this.viewPanel.getSelectedNodes()[0];
        if (rec) {
            this.createDialog('edit');
            this.editorDialog.editItem(rec);
            this.editorDialog.show();

            
            //this.fireEvent("editItem", rec.get("id"));
        }
    },
  
    getSorters: function() {
        var buttons = this.topbar.query('button-multisort-sortbutton'),
            sorters = [];
        Ext.Array.each(buttons, function(button) {
            sorters.push({
                property : button.getDataIndex(),
                direction: button.getDirection()
            });
        });
        
        return sorters;
    },

    updateStoreSorters: function() {
        var sorters = this.getSorters();
        this.itemstore.sort(sorters);
    }
});