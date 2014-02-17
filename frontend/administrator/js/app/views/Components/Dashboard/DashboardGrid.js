/**
 * This class is the main part list grid.
 * 
 */
Ext.define('App.views.Components.Dashboard.DashboardGrid', {
	extend: 'App.views.Components.Grid.BaseGrid',
	require: [
		'Ext.toolbar.Paging'
	],
	alias: 'widget.DashboardGrid',
	stripeRows: true,
    autoScroll: false,
    invalidateScrollerOnRefresh: true,
	
    store: null,

	initComponent: function () {

		this.on('scrollershow', function(scroller) {
  			if (scroller && scroller.scrollEl) {
		    	scroller.clearManagedListeners(); 
		    	scroller.mon(scroller.scrollEl, 'scroll', scroller.onElScroll, scroller); 
		  	}
		});
		
		this.bottomToolbar = Ext.create("Ext.toolbar.Paging", {
			store: this.store,
			enableOverflow: true,
			displayMsg: 'Displaying records {0} - {1} of {2}',
			emptyMsg: "No records to display",
			dock: 'bottom',
			displayInfo: true
		});
		
		this.dockedItems = new Array();
		
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