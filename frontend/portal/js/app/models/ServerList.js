Ext.define("App.models.ServerList", {
	id				: 'serverlistmodel',
	extend			: "Ext.data.Model",
	fields			: 	[{	
							name: 'id',
							type: 'number'
						}, {
							name: 'membername',
							type: 'string'
						}, {
							name: 'memberalias',
							type: 'string'
						}, {
							name: 'memberip',
							type: 'string'
						}, {
							name: 'memberpath',
							type: 'string'
						}, {
							name: 'membernote',
							type: 'string'
						}, {
							name: 'status',
							type: 'number'
						}],

	proxy			: App.getRESTProxy("groupdetail/items"),

	getRecordName: function () {
		return this.get("membername");
	},

	getAliasName: function() {
		return this.get("memberalias");
	},
});