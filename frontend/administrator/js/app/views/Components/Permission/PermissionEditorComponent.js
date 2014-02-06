Ext.define('App.views.Components.Permission.PermissionEditorComponent', {
	requires			: 	[
								'App.models.Permission',
								'App.views.Components.Permission.*',
								'App.views.Components.Editor.*',
							],
	extend				: 'App.views.Components.Editor.EditorComponent',
	alias				: 'widget.PermissionEditorComponent',

	navigationClass		: 'App.views.Components.Permission.PermissionGrid',
	editorClass			: 'App.views.Components.Permission.PermissionEditorPanel',
	newItemText			: "New Permission",
	deleteMessage		: "Do you really wish to delete the permission '%s'?",
	deleteTitle			: "Delete Permission",
	model 				: 'App.models.Permission',

	initComponent: function () {
		this.setModel('App.models.Permission');

		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("permissionmanager/permission"),
				property: 'name',
				direction:'ASC'
	          }]
		});
		
		this.callParent();
	},
});