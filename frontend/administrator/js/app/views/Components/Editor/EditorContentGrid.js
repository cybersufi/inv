Ext.define('App.views.Components.Editor.EditorContentGrid', {
	extend				: 'App.views.Components.Grid.BaseGrid',
	requires			: [
							'Ext.ux.form.SearchField'
						  ],
	alias				: 'widget.EditorContentGrid',
	border				: false,
	enableTopToolbar	: true,
	
	deleteButtonText	: "Delete Item",
	deleteButtonIcon	: App.getResource('resources/silkicons/delete.png'),
	addButtonText		: "Add Item",
	addButtonIcon		: App.getResource('resources/silkicons/add.png'),
	buttonTextMode		: 'show',
	model 				: null,
	store 				: null,
	record 				: null,
	deleteMessage		: null,
	deleteTitle			: null,
	dialogWindow		: null,
	parentID			: null,
	parentIdName		: null,
	
	initComponent: function () {
		
		this.addEvents(
			"itemDelete",
			"itemAdd",
			"updateButton",
			"editItem"
		);

		this.extraParams = new Array();

		this.getSelectionModel().on("select", 	this._onItemSelect, 	this);
		this.getSelectionModel().on("deselect", this._onItemDeselect, 	this);
	
		this.deleteButton = Ext.create("Ext.button.Button", {
			text: (this.buttonTextMode !== "hide") ? this.deleteButtonText : '',
			tooltip: this.deleteButtonText,
			icon: this.deleteButtonIcon,
        	handler: Ext.bind(function () {
        		this.fireEvent("itemDelete");
        	}, this),
        	disabled: true
		});
		
		this.addButton = Ext.create("Ext.button.Button", {
			text: (this.buttonTextMode !== "hide") ? this.addButtonText : '',
        	tooltip: this.addButtonText,
        	icon: this.addButtonIcon,
        	handler: Ext.bind(function () {
        		this.fireEvent("itemAdd");
        	}, this)
		});
		
		this.topToolbar = Ext.create("Ext.toolbar.Toolbar",{
			dock: 'top',
			enableOverflow: true,
			items: [
		        this.addButton,
		        this.deleteButton
			]
		});
		
		this.bottomToolbar = Ext.create("Ext.toolbar.Paging", {
			store: this.store,
			enableOverflow: true,
			dock: 'bottom',
			displayInfo: false
		});
		
		this.dockedItems = new Array();
		
		this.dockedItems.push(this.bottomToolbar);
	
		if (this.enableTopToolbar) {
			this.dockedItems.push(this.topToolbar);	
		}
		
		this.callParent();
	},

	setParentId: function (id) {
		this.parentID = id;
	},

	setParentIdName: function (param) {
		this.parentIdName = param;
	},

	syncItem: function (record) {
		this.record = record;
		this.parentID = this.record.get('id');
		this.getStore().getProxy().extraParams[this.parentIdName] = this.parentID;
		this.reload();
	},

	editItem: function (record) {
		this.record = record;
		this.parentID = this.record.get('id');
		this.getStore().getProxy().extraParams[this.parentIdName] = this.parentID;
		this.reload();
		this.fireEvent("editItem");
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
			pageSize: 15
		});
		
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

	reload: function() {
		this.store.load();
	},
	
	_onItemSelect: function (selectionModel, record) {
		this._updateDeleteButton(selectionModel, record);
		this.fireEvent("itemSelect", record);
	},
	
	_onItemDeselect: function (selectionModel, record) {
		this._updateDeleteButton(selectionModel, record);
		this.fireEvent("itemDeselect", record);
	},

	_requestResponse: function (record, response) {
		if (response.success === true) {
			this.reload();			
		}
	},
	
	_updateDeleteButton: function (selectionModel, record) {
		/* Right now, we support delete on a single record only */
		if (this.getSelectionModel().getCount() == 1) {
			this.deleteButton.enable();
		} else {
			this.deleteButton.disable();
		}

		this.fireEvent("updateButton");

	},
});