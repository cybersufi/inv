Ext.define('App.views.Components.Dashboard.TopIPGrid', {
	extend: 'App.views.Components.Dashboard.DashboardGrid',
	requires: [
		'App.models.TopIP' 
	],

	alias: 'widget.TopIPGrid',
	id: 'dashboard-topipgrid',

	model: 'App.models.TopIP',
	
	initComponent: function () {
		
		this.defineColumns([{
		  	header: "IP Address",
	  		dataIndex: 'ipaddress',
		  	flex: 1,
		  	minWidth: 150,
		  	renderer: Ext.util.Format.htmlEncode
		}, {
		  	header: "Total",
	  		dataIndex: 'total',
		  	flex: 1,
		  	minWidth: 50,
		  	renderer: Ext.util.Format.htmlEncode
		}]);

		this.createStore({
			sorters: [{
				proxy: App.getAjaxProxy("dashboard/topIP"),
				property: 'username',
				direction:'ASC'
          	}]
		});
		
		this.callParent();
	},
});