Ext.define('App.views.Components.Module.ModuleEditor', {
	extend			: 'App.views.Components.Editor.Editor',
	requires		: [
						'App.models.Module',
					  ],
	border			: false,
	layout 			: 'fit',
	bodyStyle		: 'background:#DBDBDB;',

	model 			: 'App.models.Module',
	
	initComponent: function () {
		
		this.nameField = Ext.create("Ext.form.field.Text", {
			name: 'name',
			fieldLabel: "Module Name",
			allowBlank: false,
			labelWidth: 150
		});
		
		this.categoryComboBox = Ext.create("App.views.Components.Category.CategoryComboBox", {
			fieldLabel: "Module Category",
			name: 'category',
			allowBlank: false,
			labelWidth: 150
		});
		
		this.categoryComboBox.store.on("load", function () {
			var c = this.categoryComboBox.store.count();
			
			for (i=0; i < c; i++) {
				var r = this.categoryComboBox.store.getAt(i);
				if ((r != null) && (r.get('id') == 0)) {
					this.categoryComboBox.store.remove(r);
				}
			}

			this.getForm().isValid();
		}, this);
		
		var basicEditorFields = [{
			xtype: 'textfield',
			name: 'name',
			fieldLabel: "Module Name",
			allowBlank: false,
			labelWidth: 150
		}, {
			xtype: 'textfield',
			name: 'alias',
			fieldLabel: "Module Alias",
			allowBlank: false,
			labelWidth: 150
		}, this.categoryComboBox, {
			xtype: 'textfield',
			name: 'url',
			fieldLabel: "Module Url",
			allowBlank: false,
			labelWidth: 150
		}];

		this.items = {
			xtype: 'panel',
			border: false,
			plain: true,
			autoScroll: true,
			layout: 'anchor',
			defaults: {
		        anchor: '100%',
		        labelWidth: 150
		    },
			bodyStyle: 'background:#DBDBDB;padding: 10px;',
			items: basicEditorFields
		};
		
		this.on("startEdit", 	this.onEditStart, this, { delay: 200 });
		this.on("saved", 		this._onItemSaved, this);
		
		this.addEvents("linkSaved", "titleChange");
		
		this.callParent();
		
		//this.on("itemSave", this.onItemSave, this);
		
	},

	onEditStart: function () {
		this.getForm().isValid();
	},

	_onItemSaved: function () {
		this.fireEvent("linkSaved", this.record);
		
		if (this.keepOpenCheckbox.getValue() !== true) {
			this.fireEvent("editorClose", this);
		} else {
			var newItem = Ext.create("App.models.Module", this.linkDefaults);
			this.editItem(newItem);
		}
	},

	_setTitle: function (title) {
		var tmpTitle;
		
		if (this.record.phantom) {
			tmpTitle = "Add Module";
		} else {
			tmpTitle = "Edit Module";	
		}
		
		if (title !== "") {
			 tmpTitle = tmpTitle + ": " + title;
		}
		
		this.fireEvent("titleChange", tmpTitle);
	}
});
