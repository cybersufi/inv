Ext.define('App.views.Components.Group.GroupGrid', {
	extend				: 'App.views.Components.Editor.EditorGrid',
	alias				: 'widget.GroupGrid',
	columns				: [{
							header: "Group",  
							dataIndex: 'groupname', 
							flex: 1
						  }],
	addButtonText		: "Add Group",
	addButtonIcon		: App.getResource('resources/silkicons/user_add.png'),
    deleteButtonText	: "Delete Group",
    deleteButtonIcon	: App.getResource('resources/silkicons/user_delete.png'),

    paramName			: 'groupname',

    initComponent: function() {
    	this.setStore(this.store)
    	this.callParent();
    },

});