Ext.define("App.models.DashboardGridItem", {
	id: 'dashboardgriditem',
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'string'
	}, {
		name: 'servername',
		type: 'string'
	}, {
		name: 'groupid',
		type: 'number'
	}, {
		name: 'groupname',
		type: 'string'
	}, {
		name: 'pingtime',
		type: 'number'
	}, {
		name: 'status',
		type: 'number'
	}, {
		name: 'serveralias',
		type: 'alias'
	}],

	proxy: App.getRESTProxy("servergroup/groupmember"),

	getRecordName: function () {
		return this.get("servername");
	}
});