Ext.define('App.views.Toolbar.MenuBar', {
	extend: 'Ext.toolbar.Toolbar',
	initComponent: function () {
		this.ui = "mainmenu";
		
		// @todo this is an ugly list of configurations. Refactor this in a cleaner way.
		
		this.editMenu = Ext.create('Ext.menu.Menu', {
			items: [{
				text: 'Users Manager',
				handler: this.editUsers,
	        	icon: App.getResourcePath() + "resources/silkicons/user.png" 
			}, {
				text: 'Groups Manager',
				handler: this.editGroups,
	        	icon: App.getResourcePath() + "resources/silkicons/user.png" 
			}, {
				text: 'Permission Manager',
				handler: this.editPermission,
	        	icon: App.getResourcePath() + "resources/silkicons/user.png" 
			}, {
				text: 'Module Manager',
				handler: this.editModule,
	        	icon: App.getResourcePath() + "resources/silkicons/user.png" 
			}]
		});
		
		this.systemMenu = Ext.create('Ext.menu.Menu', {
			items: [
			{
	        	text: 'Disconnect',
	        	icon: App.getResourcePath() + 'resources/silkicons/disconnect.png',
	        	handler: this.disconnect
	        },{
	        	text: "User Preferences",
	        	icon: App.getResourcePath() + 'resources/fugue-icons/icons/gear.png',
	        	handler: this.showUserPreferences
	        }
			]
		});
		
		this.items = [{
			text: "System",
			menu: this.systemMenu
		},{
			text: 'Edit',
			menu: this.editMenu 
		}, '->', {
			xtype: 'tbtext',
			cls: 'partkeepr-logo-align',
			text: '<div class="partkeepr-logo">Inventory v0.3</div>',
			width: 200
		}];
		
		this.callParent();
	},
	showUserPreferences: function () {
		/*var j = new PartKeepr.UserPreferencePanel({
			iconCls: 'icon-gear',
			closable: true
		});
		
		PartKeepr.getApplication().addItem(j);
		j.show();*/
	},
	disconnect: function () {
		/*App.getApplication().logout();*/
	},
	
	editUsers: function () {
		var j = Ext.create("App.views.Components.User.UserEditorComponent", {
			title: "Users",
			iconCls: 'icon-user',
			closable: true
		});
		
		App.getApplication().addItem(j);
		j.show();
	},

	editGroups: function() {
		var j = Ext.create('App.views.Components.Group.GroupEditorComponent', {
			title: "Groups",
			iconCls: 'icon-user',
			closable: true
		});

		App.getApplication().addItem(j);
		j.show();
	},

	editPermission: function() {
		var j = Ext.create('App.views.Components.Permission.PermissionEditorComponent', {
			title: "Permission Manager",
			iconCls: 'icon-user',
			closable: true
		});

		App.getApplication().addItem(j);
		j.show();
	},

	editModule: function() {

		var j = Ext.create('App.views.Components.Module.ModuleEditorComponent', {
			title: "Module Manager",
			iconCls: 'icon-user',
			closable: true
		});

		App.getApplication().addItem(j);
		j.show();
	},

});
	