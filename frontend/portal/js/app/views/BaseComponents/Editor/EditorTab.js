Ext.define('App.views.BaseComponents.Editor.EditorTab', {
	extend		: 'Ext.panel.Panel',
	alias		: 'widget.EditorTab',
	layout		: 'border',
	border		: false,
	title 		: "Detail Info for : ",

	model 		: null,
	store 		: null,
	record 		: null,
	isNew		: false,
	newItemText	: null,

	initComponent: function() {
		this.addEvents(
			"cancelEdit",
			"startEdit",
			"itemSaved",
			"startNewItem"
		);

		this.editorTabPanel = Ext.create("Ext.tab.Panel", {
			region: 'center',
			layout: 'fit',
		});

		this.items = [ this.editorTabPanel ];

		this.callParent();
	},

	setModel: function (m) {
		this.model = m;
	},

	setStore: function (s) {
		this.store = s;
	},

	addPrimaryComponent: function(comp) {
		comp.on("cancelEdit",	this._onCancelEdit,	this);
		comp.on("saved", 	this._onItemSaved,	this);
		return this.editorTabPanel.insert(0,comp);
	},

	addComponent: function (comp) {
		comp.on("cancelEdit",	this._onCancelEdit,	this);
		comp.on("saved", 	this._onItemSaved,	this);
		return this.editorTabPanel.add(comp);
	},

	getRecordId: function () {
		if (this.record) {
			return this.record.get("id");
		} else {
			return null;
		}
	},

	onCancelEdit: function() {
		this.isNew = false;
		this.fireEvent("cancelEdit", this);
	},

	setBlank: function () {
		var defaults = null;
		Ext.apply(defaults, {});
		var j = Ext.create(this.model, defaults);
		this.editItem(j);
	},

	newItem: function (defaults) {
		this.isNew = true;
		Ext.apply(defaults, {});
		var j = Ext.create(this.model, defaults);
		this.editItem(j);
		this.fireEvent("startNewItem", this);
	},

	editItem: function (r) {
		this.record = r;

		this._setTitle();

		if (!this.isNew) {
			this._enableTabs();
		} else {
			this._disableTabs();
		}

		for (var i=0;i<this.editorTabPanel.items.getCount();i++) {
			this.editorTabPanel.items.getAt(i).editItem(this.record);
		}

		this.fireEvent("startEdit", this);
	},

	_onCancelEdit: function () {
		this.isNew = false;
		this.fireEvent("cancelEdit", this);
	},

	_onItemSaved: function (record) {
		this.record = record;
		this.fireEvent("itemSaved", this.record);

		if (this.isNew == true) {
			this.isNew = false;
		}

		this._setTitle();
		this._enableTabs();

		for (var i=0;i<this.editorTabPanel.items.getCount();i++) {
			this.editorTabPanel.items.getAt(i).syncItem(this.record);
		}
	},

	_disableTabs: function() {
		if (this.editorTabPanel.items.getCount() > 1) {
			for (var i = 1; i < this.editorTabPanel.items.getCount(); i++) {
				this.editorTabPanel.items.getAt(i).disable();
			}
		}
	},

	_enableTabs: function() {
		if (this.editorTabPanel.items.getCount() > 1) {
			for (var i = 1; i < this.editorTabPanel.items.getCount(); i++) {
				this.editorTabPanel.items.getAt(i).enable();
			}
		}
	},

	_setTitle: function () {
		var title = 'Detail Info for : ';
		
		if (!this.isNew) {
			if (this.record.getRecordName() !== "") {
				title = title + this.record.getRecordName();
			} 
		} else {
			title = title + this.newItemText;
		}

		this.setTitle(title);
	},


});