Ext.define('App.views.Components.Permission.PermissionEditor', {
	requires	: 	[
						'App.models.Permission',
					],

	extend		: 'App.views.Components.Editor.Editor',
	alias		: 'widget.PermissionEditor',
	border		: false,

	saveText	: "Save Permission",
	model 		: 'App.models.Permission',
	isNew		: false,
	
	initComponent: function () {
		this.items = [{
			xtype: 'textfield',
			name: 'id',
			fieldLabel: "ID",
			readOnly: true,
		}, {
			xtype: 'textfield',
			name: 'name',
			fieldLabel: "Permission Name"
		}, {
			xtype: 'textfield',
			name: 'key',
			fieldLabel: "Permission Key"
		}];
		
		this.on("startEdit", this.onStartEdit, this);
		this.callParent();
	},

	onStartEdit: function () {
		if (this.record.getRecordName() == "") {
			this.getForm().findField('id').setReadOnly(false);
		}
	},
	
	onItemSave: function () {
		//this.gridPanel.syncPreferences();
		this.callParent();
	}
});