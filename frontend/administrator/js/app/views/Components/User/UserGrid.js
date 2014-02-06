Ext.define('App.views.Components.User.UserGrid', {
	extend				: 'App.views.Components.Editor.EditorGrid',
	alias				: 'widget.UserGrid',
	columns				: [{
							header: "User",  
							dataIndex: 'username', 
							flex: 1
						  }],
						  
	addButtonText		: "Add User",
	addButtonIcon		: App.getResource('resources/silkicons/user_add.png'),
    deleteButtonText	: "Delete User",
    deleteButtonIcon	: App.getResource('resources/silkicons/user_delete.png'),

    paramName			: 'username',

    initComponent: function() {
    	this.setStore(this.store)
    	this.callParent();
    }

});