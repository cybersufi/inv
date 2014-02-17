Ext.define('App.views.Components.User.UserListWindow', {
	requires            : [
                        	'App.models.User',
                        	'App.views.Components.Dialog.GridDialog',
                          ],
    extend              : 'App.views.Components.Dialog.GridDialog',
    alias               : 'widget.UserListWindow',
    resizable           : false,
    width               : 300,
    height              : 400,
    modal               : true,
    title               : 'Add User Dialog',

    gridItem            : 'App.views.Components.User.UserGrid',
    
    cancelButtonText    : 'Cancel',
    addButtonText       : 'Add User',

    model               : 'App.models.User',

    initComponent: function () {
    	this.model = 'App.models.User';

    	this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("usermanager/user"),
				property: 'username',
				direction:'ASC'
            }]
		});

    	this.callParent();
    },
});