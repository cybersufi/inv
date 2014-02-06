Ext.define('App.views.Components.Group.GroupListWindow', {
	requires            : [
                        	'App.models.Group',
                        	'App.views.Components.Dialog.GridDialog',
                          ],
    extend              : 'App.views.Components.Dialog.GridDialog',
    alias               : 'widget.GroupListWindow',
    resizable           : false,
    width               : 300,
    height              : 400,
    modal               : true,
    title               : 'Add Group Dialog',

    gridItem            : 'App.views.Components.Group.GroupGrid',
    
    cancelButtonText    : 'Cancel',
    addButtonText       : 'Add Group',

    model               : 'App.models.Group',

    initComponent: function () {
    	this.model = 'App.models.Group';

    	this.createStore({
			sorters: [{
				proxy: App.getRESTProxy("groupmanager/group"),
				property: 'groupname',
				direction:'ASC'
            }]
		});

    	this.callParent();
    },
});