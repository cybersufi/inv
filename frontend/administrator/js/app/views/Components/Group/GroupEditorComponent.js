Ext.define('App.views.Components.Group.GroupEditorComponent', {
	requires		: [
							'App.models.Group',
							'App.views.Components.Group.*',
							'App.views.Components.Editor.*'	
						  ],
	extend			: 'App.views.Components.Editor.EditorComponent',
	alias			: 'widget.GroupEditorComponent',

	navigationClass	: 'App.views.Components.Group.GroupGrid',
	editorClass		: 'App.views.Components.Group.GroupEditorPanel',
	newItemText		: "New Group",
	deleteMessage	: "Do you really wish to delete the group '%s'?",
	deleteTitle		: "Delete Group",


	initComponent: function () {

		this.setModel('App.models.Group');

		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("groupmanager/group"),
				property: 'groupname',
				direction:'ASC'
	          }]
		});
		
		this.callParent();
	}
});