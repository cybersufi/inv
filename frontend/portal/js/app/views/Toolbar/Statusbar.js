Ext.define('App.views.Toolbar.Statusbar', {
	require			: 	[ 
							'App.views.Widgets.*' 
						],
	extend			: 'Ext.ux.statusbar.StatusBar',
	
	defaultText		: "Ready.",
	defaultIconCls	: 'x-status-valid',
	iconCls 		: 'x-status-valid',
	autoClear		: 3000,

	initComponent: function () {
		this.timeDisplay = Ext.create("App.views.Toolbar.TimeDisplay");
		
		Ext.apply(this, {
			items: [ { 
				xtype: 'tbseparator'
			}, this.timeDisplay ]
		});
		
		
		this.callParent();
	},
});


