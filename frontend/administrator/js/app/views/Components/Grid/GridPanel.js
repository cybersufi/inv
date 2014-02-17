/**
 * This class is the main part list grid.
 * 
 */
Ext.define('App.views.Components.Grid.GridPanel', {
	extend: 'App.views.Components.Grid.BaseGrid',
	alias: 'widget.GridPanel',
	stripeRows: true,
    autoScroll: false,
    invalidateScrollerOnRefresh: true,
	
    store: null,

    model: null,

	initComponent: function () {

		this.on('scrollershow', function(scroller) {
  			if (scroller && scroller.scrollEl) {
		    	scroller.clearManagedListeners(); 
		    	scroller.mon(scroller.scrollEl, 'scroll', scroller.onElScroll, scroller); 
		  	}
		});
		
		this.searchField = Ext.create("Ext.ux.form.SearchField",{
            store: this.store
        });
        
        this.topToolbar = Ext.create("Ext.toolbar.Toolbar",{
            dock: 'top',
            enableOverflow: true,
            items: [
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
		
		this.dockedItems = new Array();

		this.dockedItems.push(this.topToolbar);
		this.dockedItems.push(this.bottomToolbar);

		this.callParent();
	},
	
	defineColumns: function (config) {
		this.columns = config;
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
	},

	reloadGrid: function () {
		this.store.load();
	},
});