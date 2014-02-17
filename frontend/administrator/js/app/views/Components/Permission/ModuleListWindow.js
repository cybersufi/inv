Ext.define('App.views.Components.Permission.ModuleListWindow', {
    extend              : 'App.views.Components.Dialog.TreeDialog',
    alias               : 'widget.ModuleDialog',
    padding             : 5,
    width               : 250,
    minWidth            : 250,
    height              : 350,
    title               : 'Add Module',

    cancelButtonText    : 'Cancel',
    addButtonText       : 'Add Module',

    treeItem            : "App.views.Components.Permission.ModuleTree",
    
    cancelButtonText    : 'Cancel',
    addButtonText       : 'Add Module',

    initComponent: function () {
    	this.callParent();
    },
});