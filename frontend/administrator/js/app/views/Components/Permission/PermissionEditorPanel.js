Ext.define('App.views.Components.Permission.PermissionEditorPanel', {
	extend			: 'App.views.Components.Editor.EditorTab',
	alias			: 'widget.PermissionEditorPanel',
	border			: false,

	initComponent: function () {

		this.callParent();

		this.detailPanel = Ext.create('App.views.Components.Permission.PermissionEditor', {title: 'General Detail'});
		this.addComponent(this.detailPanel).show();

		this.permissionMember = Ext.create('App.views.Components.Permission.PermissionModulesGrid', {title: 'Modules', permid: '0' });
		this.addComponent(this.permissionMember);

	},
});