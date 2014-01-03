Ext.define("App.models.ServerGroup", {
	id				: 'servergroupmodel',
	extend			: "Ext.data.Model",
	fields			: 	[{	
							name: 'id',
							type: 'number'
						}, {
							name: 'groupname',
							type: 'string'
						}, {
							name: 'groupalias',
							type: 'string'
						}, {
							name: 'groupnote',
							type: 'string'
						}, {
							name: 'status',
							type: 'number'
						}],

	proxy			: App.getRESTProxy("dashboard/items"),

	getRecordName: function () {
		return this.get("groupname");
	},

	getAliasName: function() {
		return this.get("groupalias");
	},
});