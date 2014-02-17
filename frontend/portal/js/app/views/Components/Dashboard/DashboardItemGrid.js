
Ext.define('App.views.Components.Dashboard.DashboardItemGrid', {
    extend                      : 'App.views.BaseComponents.Editor.EditorGrid',
    alias                       : 'widget.DashboardItemGrid',
    stripeRows                  : true,
    autoScroll                  : false,
    invalidateScrollerOnRefresh : true,

    
    buttonTextMode              : 'show',
    
    /*addButtonText               : "Add Module",
    addButtonIcon               : App.getResource('resources/silkicons/brick_add.png'),
    deleteButtonText            : "Delete Module",
    deleteButtonIcon            : App.getResource('resources/silkicons/brick_delete.png'),
    moveButtonText              : "Move Module to",
    moveButtonIcon              : App.getResource('resources/silkicons/brick_delete.png'),

    
    expandRowButtonIcon         : App.getResource('resources/icons/group-expand.png'),
    collapseRowButtonIcon       : App.getResource('resources/icons/group-collapse.png'),
    
    deleteMessage               : "Do you really wish to delete the Module '%s'?",
    deleteTitle                 : "Delete Module",*/
    model                       : 'App.models.DashboardGridItem',

    initComponent: function () {

        this.store = Ext.create('App.stores.DashboardGridItemStore', {});
        this.store.proxy.limitParam = null;

        this.groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: '{name} ({rows.length} ' + "Server(s)"+")"
        });

        this.defineColumns();
        
        this.features = [this.groupingFeature];
        
        /*this.on("itemdblclick", this.onDoubleClick, this);
        
        this.addEvents("editLink");*/
        
        this.on('scrollershow', function(scroller) {
            if (scroller && scroller.scrollEl) {
                scroller.clearManagedListeners(); 
                scroller.mon(scroller.scrollEl, 'scroll', scroller.onElScroll, scroller); 
            }
        });
        
        /*this.on('itemAdd',      this.onItemAdd,         this);
        this.on('itemDelete',   this.onItemDelete,      this);
        this.on('itemSelect',   this.onItemSelect,      this);
        this.on('itemDeselect', this.onItemDeselect,    this);*/

        this.callParent();

        /*if (this.enableButton) {

            this.moveButton = Ext.create("Ext.button.Button", {
                text: (this.moveButtonText !== "hide") ? this.moveButtonText : '',
                tooltip: this.moveButtonText,
                icon: this.moveButtonIcon,
                handler: Ext.bind(this.onMoveButtonClick, this),
                disabled: true
            });
            
            this.topToolbar.insert(2, this.moveButton);
        }*/

        /*this.bottomToolbar.add({
            xtype: 'button',
            tooltip: "Expand all Groups",
            icon: this.expandRowButtonIcon,
            listeners: {
                scope: this.groupingFeature,
                click: this.groupingFeature.expandAll   
            }
            
        });
        
        this.bottomToolbar.add({
            xtype: 'button',
            tooltip: "Collapse all Groups",
            icon: this.collapseRowButtonIcon,
            listeners: {
                scope: this.groupingFeature,
                click: this.groupingFeature.collapseAll 
            }
        });*/
        
    },

    updateButton: function (record) {
        if (this.enableButton) {
            if (record != null) {
                this.moveButton.enable();
            } else {
                this.moveButton.disable();
            }
        }
    },

    onItemSelect: function (record) {
        this.updateButton(record);
    },

    onItemDeselect: function (record) {
        this.updateButton(null);
    },

    onMoveButtonClick: function () {
        if (this.moveDialog == null) {
            this.moveDialog = Ext.create('App.views.Components.Category.CategoryListWindow');
            this.moveDialog.on('itemAdd',       Ext.bind(this.onItemMove,   this));
            this.moveDialog.on('itemCancel',    Ext.bind(function() {
                this.moveDialog.destroy();
                this.moveDialog = null;
            },  this));
        }
        this.moveDialog.show();
    },

    onItemMove: function(id) {
        var r = this.getSelectionModel().getLastSelected();
        r.set('category', id);
        r.save({
            callback: this._onSave,
            scope: this
        });
    },

    _onSave: function (record, response) {
        if (response.success === true) {
            this.getStore().load();
            this._clearDialog();
        }
    },

    _clearDialog: function() {
        this.moveDialog = null;
        this.addDialog = null;
    },

    createAddDialog: function(mode) {
        this.addDialog = null;
        this.addDialog = Ext.create("App.views.Components.Module.ModuleEditorWindow", {
            mode: mode
        });
        this.on('linkSaved',    Ext.bind(this.onItemSaved,  this));
    },

    onItemAdd: function () {
        this.createAddDialog('create');
        var defaults = null;
        Ext.apply(defaults, {});
        record = Ext.create("App.models.Module", defaults);
        this.addDialog.editor.ModuleDefaults = defaults;
        this.addDialog.editor.editItem(record);
        this.addDialog.show();
    },

    onItemSaved: function() {
        this.getStore().load();
    },

    onDoubleClick: function (view, record) {
        if (record) {
            this.createAddDialog('create');
            //this.addDialog.editor.on("partSaved", this.onPartSaved, this);
            this.addDialog.editor.editItem(record);
            this.addDialog.show();
            
            this.fireEvent("editLink", record.get("id"));
        }
    },

    onItemDelete: function() {
        var r = this.getSelectionModel().getLastSelected();
        var recordName;
        
        if (r.getRecordName) {
            recordName = r.getRecordName();
        } else {
            recordName = r.get("name");
        }
        
        Ext.Msg.confirm(
            this.deleteTitle,
            sprintf(this.deleteMessage, recordName),
            function (but) {
                if (but == "yes") {
                    this._deleteRecord(r);
                }
            },this
        );
    },

    _deleteRecord: function (r) {
        r.destroy();
        this.getStore().load();
        this.fireEvent("itemDeleted");
    },

    setCategory: function (categoryid) {
        this.getStore().getProxy().extraParams['category'] = categoryid;
        this.getStore().load();
    },

    defineColumns: function () {
        this.columns = [{
            header: "Server Name",
            dataIndex: 'servername',
            flex: 1,
            minWidth: 200,
            renderer: Ext.util.Format.htmlEncode
        }, {
            header: "Ping Time",
            dataIndex: 'pingtime',
            flex: 1,
        }, {
            header: "Status",
            dataIndex: 'status',
            flex: 1,
        }];
    },
});