Ext.define('App.views.Components.Permission.ModulePermissionEditor', {
	extend			: 'App.views.Components.Editor.Editor',
	requires		: 	[
							'App.models.ModulePermission',
					  	],
	border			: false,
	layout 			: 'fit',
	bodyStyle		: 'background:#DBDBDB;',

	model 			: 'App.models.ModulePermission',
	
	initComponent: function () {
		
		this.addEvents("moduleSaved", "titleChange");

		var basicEditorFields = [{
            xtype: 'displayfield',
            name: 'name',
            fieldLabel: 'Module Name',
        }, {
            xtype: 'radiogroup',
            columns: 2,
            fieldLabel: 'Read Permission',
            name: 'read',
            items: [{
                name: 'read',
                boxLabel: 'Allow',
                inputValue: '1'
            }, {
                name: 'read',
                boxLabel: 'Denied',
                inputValue: '0'
            }],
            setValue: function (value) {
                if (!Ext.isObject(value)) {
                    var obj = new Object();
                    obj[this.name] = value;
                    value = obj;
                }
                Ext.form.RadioGroup.prototype.setValue.call(this, value);
            }

        }, {
            xtype: 'radiogroup',
            columns: 2,
            fieldLabel: 'Write / Edit Permission',
            name: 'write',
            items: [{
                name: 'write',
                boxLabel: 'Allow',
                inputValue: '1'
            }, {
                name: 'write',
                boxLabel: 'Denied',
                inputValue: '0'
            }],
            setValue: function (value) {
                if (!Ext.isObject(value)) {
                    var obj = new Object();
                    obj[this.name] = value;
                    value = obj;
                }
                Ext.form.RadioGroup.prototype.setValue.call(this, value);
            }

        }, {
            xtype: 'radiogroup',
            columns: 2,
            fieldLabel: 'Execute Permission',
            name: 'execute',
            items: [{
                name: 'execute',
                boxLabel: 'Allow',
                inputValue: '1'
            }, {
                name: 'execute',
                boxLabel: 'Denied',
                inputValue: '0'
            }],
            setValue: function (value) {
                if (!Ext.isObject(value)) {
                    var obj = new Object();
                    obj[this.name] = value;
                    value = obj;
                }
                Ext.form.RadioGroup.prototype.setValue.call(this, value);
            }

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
		
		this.callParent();
		
		//this.on("itemSave", this.onItemSave, this);
		
	},

	onEditStart: function () {
		this.getForm().isValid();
	},

	_onItemSaved: function () {
		this.fireEvent("itemSaved", this.record);
		this.fireEvent("editorClose", this);
	},

	_setTitle: function (title) {
		var tmpTitle;
		tmpTitle = "Edit Module Permission"

		if (title !== "") {
			 tmpTitle = tmpTitle + ": " + title;
		}
		
		this.fireEvent("titleChange", tmpTitle);
	}
});
