Ext.define("App.views.Components.Grid.GridMenu", {
	alias: 'plugin.categorygridmenu',
	
	// Private: The assigned grid
	grid: null,
	
	/**
	 * Initializes the plugin.
	 * @param grid {Object} The grid to which this plugin is bound
	 */
	init: function(grid) {

		this.addEvents(
			"editSelected",
			"deleteSelected"
		);

		this.grid = grid;
		
		this.menu = new Ext.menu.Menu({
			floating: true,
			renderTo: Ext.getBody(),
			items: [{
					icon: App.getResourcePath() + 'resources/mimetypes/csv.png',
					text: 'Edit Category',
					handler: this.editItme,
					scope: this
				}, {
					icon: App.getResourcePath() + 'resources/mimetypes/csv.png',
					text: 'Delete Category',
					handler: this.deleteItem,
					scope: this
				}]
			}]
		});
		
		// Show the menu when an item was clicked
		grid.on("itemcontextmenu", function (view, record, item, index, e, eOpts) {
			this.menu.showAt(e.xy[0], e.xy[1]);
		}, this);
		
		// Show the menu when no item but the grid was clicked
		grid.on("containercontextmenu", function (view, e, eOpts) {
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