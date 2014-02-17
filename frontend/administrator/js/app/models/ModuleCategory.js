Ext.define("App.models.ModuleCategory", {
	extend: "Ext.data.Model",
	fields: [{	
		name: 'id',
		type: 'int'
	}, {
		name: 'name',
		type: 'string' 
	}, {
		name: 'description',
		type: 'string'
	}, {
		name: 'parent',
		type: 'int'
	}],

    proxy: App.getRESTProxy("categorymanager/category"),

    getRecordName: function () {
    	return this.get("name");
    }
});

