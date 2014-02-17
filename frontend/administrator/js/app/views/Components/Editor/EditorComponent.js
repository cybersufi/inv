Ext.define('App.views.Components.Editor.EditorComponent', {
	extend			: 'Ext.panel.Panel',
	alias			: 'widget.EditorComponentNew',
	layout			: 'border',
	padding			: 5,
	border 			: false,
	
	navigationClass	: null,
	editorClass		: null,
	
	store 			: null,
	model 			: null,

	deleteMessage	: "Do you really wish to delete the item %s?",
	deleteTitle		: "Delete Item",
	newItemText		: "New Item",
	
	initComponent: function () {
		
		this.navigation = Ext.create(this.navigationClass, {
			region: 'west',
			width: 265,
			split: true,
			store: this.store
		});
		
		this.navigation.on("itemAdd", 		this.newRecord, 	this);
		this.navigation.on("itemDelete", 	this.confirmDelete, this);
		this.navigation.on("itemEdit", 		this.startEdit, 	this);
		
		this.editorPanel = Ext.create(this.editorClass, {
			region: 'center',
			layout: 'fit',
			model: this.model,
			newItemText: this.newItemText,
		})

		this.editorPanel.on("cancelEdit",	this.cancelEdit,	this);
		this.editorPanel.on("itemSaved",	this.itemSaved,		this);

		this.editorPanel.disable();
		
		this.items = [ this.navigation, this.editorPanel ];
		
		this.callParent();
	},

	cancelEdit: function() {
		this.navigation.getSelectionModel().deselectAll(false);
		this.editorPanel.setBlank();
		this.editorPanel.disable();
	},

	itemSaved: function(record) {
		this.store.load();
		this.navigation.getSelectionModel().select(record);
	},

	newRecord: function (defaults) {
		Ext.apply(defaults, {});
		this.navigation.getSelectionModel().deselectAll(false);
		this.editorPanel.enable();
		this.editorPanel.newItem(defaults);
	},

	startEdit: function (id) {
		var model = Ext.ModelManager.getModel(this.model);
		
		model.load(id, {
			scope: this,
		    success: function(record, operation) {
		    	this.editorPanel.enable();
				this.editorPanel.editItem(record);
		    }
		});
	},

	confirmDelete: function () {
		var r = this.navigation.getSelectionModel().getLastSelected();
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
					this.deleteRecord(r);
				}
			},this);
	},

	deleteRecord: function (r) {
		r.destroy();
		this.cancelEdit();
		this.store.load();
	},

	setModel: function (model) {
		this.model = model;
	},

	createStore: function (config) {
		Ext.Object.merge(config, {
				autoLoad: true,
				model: this.model,
				autoSync: false, // Do not change. If true, new (empty) records would be immediately commited to the database.
				remoteFilter: true,
				remoteSort: true,
				pageSize: 15});
		
		this.store = Ext.create('Ext.data.Store', config);
		
		// Workaround for bug http://www.sencha.com/forum/showthread.php?133767-Store.sync()-does-not-update-dirty-flag&p=607093#post607093
		this.store.on('write', function(store, operation) {
	        var success=operation.wasSuccessful();
	        if (success) {
	            Ext.each(operation.records, function(record){
	                if (record.dirty) {
	                    record.commit();
	                }
	            });
	        }
		});
	},

	getStore: function () {
		return this.store;
	},
});