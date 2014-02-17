
Ext.define('App.stores.UserStore', {
    extend: 'Ext.data.Store',
    singleton: true,
    requires: ['App.models.User'],
    model: 'App.models.User',

    proxy: App.getRESTProxy("usermanager"), 

    pageSize: -1,
    autoLoad: false

    constructor: function() {
        this.callParent(arguments);
    }
});