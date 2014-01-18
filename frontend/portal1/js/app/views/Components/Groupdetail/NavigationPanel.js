Ext.define('App.views.Components.Groupdetail.NavigationPanel', {
	requires            :   [
                        	   'App.models.GroupdetailNavFeed'
                            ],

    extend              : 'App.views.BaseComponents.Panel.NavigationPanel',
    alias               : 'widget.GroupdetailNavigationPanel',

    model               : 'App.models.GroupdetailNavFeed',

    addButtonText       : "Add Item",
    addButtonIcon       : App.getResource('resources/silkicons/server_add.png'),

    editButtonText      : "Edit Item",
    editButtonIcon      : App.getResource('resources/silkicons/server_edit.png'),

    deleteButtonText    : "Delete Item",
    deleteButtonIcon    : App.getResource('resources/silkicons/server_delete.png'),

    refreshButtonText   : "Refresh List",
    refreshButtonIcon   : App.getResource('resources/silkicons/arrow_refresh.png'),

    initComponent: function () {
        this.addEvents(
            'itemAdd',
            'itemDelete',
            'itemEdit'
        );

    	this.model = 'App.models.GroupdetailNavFeed';

        this.store = this.createStore({
            id: 'groupnav-store',
            model: this.model,
            proxy: App.getAjaxProxy("groupdetail/navigation"),
        });

        this.addButton = Ext.create("Ext.button.Button", {
            text: (this.buttonTextMode !== "hide") ? this.addButtonText : '',
            tooltip: this.addButtonText,
            icon: this.addButtonIcon,
            handler: Ext.bind(this.onItemAdd, this)
        });

        this.editButton = Ext.create("Ext.button.Button", {
            text: (this.buttonTextMode !== "hide") ? this.editButtonText : '',
            tooltip: this.editButtonText,
            icon: this.editButtonIcon,
            handler: Ext.bind(this.onItemEdit, this)
        });

        this.deleteButton = Ext.create("Ext.button.Button", {
            text: (this.buttonTextMode !== "hide") ? this.deleteButtonText : '',
            tooltip: this.deleteButtonText,
            icon: this.deleteButtonIcon,
            handler: Ext.bind(this.onItemDelete, this)
        });

    	this.callParent();

        this.getTopbar().insert(0, this.addButton);
        this.getTopbar().insert(1, this.editButton);
        this.getTopbar().insert(2, this.deleteButton);
    },

    onItemAdd: function() {
        this.fireEvent('itemAdd');
    },

    onItemEdit: function() {
        this.fireEvent('itemEdit');
    },

    onItemDelete: function() {
        this.fireEvent('itemDelete');
    },

    onViewReady: function(){
        this.view.getSelectionModel().select(this.view.store.first());
    },

});