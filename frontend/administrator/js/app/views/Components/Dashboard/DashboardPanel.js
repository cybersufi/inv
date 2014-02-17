Ext.define('App.views.Components.Dashboard.DashboardPanel', {
	extend: 'Ext.panel.Panel',
    requires: [
        'App.views.Components.Dashboard.*'
    ],

	alias: 'widget.dashboardpanel',
	layout: 'border',
	id: 'administrator-dashboard',
	border: false,
	padding: 5,
	
	initComponent: function () {

        this.grid_center_center = Ext.create("App.views.Components.Dashboard.DailyUserChart", { title: "Daily User Statistic", layout: 'fit', width: 200});
        this.grid_center_south = Ext.create("App.views.Components.Dashboard.DailyIpChart", { title: "Daily IP Statistic", layout: 'fit'});

        this.grid_east_center = Ext.create("App.views.Components.Dashboard.TopIPGrid", { title: "Top IP Address", layout: 'fit'});
        this.grid_east_south = Ext.create("App.views.Components.Dashboard.MonthlyIpChart", { title: "Monthly IP Statistic", layout: 'fit'});

        this.westPanel = {
            id: 'dashboard-westPanel',
            split: true,
            region: 'west',
            width: 600,
            border: false,
            layout: 'border',
            items: [ Ext.create("App.views.Components.Dashboard.LoggedUserGrid", {
                id: 'west-center',
                split: true,
                region: 'center',
                title: "Logged User", 
                layout: 'fit',
            }), Ext.create("App.views.Components.Dashboard.TopUserGrid", {
                id: 'west-south',
                split: true,
                region: 'south',
                title: "Top User",
                height: '50%',
                layout: 'fit'
            })]
        };

        this.centerPanel = {
            id: 'dashboard-centerPanel',
            split: true,
            region: 'center',
            border: false,
            layout: 'border',
            items: [{
                id: 'center-center',
                split: true,
                border: false,
                region: 'center',
                layout: 'fit',
                items: [ this.grid_center_center ]
            }, {
                id: 'center-south',
                split: true,
                border: false,
                region: 'south',
                height: '50%',
                layout: 'fit',
                items: [ this.grid_center_south ]
            }]
        };

        this.eastPanel = {
            id: 'dashboard-eastPanel',
            split: true,
            region: 'east',
            width: '60%',
            border: false,
            layout: 'border',
            items: [{
                id: 'east-center',
                split: true,
                border: false,
                region: 'center',
                layout: 'fit',
                items: [ this.grid_east_center ]
            }, {
                id: 'east-south',
                split: true,
                border: false,
                region: 'south',
                height: '50%',
                layout: 'fit',
                items: [ this.grid_east_south ]
            }]
        };

        /*this.items = [ this.westPanel , this.centerPanel, this.eastPanel ];*/
        this.items = [ this.westPanel ];
        
		this.callParent();
	},
});