Ext.define('App.views.Components.Group.GroupEditor', {
	extend		: 'App.views.Components.Editor.Editor',
	requires	: [
					'App.models.Group',
				  ],
	alias		: 'widget.GroupEditor',
	border		: false,
	
	saveText	: "Save Group",
	model 		: 'App.models.Group',
	isNew 		: false,

	initComponent: function () {
		this.items = [{
			xtype: 'textfield',
			name: 'id',
			fieldLabel: "ID",
			readOnly: true,
		}, {
			xtype: 'textfield',
			name: 'groupname',
			fieldLabel: "Group Name"
		}, {
			xtype: 'textfield',
			name: 'description',
			fieldLabel: "Group Description"
		}];
		
		this.callParent();
	},
});