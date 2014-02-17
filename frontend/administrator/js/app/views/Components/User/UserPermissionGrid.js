Ext.define('App.views.Components.User.UserPermissionGrid', {
	extend: 'App.views.Components.Editor.EditorContentGrid',
	alias: 'widget.UserGroupGrid',
	requires: [
		'App.models.Group',
	],

	columns: [{
		header: "Permission Name",  
		dataIndex: 'permissionname', 
		flex: 1
	}, {
		header: "Permission Status",  
		dataIndex: 'status', 
		flex: 1
	}],

	addButtonText: "Add Permission",
    deleteButtonText: "Delete Permission",

    model: 'App.models.Group',

    initComponent: function() {
    	this.setModel('App.models.Group');

		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("groupmanager/rest"),
				property: 'groupname',
				direction:'ASC'
	          }]
		});

    	this.callParent();
    }

});