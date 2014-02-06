Ext.define('App.views.Components.Editor.Editor', {
	extend				: 'Ext.form.Panel',
	alias				: 'widget.Editor',
	trackResetOnLoad	: true,
	bodyStyle			: 'background:#DBDBDB;padding: 10px;',
	autoScroll			: true,
	layout				: 'anchor',
	defaults			: {
					        anchor: '100%',
					        labelWidth: 150
					      },
	// If false, determinates if we should sync via the store or the record itself.
    // If true, always syncs the record via it's own proxy.
    syncDirect			: false,

	record 				: null,		// The record which is currently edited
	saveText			: "Save",
	cancelText			: "Cancel",
	model				: null,
	change 				: false,
    enableButtons		: true,
    
    
   	initComponent: function () {
		if (this.enableButtons) {
			this.saveButton = Ext.create("Ext.button.Button", {
				text: this.saveText,
				icon: App.getResource('resources/fugue-icons/icons/disk.png'),
				handler: Ext.bind(this._onItemSave, this)
			});
			
			this.cancelButton = Ext.create("Ext.button.Button", {
				text: this.cancelText,
				icon: App.getResource('resources/silkicons/cancel.png'),
				handler: Ext.bind(this.onCancelEdit, this)
			});
			
			this.bottomToolbar = Ext.create("Ext.toolbar.Toolbar", {
				enableOverflow: true,
				margin: '10px',
				defaults: {minWidth: 100},
				dock: 'bottom',
				ui: 'footer',
				items: [ this.saveButton, this.cancelButton ]
			});
			
			Ext.apply(this, {
				dockedItems: [ this.bottomToolbar ]
			});
		}
		
		this.addEvents(
			"cancelEdit",
			"startEdit",
			"newItem",
			"saved", 

			/**
			 * Fired before the item is saved.
			 * 
			 * @param record The record which is about to be saved
			 */
			"itemSave"
		);
		
		this.callParent();
	},

	syncItem: function (record) {
		this.record = record;
		this.getForm().loadRecord(this.record);
		this.show();
		this.change = false;
	},

	onCancelEdit: function () {
		if (this.getForm().isDirty()) {
			Ext.Msg.show({
				title:'Save Changes?',
				msg: 'You are closing a form that has unsaved changes. Would you like to save your changes?',
				buttons: Ext.Msg.YESNOCANCEL,
				icon: Ext.Msg.QUESTION,
				fn: this._cancelDirty,
				scope: this,
			});
		} else {
			this.getForm().reset();
			this.fireEvent("cancelEdit", this);
		}
	},

	_cancelDirty: function (button) {
		switch (button) {
			case 'yes':
				this._onItemSave();
				break;
			case 'no':
				this.getForm().reset();
				this.fireEvent("cancelEdit", this);
				break;
			default:
				return false;
		}
	},

	editItem: function (record) {
		this.record = record;
		this.getForm().loadRecord(this.record);
		
		this.show();
		
		this.change = false;
		this.fireEvent("startEdit", this);
	},

	_onItemSave: function () {
		// Disable the save button to indicate progress
		if (this.enableButtons) {
			this.saveButton.disable();

			// Sanity: If the save process fails, re-enable the button after 30 seconds
			Ext.defer(function () { this.saveButton.enable(); }, 30000, this);
		}
		
		this.getForm().updateRecord(this.record);
		
		this.fireEvent("itemSave", this.record);
		
		this.record.save({
				callback: this._onSave,
				scope: this
		});
	},

	_onSave: function (record, response) {
		if (this.enableButtons) {
			// Re-enable the save button
			this.saveButton.enable();
		}

		if (response.success === true) {
			this.record = record;
			this.fireEvent("saved", this.record);			
		}
	},
});
