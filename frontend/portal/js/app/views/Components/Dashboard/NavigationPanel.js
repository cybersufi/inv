Ext.define('App.views.Components.Dashboard.NavigationPanel', {
	requires            :   [
                        	   'App.models.MainNavFeed'
                            ],

    extend              : 'App.views.BaseComponents.Panel.NavigationPanel',
    alias               : 'widget.DashboardNavigationPanel',

    model               : 'App.models.MainNavFeed',

    addButtonText       : "Add Item",
    addButtonIcon       : App.getResource('resources/silkicons/add.png'),

    refreshButtonText   : "Refresh List",
    refreshButtonIcon   : App.getResource('resources/silkicons/arrow_refresh.png'),

    initComponent: function () {
        this.addEvents(
            'itemAdd'
        );

    	this.model = 'App.models.MainNavFeed';

        this.store = this.createStore({
            id: 'navigation-store',
            model: this.model,
            proxy: App.getAjaxProxy("navigation/main"),
        });

        this.addButton = Ext.create("Ext.button.Button", {
            text: (this.buttonTextMode !== "hide") ? this.addButtonText : '',
            tooltip: this.addButtonText,
            icon: this.addButtonIcon,
            handler: Ext.bind(this.onItemAdd, this)
        });

    	this.callParent();

        this.getDockedItems('toolbar[dock="top"]')[0].insert(0, this.addButton);
    },

    onItemAdd: function() {
        this.fireEvent('itemAdd');
    },

    onViewReady: function(){
        this.view.getSelectionModel().select(this.view.store.first());
    },

});