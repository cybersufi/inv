/**
 * Defines an abstract grid which includes the grid menu plugin. 
 * 
 */
Ext.define('App.views.BaseComponents.Grid.BaseGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.basegrid',

	/**
	 * Initializes the component
	 */
	initComponent: function () {
		
		this.plug = Ext.create("App.views.Components.Grid.GridMenu");

		/**
		 * Check if the plugins already exist (e.g. by a superclass). If yes, assume it is an array, and append
		 * the plugin to it.
		 */
		if (this.plugins) {
			this.plugins.push(this.plug);
		} else {
			this.plugins = [ this.plug ];
		}
		
		this.callParent();
	}
});