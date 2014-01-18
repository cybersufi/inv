Ext.define('App.views.Widgets.ConnectionButton', {
	extend 				: 'Ext.Button',
	cls					: 'x-btn-icon',
	tooltip 			: "Disconnected",
	connectedIcon 		: App.getResource('resources/silkicons/connect.png'),
	disconnectedIcon 	: App.getResource('resources/silkicons/disconnect.png'),
	icon 				: App.getResource('resources/silkicons/disconnect.png'),

	setConnected: function () {
		this.setIcon(this.connectedIcon);
		this.setTooltip("Connected");
	},

	setDisconnected: function () {
		this.setIcon(this.disconnectedIcon);
		this.setTooltip("Disconnected");
	}
});

