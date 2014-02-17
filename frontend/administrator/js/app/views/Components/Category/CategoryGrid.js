Ext.define('App.views.Components.Category.CategoryGrid', {
	extend: 'App.views.Components.Editor.EditorGrid',
	alias: 'widget.CategoryGrid',
	columns: [{
		header: "Module Category",  
		dataIndex: 'name', 
		flex: 1
	}],

	filters:[{
		ftype: 'filters',
		autoReload: false,
		local: false,
		filters: [{
			type: 'string',
			dataIndex: 'name'
		}]
	}],
	
	addButtonText: "Add Category",
	addButtonIcon: App.getResourcePath() + 'resources/silkicons/folder_add.png',
    deleteButtonText: "Delete Category",
    deleteButtonIcon: App.getResourcePath() + 'resources/silkicons/folder_delete.png',

    initComponent: function() {
    	this.addEvents("itemDeleted");

    	this.createMenu();
		
    	this.callParent();

    	this.on("itemAdd", 			this.showCategoryAddDialog, 			this);
    	this.on("itemDelete", 		this.confirmCategoryDelete, 			this);
    	this.on("itemcontextmenu", 	this.onItemContextMenu, 				this);
    },

    setSelectedItem: function(index) {
    	this.getSelectionModel().select(index);
    },

    reload: function() {
    	this.grid.load();
    },

    confirmCategoryDelete: function () {
    	var r = this.getSelectionModel().getLastSelected();
		var recordName;
		
		if (r.getRecordName) {
			recordName = r.getRecordName();
		} else {
			recordName = r.get("name");
		}

		Ext.Msg.confirm(
			"Confirm Category Delete", 
			sprintf("Do you really wish to delete the category '%s'?", recordName), 
			function (but) {
				if (but == "yes") {
					r.destroy();
					this.store.load();
					this.fireEvent("itemDeleted");
				}
			}, 
			this
		);
	},

	showCategoryAddDialog: function () {
		var j = Ext.create("App.views.Components.Category.CategoryEditorWindow", {
			record: null,
			categoryModel: this.model,
			listeners: {
				save: Ext.bind(this.onUpdateRecord, this)
			}
		});
		
		j.show(this.addButton);
	},

	showCategoryEditDialog: function () {
		var r = this.getSelectionModel().getLastSelected();
		var j = Ext.create("App.views.Components.Category.CategoryEditorWindow", {
			record: r,
			categoryModel: this.model,
			listeners: {
				save: Ext.bind(this.onUpdateRecord, this)
			}
		});
		
		j.on('save',	Ext.bind(this.onUpdateRecord, this))
		j.show();
	},

	onItemContextMenu: function (view, record, item, index, event) {
		var menu = this.menu;
		event.stopEvent();

		if (this.getSelectionModel().isSelected(index) != true) {
			this.getSelectionModel().select(index);
		}
		
		this.menuCategoryEdit.enable();
		this.menuCategoryDelete.enable();

		if (record.get("id") == 0) {
			this.menuCategoryDelete.disable();
			this.menuCategoryEdit.disable();
		}

	    menu.showAt(event.getXY());
	    return false;
	},

	createMenu: function() {
		this.menuCategoryDelete = Ext.create("Ext.menu.Item", {
			text: "Delete Category",
			handler: Ext.bind(this.confirmCategoryDelete, this),
			icon: App.getResourcePath() + 'resources/silkicons/folder_delete.png'
		});
		
		this.menuCategoryEdit = Ext.create("Ext.menu.Item", {
			text: "Edit Category",
			handler: Ext.bind(this.showCategoryEditDialog, this),
			icon: App.getResourcePath() + 'resources/silkicons/folder_edit.png'
		});
		
		this.menu = Ext.create('widget.menu', {
            items: [
                this.menuCategoryEdit,
                this.menuCategoryDelete
            ]
        });
	},

	onUpdateRecord: function(response) {
		this.store.load();
	}

});