Ext.define('App.views.Components.Group.GroupMemberGrid', {
	extend					: 'App.views.Components.Editor.EditorContentGrid',
	alias					: 'widget.GroupMemberGrid',
	requires				: [
								'App.models.GroupMember',
							  ],

	columns					: [{
								header		: "User Name",  
								dataIndex	: 'username', 
								flex  		: 1
							  }, {
								header 		: "First Name",  
								dataIndex 	: 'firstname', 
								flex 		: 1
							  }, {
								header 		: "Last Name",  
								dataIndex	: 'lastname', 
								flex 		: 1
							  }, {
								xtype		: 'booleancolumn',
								header		: "Primary Status",  
								dataIndex	: 'isprimary',
								trueText	: 'Yes',
								falseText	: 'No',
								flex 		: 1
							  }],

	addButtonText			: "Add Member",
    deleteButtonText		: "Delete Member",
    groupTypeButtonText		: 'Set as Primary Group',

    deleteMessage			: "Do you really wish to delete the user '%s'?",
    deleteTitle				: "Delete User",

    typeMessage				: "Do you really wish to set this group as primary to user '%s' ?",
    typeTitle				: "Change Primary Group",

    dialogWindow			: 'App.views.Components.User.UserListWindow',

    model 					: 'App.models.GroupMember',

    initComponent: function() {
    	this.setModel('App.models.GroupMember');
    	this.setParentIdName('groupid');

		this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("groupmanager/groupmember"),
				property: 'username',
				direction:'ASC'
          	}]
		});

		this.on("updateButton", this._onUpdateButton, 	this);
		this.on("itemDelete",	this.confirmDelete,		this);
		this.on("itemAdd",		this.onItemAdd,			this);

    	this.callParent();

    	this.groupTypeButton = Ext.create("Ext.button.Button", {
			text: (this.buttonTextMode !== "hide") ? this.groupTypeButtonText : '',
        	tooltip: this.groupTypeButtonText,
        	icon: this.addButtonIcon,
        	handler: Ext.bind(this.onTypeButtonClick, this),
        	disabled: true
		});

		this.topToolbar.insert(2, this.groupTypeButton);
    },

    onItemAdd: function() {
    	this.win = Ext.create(this.dialogWindow);
    	this.win.show();
    	this.win.setParent(this.parentID, this.parentIdName);
    	this.win.on('itemAdd',	this._onItemAdd,	this);
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

    onTypeButtonClick: function() {
    	var r = this.getSelectionModel().getLastSelected();
		var recordName;
		
		if (r.getRecordName) {
			recordName = r.getRecordName();
		} else {
			recordName = r.get("name");
		}
		
		Ext.Msg.confirm(
			this.typeTitle,
			sprintf(this.typeMessage, recordName),
			function (but) {
				if (but == "yes") {
					this._setPrimary(r);
					return 0;
				}
			}, this
		);
    },

    _setPrimary: function(record) {
    	record.set('isprimary', '1');
    	record.save({
				callback: this._requestResponse,
				scope: this
		});
    },

	_requestResponse: function (record, response) {
		if (response.success === true) {
			this.reload();			
		}
	},

    _onUpdateButton: function() {
    	if (this.getSelectionModel().getCount() == 1) {
			this.groupTypeButton.enable();
		} else {
			this.groupTypeButton.disable();
		}
    },

});