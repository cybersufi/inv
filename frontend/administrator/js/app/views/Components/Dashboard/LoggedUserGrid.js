Ext.define('App.views.Components.Dashboard.LoggedUserGrid', {
	extend: 'App.views.Components.Dashboard.DashboardGrid',
	requires: [
		'App.models.LoggedUser' 
	],
	alias: 'widget.LoggedUserGrid',
	id: 'dashboard-loggedusergrid',
	
	model: 'App.models.LoggedUser',

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
		  	header: "IP Address",
	  		dataIndex: 'ipaddress',
		  	flex: 1,
		  	minWidth: 50,
		  	renderer: Ext.util.Format.htmlEncode
		}]);
		
		this.createStore({
			sorters: [{
				proxy: App.getAjaxProxy("dashboard/loggedUser"),
				property: 'username',
				direction:'ASC'
          	}]
		});


		this.callParent();
	},
});