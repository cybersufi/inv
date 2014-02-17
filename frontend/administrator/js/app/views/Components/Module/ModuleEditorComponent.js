Ext.define('App.views.Components.Module.ModuleEditorComponent', {
	requires		: [
						'App.models.Module',
						'App.models.ModuleCategory',
						'App.views.Components.Editor.*',
					  ],
	extend			: 'Ext.panel.Panel',
	alias			: 'widget.ModuleEditorComponent',
	layout			: 'border',
	padding			: 5,
	border			: false,
	
	categoryModel	: 'App.models.ModuleCategory',
	moduleModel		: 'App.models.Module',

	initComponent: function () {

		this.addEvents("itemLoaded");

		this.categoryStore = this.createStore({
			model: this.categoryModel,
			proxy: App.getRESTProxy("categorymanager/category"),
			sorters: [{
				property: 'name',
				direction:'ASC'
			}] 
		});

		this.moduleStore = this.createStore({
			model: this.moduleModel,
			proxy: App.getRESTProxy("modulemanager/module"),
			groupField: 'categoryname',
			sorters: [{
				property: 'name',
				direction:'ASC'
			}] 
		});

		this.navigation = Ext.create('App.views.Components.Category.CategoryGrid', {
			region: 'west',
			width: 265,
			split: true,
			model: this.categoryModel,
			store: this.categoryStore
		});

		this.navigation.on("itemEdit", 		this.startEdit, 		this);
		this.navigation.on("itemDeleted", 	this.deleteCategory, 	this);

		this.grid = Ext.create("App.views.Components.Module.ModuleGrid", {
			region: 'center',
			layout: 'fit',
			store: this.moduleStore
		});

		this.items = [ this.navigation, this.grid ];
		
		this.callParent();

		this.fireEvent('itemLoaded');
	},

	onStart: function() {
		var count = this.navigation.getStore().count();
		if (count > 0) {
			this.navigation.setSelectedItem(0);
		}
	},

	deleteCategory: function() {
		this.grid.setCategory(0);
	},

	startEdit: function(id) {
		this.grid.setCategory(id);
	},

	createStore: function (config) {
		Ext.Object.merge(config, {
			autoLoad: true,
			autoSync: false, // Do not change. If true, new (empty) records would be immediately commited to the database.
			remoteFilter: true,
			remoteSort: true,
			pageSize: 50
		});
		
		var st = Ext.create('Ext.data.Store', config);
		
		// Workaround for bug http://www.sencha.com/forum/showthread.php?133767-Store.sync()-does-not-update-dirty-flag&p=607093#post607093
		st.on('write', function(store, operation) {
	        var success=operation.wasSuccessful();
	        if (success) {
	            Ext.each(operation.records, function(record){
	                if (record.dirty) {
	                    record.commit();
	                }
	            });
	        }
		});

		return st;
	},
});