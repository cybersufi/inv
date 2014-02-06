Ext.define('App.views.Components.Category.CategoryListWindow', {
	requires: [
    	'App.models.ModuleCategory',
    	'App.views.Components.Dialog.GridDialog',
    ],
	extend: 'App.views.Components.Dialog.GridDialog',
    alias: 'widget.CategoryListWindow',
    resizable: false,
	border: false,
	width: 300,
	height: 400,
	modal: true,
	model: 'App.models.ModuleCategory',

	gridItem: 'App.views.Components.Category.CategoryGrid',

	title: 'Move module to',

	cancelButtonText: 'Cancel',
    addButtonText: 'Move Module',

	initComponent: function () {
		this.model = 'App.models.ModuleCategory';
		this.addEvents("itemMove");
		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("categorymanager/category"),
				property: 'name',
				direction:'ASC'
	          }]
		});
		
		this.callParent();
		
	},

	onItemAdd: function (record) {
        this.fireEvent("itemMove", record);
    }
});
