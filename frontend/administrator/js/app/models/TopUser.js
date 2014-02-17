Ext.define("App.models.TopUser", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'userid',
		type: 'int'
	}, {
		name: 'username',
		type: 'string'
	}, {
		name: 'groupname',
		type: 'string'
	}, {
		name: 'total',
		type: 'int',
	}],

	proxy: App.getAjaxProxy("dashboard/topUser"),
	
	getRecordName: function () {
		return this.get("username");
	}
});