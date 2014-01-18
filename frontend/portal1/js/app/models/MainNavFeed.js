Ext.define("App.models.MainNavFeed", {
	id: 'mainnavfeed',
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'linkname',
		type: 'string'
	}, {
		name: 'linkurl',
		type: 'string'
	}],

	getRecordName: function () {
		return this.get("linkname");
	}
});