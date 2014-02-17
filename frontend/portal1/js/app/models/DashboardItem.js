Ext.define("App.models.DashboardItem", {
	id: 'dashboarditem',
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'number'
	}, {
		name: 'itemname',
		type: 'string'
	}, {
		name: 'itemdesc',
		type: 'string'
	}, {
		name: 'status',
		type: 'number'
	}],

	getRecordName: function () {
		return this.get("itemname");
	}
});