Ext.define("App.views.Components.Permission.ModuleTree", {
	requires		: 	[
							'App.models.ModuleTreeModel'
						],
	extend			: 'App.views.Components.Tree.TreePanel',
	alias			: 'widget.ModuleTree',

	treeService		: "permissionmanager",
	treeResource	: "moduletree",
	treeModel		: 'App.models.ModuleTreeModel',
	displayField	: 'name',
	sorters			: 	[{
					        property: 'name',
					        direction: 'ASC'
					    }],
    viewConfig		: 	{
				    		animate: false
				    	},

	initComponent: function () {
		this.callParent();
		this.loadItem();
	},

});