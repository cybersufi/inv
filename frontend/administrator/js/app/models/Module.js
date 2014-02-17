Ext.define("App.models.Module", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'name',
		type: 'string' 
	}, {
		name: 'alias',
		type: 'string' 
	}, {
		name: 'description',
		type: 'string'
	}, {
		name: 'url',
		type: 'string'
	}, {
		name: 'parent',
		type: 'int'
	}, {
		name: 'category',
		type: 'int'
	}, {
		name: 'categoryname',
		type: 'string'
	}],

    proxy: App.getRESTProxy("modulemanager/module"),

    getRecordName: function () {
    	return this.get("name");
    }
});

