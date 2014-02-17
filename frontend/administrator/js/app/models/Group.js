Ext.define("App.models.Group", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'groupname',
		type: 'string'
	}, {
		name: 'description',
		type: 'string'
	}],
	
	proxy: App.getRESTProxy("groupmanager/group"),

	getRecordName: function () {
		return this.get("groupname");
	}
});