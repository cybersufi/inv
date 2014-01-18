Ext.define("App.stores.DashboardGridItemStore", {
	extend			: 'Ext.data.Store',
	id				: 'dashboard-grid-item-store',
	model 			: 'App.models.DashboardGridItem',
	proxy			: App.getRESTProxy("servergroup/groupmember"),
	autoLoad		: false,
    remoteFilter	: true,
    remoteSort		: true,
    groupField		: 'groupname',
	sorters			: 	[{
							property: 'servername',
							direction:'ASC'
						}]
});