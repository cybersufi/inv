Ext.define("App.stores.ServerListStore", {
	extend			: 'Ext.data.Store',
	id				: 'serverlist-store',
	model 			: 'App.models.ServerList',
	proxy			: App.getRESTProxy("server/rest"),
	autoLoad		: false,
    remoteFilter	: true,
    remoteSort		: true,
	sorters			: 	[{
							property: 'membername',
							direction:'ASC'
						}]
});