Ext.define('App.views.Components.Dashboard.TopUserGrid', {
	extend: 'App.views.Components.Dashboard.DashboardGrid',
	requires: [
		'App.models.TopUser' 
	],
	alias: 'widget.TopUserGrid',
	id: 'dashboard-topusergrid',

	model: 'App.models.TopUser',
	
	initComponent: function () {
		
		this.defineColumns([{
		  	header: "User Name",
	  		dataIndex: 'username',
		  	flex: 1,
		  	minWidth: 150,
		  	renderer: Ext.util.Format.htmlEncode
		},{
		  	header: "User Group",
	  		dataIndex: 'groupname',
		  	flex: 1,
		  	minWidth: 150,
		  	renderer: Ext.util.Format.htmlEncode
		},{
		  	header: "Total",
	  		dataIndex: 'total',
		  	flex: 1,
		  	minWidth: 50,
		  	renderer: Ext.util.Format.htmlEncode
		}]);
		
		this.createStore({
			sorters: [{
				proxy: App.getAjaxProxy("dashboard/topUser"),
				property: 'username',
				direction:'ASC'
          	}]
		});
		
		this.callParent();
	},
});