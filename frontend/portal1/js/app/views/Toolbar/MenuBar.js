Ext.define('App.views.Toolbar.MenuBar', {
	extend			: 'Ext.toolbar.Toolbar',

	initComponent: function () {
		this.ui = "mainmenu";
		
		this.items = [ '->', {
			xtype: 'tbtext',
			cls: 'partkeepr-logo-align',
			text: '<div class="partkeepr-logo">Server Status Portal v0.1</div>',
			width: 500,
			height: 25,
		}];
		
		this.callParent();
	},
	
});
	