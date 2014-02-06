Ext.define('App.views.Components.User.UserEditorComponent', {
	requires		: [
						'App.models.User',
						'App.views.Components.User.*',
						'App.views.Components.Editor.*'	
					  ],
	extend			: 'App.views.Components.Editor.EditorComponent',
	alias			: 'widget.UserEditorComponent',
	
	navigationClass	: 'App.views.Components.User.UserGrid',
	editorClass		: 'App.views.Components.User.UserEditorPanel',
	newItemText		: "New User",
	deleteMessage	: "Do you really wish to delete the user '%s'?",
	deleteTitle		: "Delete User",


	initComponent: function () {

		this.setModel('App.models.User');

		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("usermanager/user"),
				property: 'username',
				direction:'ASC'
	          }]
		});
		
		this.callParent();
	}
});