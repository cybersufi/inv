Ext.define("App.models.LoggedUser", {
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
		name: 'ipaddress',
		type: 'string',
	}],

	proxy: App.getAjaxProxy("dashboard/loggedUser"),
	
	getRecordName: function () {
		return this.get("username");
	}
});