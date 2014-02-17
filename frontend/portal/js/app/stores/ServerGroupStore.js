Ext.define("App.stores.ServerGroupStore", {
	extend			: 'Ext.data.Store',
	id				: 'servergroupe-store',
	model 			: 'App.models.ServerGroup',
	proxy			: App.getRESTProxy("dashboard/items"),
	autoLoad		: false,
    remoteFilter	: true,
    remoteSort		: true,
	sorters			: 	[{
							property: 'groupname',
							direction:'ASC'
						}]
});