Ext.define("App.models.Permission", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'key',
		type: 'string'
	}],
	
	proxy: App.getRESTProxy("permissionmanager/permission"),

	getRecordName: function () {
		return this.get("name");
	}
});