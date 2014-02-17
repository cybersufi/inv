Ext.define('App.views.BaseComponents.Tree.TreeGrid', {
	extend						: 'Ext.tree.TreePanel',
	alias						: 'widget.TreeGrid',
	autoScroll					: false,
    
	useArrows					: true,
    rootVisible					: false,
    multiSelect					: true,
    singleExpand				: true,

    store 						: null,
    model						: null,

	initComponent: function () {
		/*this.createToolbar();*/
		this.callParent();
	},
	
	defineColumns: function (config) {
		this.columns = config;
	},

	setModel: function (model){
		this.model = model;
	},
	
	createStore: function (config) {
		Ext.Object.merge(config, {
			folderSort: true,
		});
		
		this.store = Ext.create('Ext.data.TreeStore', config);
	},

	/*createToolbar: function () {
		this.toolbarExpandButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/toggle-expand.png'),
			tooltip: "Expand All",
			handler: this._onExpandClick,
			scope: this
		});
		
		this.toolbarCollapseButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/toggle.png'),
			tooltip: "Collapse All",
			handler: this._onCollapseClick,
			scope: this
		});
		
		this.toolbarReloadButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/refresh.png'),
			tooltip: "Reload",
			handler: this._onReloadClick,
			scope: this
		});

		this.searchField = Ext.create("Ext.ux.form.SearchField",{
            store: this.store
        });
		
		this.toolbar = Ext.create("Ext.toolbar.Toolbar", {
			enableOverflow: true,
			dock: 'top',
			items: [ 
				this.toolbarExpandButton, 
				this.toolbarCollapseButton, 
				this.toolbarReloadButton, 
				{ xtype: 'tbfill' },
                this.searchField 
            ]
		});
		
		this.bottomToolbar = Ext.create("Ext.toolbar.Paging", {
			store: this.store,
			enableOverflow: true,
			dock: 'bottom',
			displayInfo: false
		});

		Ext.apply(this, {
			dockedItems: [ this.toolbar, this.bottomToolbar ]
		});
	},

	reloadGrid: function () {
		this.store.load();
	},

	_onReloadClick: function () {
		//this.loadItem();
	},

	_onExpandClick: function () {
		//this.getRootNode().firstChild.expand(true);
	},

	_onCollapseClick: function () {
		//this.getRootNode().firstChild.collapse(true);
	},*/
});