Ext.define("App.models.GroupMember", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'username',
		type: 'string'
	}, {
		name: 'firstname',
		type: 'string'
	}, {
		name: 'lastname',
		type: 'string'
	}, {
		name: 'isprimary',
		type: 'boolean'
	}],
	
	proxy: App.getRESTProxy("groupmanager/groupmember"),

	getRecordName: function () {
		return this.get("username");
	}
});