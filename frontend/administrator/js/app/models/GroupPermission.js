Ext.define("App.models.GroupPermission", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'category',
		type: 'int'
	}, {
		name: 'categoryname',
		type: 'string'
	}, {
		name: 'read',
		type: 'boolean'
	}, {
		name: 'write',
		type: 'boolean'
	}, {
		name: 'execute',
		type: 'boolean'
	}],
	
	proxy: App.getRESTProxy("permissionmanager/modulepermission"),

	getRecordName: function () {
		return this.get("name");
	}
});