Ext.define('App.views.Components.Dashboard.ItemEditor', {
	extend			: 'App.views.BaseComponents.Editor.Editor',
	requires		: [
						'App.models.ServerGroup',
					  ],
	border			: false,
	layout 			: 'fit',
	bodyStyle		: 'background:#DBDBDB;',

	model 			: 'App.models.ServerGroup',
	itemDefault		: null,
	
	initComponent: function () {

		this.addEvents("itemSaved", "titleChange");
		
		var basicEditorFields = [{
			xtype: 'textfield',
			name: 'groupname',
			fieldLabel: "Name",
			allowBlank: false,
			labelWidth: 100
		}, {
			xtype: 'textfield',
			name: 'groupalias',
			fieldLabel: "Alias",
			allowBlank: true,
			labelWidth: 100
		}, {
			xtype: 'textarea',
			name: 'groupnote',
			fieldLabel: "Description",
			labelWidth: 100
		}];

		this.items = {
			xtype: 'panel',
			border: false,
			plain: true,
			autoScroll: true,
			layout: 'anchor',
			defaults: {
		        anchor: '100%',
		        labelWidth: 100,
		    },
			bodyStyle: 'background:#DBDBDB;padding: 10px;',
			items: basicEditorFields
		};
		
		this.on("startEdit", 	this.onEditStart, 	this, { delay: 200 });
		this.on("saved", 		this._onItemSaved, 	this);
		
		this.callParent();
		
		//this.on("itemSave", this.onItemSave, this);
		
	},

	onEditStart: function () {
		this.getForm().isValid();
	},

	_onItemSaved: function () {
		this.fireEvent("itemSaved", this.record);
		
		if (this.keepOpenCheckbox.getValue() !== true) {
			this.fireEvent("editorClose", this);
		} else {
			var newItem = Ext.create(this.model, this.itemDefault);
			this.editItem(newItem);
		}
	},

	_setTitle: function (title) {
		var tmpTitle;
		
		if (this.record.phantom) {
			tmpTitle = "Add Server Group";
		} else {
			tmpTitle = "Edit Server Group";	
		}
		
		if (title !== "") {
			 tmpTitle = tmpTitle + ": " + title;
		}
		
		this.fireEvent("titleChange", tmpTitle);
	}
});
