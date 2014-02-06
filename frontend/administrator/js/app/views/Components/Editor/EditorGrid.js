Ext.define('App.views.Components.Editor.EditorGrid', {
	extend: 'App.views.Components.Grid.BaseGrid',
	requires: [
		'Ext.ux.form.SearchField'
	],
	alias: 'widget.EditorGrid',
	
	/**
     * @cfg {String} text The text for the "delete" button
     */
	deleteButtonText: "Delete Item",
	
	/**
     * @cfg {String} text The path to the 'delete' icon
     */
	deleteButtonIcon: App.getResourcePath() + 'resources/silkicons/delete.png',
	
	/**
     * @cfg {String} text The text for the "add" button
     */
	addButtonText: "Add Item",
	
	/**
     * @cfg {String} text The path to the 'add' icon
     */
	addButtonIcon: App.getResourcePath() + 'resources/silkicons/add.png',
	
	/**
     * @cfg {Boolean} boolean Specifies whether to enable the top toolbar or not
     */
	enableTopToolbar: true,
	
	/**
     * @cfg {String} text Defines if the "add"/"delete" buttons should show their text or icon only. If "hide", the
     * button text is hidden, anything else shows the text.
     */
	buttonTextMode: 'hide',

	enableButton: true,

	model: null,

	store: null,

	paramName: null,
	
	initComponent: function () {
		
		this.addEvents(
				/**
	             * @event itemSelect
	             * Fires if a record was selected within the grid.
	             * @param {Object} record The selected record
	             */
				"itemSelect",
				
				/**
	             * @event itemDeselect
	             * Fires if a record was deselected within the grid.
	             * @param {Object} record The deselected record
	             */
				"itemDeselect",

				/**
				 * @event itemEdit
				 * Fires if a record should be edited.
				 * @param {Object} record The record to edit
				 */
				"itemEdit",
				
				/**
	             * @event itemDelete
	             * Fires if the delete button was clicked.
	             */
				"itemDelete",
				
				/**
	             * @event itemDelete
	             * Fires if the add button was clicked.
	             */
				"itemAdd");
		
		
		this.getSelectionModel().on("select", 	this._onItemSelect, 	this);
		this.getSelectionModel().on("deselect", this._onItemDeselect, 	this);
		
		this.on("itemclick", this._onItemEdit, this);

		if (this.enableButton) {
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

			this.searchField = Ext.create("Ext.ux.SearchField",{
				store: this.store,
			});

		} else {
			this.addButton = '-';
			this.deleteButton = '-';

			this.searchField = Ext.create("Ext.ux.SearchField",{
				store: this.store,
				anchor: '100%',
			});
		}
		
		if (this.enableButton) {
			this.topToolbar = Ext.create("Ext.toolbar.Toolbar",{
				dock: 'top',
				enableOverflow: true,
				items: [
				        this.addButton,
				        this.deleteButton,
				        { xtype: 'tbfill' },
				        this.searchField]
			});
		} else {
			this.topToolbar = Ext.create("Ext.toolbar.Toolbar",{
				dock: 'top',
				enableOverflow: true,
				layout: 'anchor',
				items: [ this.searchField ]
			});
		}
		
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
		
		this.plugins = [ 'gridmenu' ];
		
		this.callParent();
	},

	setModel: function (model) {
		this.model = model;
	},

	setStore: function (store) {
		this.store = store;
	},

	getStore: function() {
		return this.store;
	},

	syncChanges: function (record) {
		// Simply reload the store for now
		this.store.load();
	},
	/**
	 * Called when an item was selected. Enables/disables the delete button. 
	 */
	_updateDeleteButton: function (selectionModel, record) {
		/* Right now, we support delete on a single record only */
		if (this.enableButton) {
			if (this.getSelectionModel().getCount() == 1) {
				this.deleteButton.enable();
			} else {
				this.deleteButton.disable();
			}
		}
	},
	
	/**
	 * Called when an item should be edited
	 */
	_onItemEdit: function (view, record) {
		this.fireEvent("itemEdit", record.get("id"));
	},
	/**
	 * Called when an item was selected
	 */
	_onItemSelect: function (selectionModel, record) {
		this._updateDeleteButton(selectionModel, record);
		this.fireEvent("itemSelect", record);
	},
	/**
	 * Called when an item was deselected
	 */
	_onItemDeselect: function (selectionModel, record) {
		this._updateDeleteButton(selectionModel, record);
		this.fireEvent("itemDeselect", record);
	},
});