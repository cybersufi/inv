Ext.define("App.stores.DashboardItemStore", {
	extend			: 'Ext.data.Store',
	id				: 'dashboarditem-store',
	model 			: 'App.models.DashboardItem',
	proxy			: App.getRESTProxy("dashboard/itemlist"),
	autoLoad		: false,
    remoteFilter	: true,
    remoteSort		: true,
	sorters			: 	[{
							property: 'itemname',
							direction:'ASC'
						}]
});