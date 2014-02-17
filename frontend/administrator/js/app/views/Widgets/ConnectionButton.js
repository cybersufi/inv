Ext.define('App.views.Widgets.ConnectionButton', {
	extend: 'Ext.Button',
	connectedIcon: App.getResourcePath() + 'resources/silkicons/connect.png',
	disconnectedIcon: App.getResourcePath() + 'resources/silkicons/disconnect.png',
	cls: 'x-btn-icon',
	icon: App.getResourcePath() + 'resources/silkicons/disconnect.png',
	tooltip: "Disconnected",
	setConnected: function () {
		this.setIcon(this.connectedIcon);
		this.setTooltip("Connected");
	},
	setDisconnected: function () {
		this.setIcon(this.disconnectedIcon);
		this.setTooltip("Disconnected");
	}
});

