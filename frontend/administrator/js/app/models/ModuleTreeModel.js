Ext.define("App.models.ModuleTreeModel", {
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
		name: 'isCategory',
		type: 'boolean'
	}],

    proxy: App.getRESTProxy("permissionmanager/moduletree"),

    getRecordName: function () {
    	return this.get("name");
    }
});

