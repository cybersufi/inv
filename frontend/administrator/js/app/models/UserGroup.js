Ext.define("App.models.UserGroup", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'groupname',
		type: 'string'
	}, {
		name: 'isprimary',
		type: 'boolean'
	}],
	
	proxy: App.getRESTProxy("usermanager/usergroups"),

	getRecordName: function () {
		return this.get("groupname");
	}
});