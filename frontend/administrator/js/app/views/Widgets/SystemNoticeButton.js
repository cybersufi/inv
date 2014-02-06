Ext.define('App.views.Widgets.SystemNoticeButton', {
	extend: 'App.views.Widgets.FadingButton',
	icon: App.getResourcePath() + 'resources/fugue-icons/icons/service-bell.png',
	tooltip: "Unacknowledged System Notices",
	initComponent: function () {
		this.callParent();
		
		this.on("render", this.startFading, this);
		this.on("click", this.onClick, this);
	},
	onClick: function () {
		App.getApplication().menuBar.showSystemNotices();
	}
});