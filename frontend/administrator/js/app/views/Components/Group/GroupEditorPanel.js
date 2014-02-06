Ext.define('App.views.Components.Group.GroupEditorPanel', {
	extend			: 'App.views.Components.Editor.EditorTab',
	alias			: 'widget.GroupEditorPanel',
	border			: false,

	detailClass		: 'App.views.Components.Group.GroupEditor',
	memberClass		: 'App.views.Components.Group.GroupMemberGrid',
	permissionClass	: 'App.views.Components.User.UserPermissionGrid',

	initComponent: function () {

		this.callParent();

		this.groupDetailPanel = Ext.create(this.detailClass, {title: 'Group Detail'});
		this.addPrimaryComponent(this.groupDetailPanel).show();

		this.groupMemberPanel = Ext.create(this.memberClass, {title: 'Group Members'});
		this.addComponent(this.groupMemberPanel);

	},
});