Ext.define('App.views.Components.Module.ModuleListWindow', {
	requires            : [
                        	'App.models.Module',
                        	'App.views.Components.Dialog.GridDialog',
                         ],

    extend              : 'App.views.Components.Dialog.GridDialog',
    alias               : 'widget.ModuleListWindow',
    resizable           : false,
    width               : 300,
    height              : 400,
    modal               : true,
    title               : 'Add Module Dialog',

    gridItem            : 'App.views.Components.Module.ModuleGrid',
    cancelButtonText    : 'Cancel',
    addButtonText       : 'Add Module',

    initComponent: function () {
    	this.model = 'App.models.Module';

    	this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("modulemanager/module"),
				property: 'name',
				direction:'ASC'
	          }]
		});

    	this.callParent();
    },

    onItemAdd: function (record) {
        this.fireEvent("itemAdd", record);
    }
});