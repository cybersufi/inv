function iconRender(value) {
	if (value == 1) {
		return "<img src='" + App.getResource('resources/fugue-icons/icons/tick-octagon-frame.png') + "'?>";
	} else {
		return "<img src='" + App.getResource('resources/fugue-icons/icons/minus-octagon-frame.png') + "'?>"; 
	}
};

Ext.define('App.views.Components.Permission.PermissionModulesGrid', {
	requires			: 	[
								'App.models.ModulePermission',
							],
	extend				: 'App.views.Components.Editor.EditorContentGrid',	
	alias		  		: 'widget.PermisionMemberGrid',

	columns				: 	[{
								header: "Module Name",  
								dataIndex: 'name', 
								flex: 1
							},/* {
								xtype: 'booleancolumn',
								header: "Read",  
								dataIndex: 'read',
								trueText: 'Yes',
								falseText: 'No',
								flex: 1,
								sortable: false,
							}, {
								xtype: 'booleancolumn',
								header: "Write / Edit",  
								dataIndex: 'write',
								trueText: 'Yes',
								falseText: 'No',
								flex: 1,
								sortable: false,
							}, {
								xtype: 'booleancolumn',
								header: "Delete / Execute",  
								dataIndex: 'execute',
								trueText: 'Yes',
								falseText: 'No',
								flex: 1,
								sortable: false,
							}*/ {
								header: "Read",  
								dataIndex: 'read',
								align: 'center',
								flex: 1,
								sortable: false,
								renderer: iconRender,
							}, {
								header: "Write / Edit",  
								dataIndex: 'write',
								align: 'center',
								flex: 1,
								sortable: false,
								renderer: iconRender,
							}, {
								header: "Delete / Execute",  
								dataIndex: 'execute',
								align: 'center',
								flex: 1,
								sortable: false,
								renderer: iconRender,
							}],

	addButtonText		: "Add Module",
    deleteButtonText	: "Remove Module",
    editButtonText		: "Edit Module Permission",

    deleteMessage		: "Do you really wish to remove module '%s'?",
    deleteTitle			: "Remove Module",

    addDialogClass		: 'App.views.Components.Permission.ModuleListWindow',
    editDialogClass		: 'App.views.Components.Permission.ModulePermissionEditorWindow',

    editDialog			: null,
    addDialog 			: null,

    model 				: 'App.models.ModulePermission',

    initComponent: function() {
    	this.setModel('App.models.ModulePermission');
    	this.setParentIdName('permission');

    	this.groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        groupHeaderTpl: '{name} ({rows.length} ' + "Link(s)"+")"
	    });
		
		this.features = [this.groupingFeature];

    	this.setModel('App.models.ModulePermission');

    	this.createStore({
    		groupField: 'categoryname',
			sorters: [{
				proxy: App.getRESTProxy("permissionmanager/modulepermission"),
				property: 'name',
				direction:'ASC'
          	}]
		});

    	this.on("itemdblclick", this.onEditButtonClick, this);

		this.on("updateButton", this._onUpdateButton, 	this);
		this.on("itemDelete",	this.confirmDelete,		this);
		this.on("itemAdd",		this.onItemAdd,			this);

		this.callParent();

		this.editButton = Ext.create("Ext.button.Button", {
			text: (this.buttonTextMode !== "hide") ? this.editButtonText : '',
        	tooltip: this.editButtonText,
        	icon: this.addButtonIcon,
        	handler: Ext.bind(this.onEditButtonClick, this),
        	disabled: true
		});

		this.topToolbar.insert(2, this.editButton);
    },

    onItemAdd: function() {
    	this.win = Ext.create(this.addDialogClass);
    	this.win.show();
    	this.win.setParent(this.parentID, this.parentIdName);
    	this.win.on('itemAdd',	this._onItemAdd,	this);
    },

    onEditButtonClick: function() {
    	var r = this.getSelectionModel().getLastSelected();
		if (r) {
			this.editDialog = null;
			this.editDialog = Ext.create(this.editDialogClass, { modal: true });
			this.editDialog.editor.editItem(r);
			this.editDialog.show();
		}
		//this.on('itemSaved',	Ext.bind(this.onItemSaved,	this));
    },

    _onItemAdd: function (id) {
		var defaults = null;
		Ext.apply(defaults, {});
		var j = Ext.create(this.model, defaults);
		j.set('id', id);
		j.save({
				callback: this._requestResponse,
				scope: this
		});
	},

	confirmDelete: function () {
		var r = this.getSelectionModel().getLastSelected();
		var recordName;

		if (r.getRecordName) {
			recordName = r.getRecordName();
		} else {
			recordName = r.get("name");
		}
		
		Ext.Msg.confirm(
			this.deleteTitle,
			sprintf(this.deleteMessage, recordName),
			function (but) {
				if (but == "yes") {
					this.getSelectionModel().deselectAll(true);
					this._deleteRecord(r);
				}
			},this
		);
	},

	_deleteRecord: function (r) {
		r.destroy({
			callback: this._requestResponse,
			scope: this
		});
	},

    _onSave: function (record, response) {
		if (response.success === true) {
			this.reload();			
		}
	},

    _onUpdateButton: function() {
    	if (this.getSelectionModel().getCount() == 1) {
			this.editButton.enable();
		} else {
			this.editButton.disable();
		}
    },

});