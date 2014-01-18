Ext.define("App.views.Components.Dashboard.DashboardMenu", {
	alias: 'plugin.dashboardmenu',
	
	// Private: The assigned grid
	view: null,
	
	/**
	 * Initializes the plugin.
	 * @param grid {Object} The grid to which this plugin is bound
	 */
	init: function(view) {

		this.addEvents(
			"editSelected",
			"deleteSelected",
			"viewSelected"
		);

		this.view = view;
		
		this.menu = new Ext.menu.Menu({
			floating: true,
			renderTo: Ext.getBody(),
			items: [{
					icon: App.getResource('resources/fugue-icons/icons/property.png'),
					text: 'Edit Category',
					handler: this.editItme,
					scope: this
				}, {
					icon: App.getResource('resources/silkicons/delete.png'),
					text: 'Delete Category',
					handler: this.deleteItem,
					scope: this
				}]
			}]
		});
		
		// Show the menu when an item was clicked
		view.on("itemcontextmenu", function (view, record, item, index, e, eOpts) {
			this.menu.showAt(e.xy[0], e.xy[1]);
		}, this);
		
		// Show the menu when no item but the grid was clicked
		view.on("containercontextmenu", function (view, e, eOpts) {
			this.menu.showAt(e.xy[0], e.xy[1]);
		}, this);
	},

	editItme: function() {
		var r = this.getSelectionModel().getLastSelected();
		this.fireEvent("editSelected", r);
	},

	deleteItem: function() {
		var r = this.getSelectionModel().getLastSelected();
		this.fireEvent("deleteSelected", r);
	},
});