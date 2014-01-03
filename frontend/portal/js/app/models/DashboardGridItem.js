Ext.define("App.models.DashboardGridItem", {
	id: 'dashboarditem',
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'pingtime',
		type: 'number'
	}, {
		name: 'status',
		type: 'number'
	}],

	getRecordName: function () {
		return this.get("name");
	}
});