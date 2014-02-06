Ext.define('App.views.Components.User.UserEditorPanel', {
	extend			: 'App.views.Components.Editor.EditorTab',
	alias			: 'widget.UserEditorPanel',
	border			: false,

	detailClass		: 'App.views.Components.User.UserEditor',
	groupClass		: 'App.views.Components.User.UserGroupGrid',
	permissionClass	: 'App.views.Components.User.UserPermissionGrid',

	initComponent: function () {

		this.callParent();

		this.userDetailPanel = Ext.create(this.detailClass, {title: 'User Detail'});
		this.addPrimaryComponent(this.userDetailPanel).show();

		this.userGroupPanel = Ext.create(this.groupClass, {title: 'User Groups'});
		this.addComponent(this.userGroupPanel);

	},
});