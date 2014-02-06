Ext.define("App.models.TopIP", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'ipaddress',
		type: 'string'
	}, {
		name: 'total',
		type: 'int'
	}],

	proxy: App.getAjaxProxy("dashboard/topIP"),
	
	getRecordName: function () {
		return this.get("ipaddress");
	}
});