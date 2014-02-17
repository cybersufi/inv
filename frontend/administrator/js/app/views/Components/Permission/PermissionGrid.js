Ext.define('App.views.Components.Permission.PermissionGrid', {
	extend				: 'App.views.Components.Editor.EditorGrid',
	alias				: 'widget.PermissionGrid',
	columns				: 	[{
								header: "Permission",  
								dataIndex: 'name', 
								flex: 1
							}],
	addButtonText		: "Add Permission",
	addButtonIcon		: App.getResource('resources/silkicons/user_add.png'),
    deleteButtonText	: "Delete Permission",
    deleteButtonIcon	: App.getResource('resources/silkicons/user_delete.png'),

    paramName			: 'name',

    initComponent: function() {
    	this.setStore(this.store);
    	this.callParent();
    },

});