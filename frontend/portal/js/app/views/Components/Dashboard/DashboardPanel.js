Ext.define('App.views.Components.Dashboard.DashboardPanel', {
	extend              : 'Ext.tab.Panel',
    requires            :   [
                                'App.views.Components.Dashboard.*'
                            ],

	alias               : 'widget.dashboardtabbedpanel',
	layout              : 'fit',
	id                  : 'portal-dashboardtabbed',
	border              : false,
    bodyStyle           : "background:#DBDBDB",

    overviewClass       : 'App.views.Components.Dashboard.DashboardOverviewPanel',
    detailClass         : 'App.views.Components.Dashboard.DashboardItemGrid',
	
	initComponent: function () {

        this.overviewPanel = Ext.create(this.overviewClass, {
            title       : "Dashboard Overview",
            iconCls     : "icon-server",
        });

        this.detailPanel = Ext.create(this.detailClass, {
            title       : "Dashboard Detail",
            iconCls     : "icon-server",
        });

        Ext.apply(this, {
            items: [ this.overviewPanel, this.detailPanel]
        });

        //this.setActiveTab(0);


		this.callParent();
	},
});