Ext.define('App.views.Components.Dashboard.ItemEditorWindow', {
	extend				: 'Ext.window.Window',
	constrainHeader		: true,
	layout				: 'fit',
	width 				: 430,
	height 				: 210,
	resizable			: false,
	
	saveText			: "Save",
	cancelText			: "Cancel",
	
	mode 				: 'edit',
	title 				: "Add Server Group",
	
	/**
	 * Creates the part editor and put it into the window.
	 */
	initComponent: function () {

		this.addEvents("itemSaved");

		this.editor = Ext.create("App.views.Components.Dashboard.ItemEditor", {
			border: false,
			mode: this.mode,
			enableButtons: false
		});
		
		this.items = [ this.editor ];

		this.editor.on("editorClose", 	function (context) { this.close();}, this, { delay: 200 });
		this.editor.on("titleChange", 	function (val) { this.setTitle(val); }, this);
		this.editor.on("itemSaved", 	this.onItemSaved, this);
		
		this.saveButton = Ext.create("Ext.button.Button", {
			text: this.saveText,
			icon: App.getResource('resources/fugue-icons/icons/disk.png'),
			handler: Ext.bind(this.onItemSave, this)
		});
		
		this.cancelButton = Ext.create("Ext.button.Button", {
			text: this.cancelText,
			icon: App.getResource('resources/silkicons/cancel.png'),
			handler: Ext.bind(this.onCancelEdit, this)
		});
		
		this.bottomToolbar = Ext.create("Ext.toolbar.Toolbar", {
			enableOverflow: true,
			defaults: { minWidth: 100 },
			dock: 'bottom',
			ui: 'footer',
			pack: 'start',
			items: [ this.saveButton, this.cancelButton ]
		});
		
		this.dockedItems = [ this.bottomToolbar ];

		this.keepOpenCheckbox = Ext.create("Ext.form.field.Checkbox", {
			boxLabel: "Create blank item after save"
		});
		
		if (this.mode == "create") {
			this.bottomToolbar.add(this.keepOpenCheckbox);
		}
		
		this.editor.keepOpenCheckbox = this.keepOpenCheckbox;
		
		this.callParent();
	},

	addDefault: function(defaults) {
		this.editor.itemDefault = defaults;
	},

	editItem: function(record) {
		this.editor.editItem(record);
	},

	onCancelEdit: function () {
		if (this.mode == "edit") {
			this.editor.onCancelEdit();
		}
		this.close();
	},
	
	onItemSave: function () {
		if (!this.editor.getForm().isValid()) { return; }
		
		// Disable the save button to indicate progress
		this.saveButton.disable();
		
		// Sanity: If the save process fails, re-enable the button after 30 seconds
		Ext.defer(function () { this.saveButton.enable(); }, 30000, this);
		
		this.editor._onItemSave();
	},
	
	onItemSaved: function (record) {
		this.saveButton.enable();
		/*if (this.mode == "edit") {
			this.editor.onCancelEdit();
		}
		this.close();*/
		this.fireEvent("itemSaved", record);
	}
});
