Ext.define('App.views.Components.User.UserEditor', {
	extend		: 'App.views.Components.Editor.Editor',
	requires	: [
					'App.models.User',
				  ],
	alias		: 'widget.UserEditor',
	border		: false,

	saveText	: "Save User",
	model 		: 'App.models.User',
	isNew		: false,	
	
	initComponent: function () {

		this.items = [{
			xtype: 'fieldset',
			title: 'User Detail',
			collapsible: false,
			defaultType: 'textfield',
			layout: 'anchor',
			defaults: {
				anchor: '100%',
			},
			items: [{
				xtype: 'textfield',
				name: 'id',
				fieldLabel: "ID",
				readOnly: true,
			},{
				xtype: 'textfield',
				name: 'username',
				fieldLabel: "Username",
				readOnly: true,	
			},{
				xtype: 'textfield',
				name: 'firstname',
				fieldLabel: "First Name"
			},{
				xtype: 'textfield',
				name: 'lastname',
				fieldLabel: "Last Name"
			},{
				xtype: 'textfield',
				name: 'email',
				fieldLabel: "User Email"
			},{
				xtype: 'datefield',
				name: 'created',
				fieldLabel: "Date Created",
				format: 'd/m/Y H:i',
				readOnly: true,
			}]
		}, {
			xtype: 'fieldset',
			title: 'User Password',
			collapsible: false,
			defaultType: 'textfield',
			layout: 'anchor',
			defaults: {
				anchor: '100%',
			},
			items: [{
				xtype: 'textfield',
				inputType: "password",
				name: 'password',
				fieldLabel: "Password"
			},{
				xtype: 'textfield',
				inputType: "password",
				name: 'confirm',
				fieldLabel: "Confirm Password"
			}]
		}];
		
		this.on("startEdit", this.onStartEdit, this);
		this.callParent();
	},

	onStartEdit: function () {
		if (this.record.getRecordName() == "") {
			this.getForm().findField('username').setReadOnly(false);
		}
	},
});
