Ext.define("App.models.User", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'username',
		type: 'string'
	}, {
		name: 'email',
		type: 'string'
	}, {
		name: 'firstname',
		type: 'string'
	}, {
		name: 'lastname',
		type: 'string'
	}, {
		name: 'status',
		type: 'boolean',
	}, {
		name: 'ipaddress',
		type: 'string',
	}, {
		name: 'lastlogin',
		type: 'string',
	}, {
		name: 'password',
		type: 'string'
	}, {
		name: 'created',
		type: 'date'
	}],
	
	proxy: App.getRESTProxy("usermanager/user"),

	getRecordName: function () {
		return this.get("username");
	}
});