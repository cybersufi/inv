Ext.namespace("App");
Ext.Loader.setConfig({
    enabled     : true,
    paths       :   {
                        'App'   : 'frontend/portal/js/app',
                        'Ext.ux': 'frontend/portal/js/Ext.ux'
                    } 
});


App.application     = null;
App.basePath        = null;
App.resourcePath    = null;
App.ExceptionWindow = null;

App.getApplication = function () {
    return App.application;
};

App.getApp = function() {
    return App.application;
}

App.setBasePath = function (path) {
    App.basePath = path;
};

App.getBasePath = function () {
    return App.basePath;
};

App.setResourcePath = function (path) {
    App.resourcePath = path;
};

App.getResourcePath = function () {
    return App.resourcePath;
};

App.getResource = function (resource) {
    return App.getResourcePath() + "/" + resource;
};  

Ext.application({
    name                : "App",
    require             :   [
    	                       'Ext.container'
                            ],
    appFolder           : "frontend/portal/js/app",

    launch: function () {
    	Ext.get("loading").hide();
        App.ExceptionWindow = Ext.create('App.views.Dialogs.ExceptionWindow');
        App.application = this;
        App.setBasePath(window.parameters.basePath);
        App.setResourcePath(window.parameters.baseResource);
        
        this.createLayout();
    },

    createLayout: function () {
        this.statusBar = Ext.create("App.views.Toolbar.Statusbar");
        
        this.centerPanel = Ext.create("Ext.tab.Panel", {
            xtype: "tabpanel",
            border: false,
            region: "center",
            bodyStyle: "background:#DBDBDB",
            plugins: Ext.create("Ext.ux.TabCloseMenu")
        });

        this.menuBar = Ext.create("App.views.Toolbar.MenuBar");
        
        Ext.create("Ext.container.Viewport", {
            layout: "fit",
            items: [{
                xtype: "panel",
                border: false,
                layout: "border",
                items: [ this.centerPanel ],
                bbar: this.statusBar,
                tbar: this.menuBar
            }]
        });

        var a = Ext.create("App.views.Components.Dashboard.DashboardPanel", {
            title: "Dashboard",
            iconCls: "icon-brick",
            closable: false
        });

        this.addItem(a);
    },

    addItem: function (a) {
        return this.centerPanel.add(a)
    },

    findPanel: function (id) {
        for (var i=0;i<this.centerPanel.items.getCount();i++) {
            if (this.centerPanel.items.getAt(i).getRecordId() == id) {
                return this.centerPanel.items.getAt(i);
            }
        }
        
        return null;
    },
    
    getStatusbar: function () {
        return this.statusBar
    },
});

App.getAjaxProxy = function (service) {
    var request;
    var obj = {
        batchActions: false,
        url: App.getBasePath() + "/" + service,
        listeners: {
            exception: function (proxy, response, operation) {
                try {
                    var data = Ext.decode(response.responseText);
                    request = {
                        response: response.responseText
                    };
                    App.ExceptionWindow.showException(data.exception, request)
                } catch (ex) {
                    alert(ex);
                    var exception = {
                        message: "Critical Error",
                        detail: "The server returned a response which we were not able to interpret."
                    };
                    request = {
                        response: response.responseText
                    };
                    App.ExceptionWindow.showException(exception, request);
                }
            }
        },
        reader: {
            type: "json",
            root: "response.data",
            successProperty: "success",
            messageProperty: "message",
            totalProperty: "response.totalCount"
        }
    };
    return new Ext.data.proxy.Ajax(obj);
};


App.getRESTProxy = function (service) {
    var request,requestData = {};
    
    var obj = {
        batchActions: false,
        url: App.getBasePath()+ '/' +service,
        listeners: {
            exception: function (proxy, response, operation) {
                try {
                    var data = Ext.decode(response.responseText);

                    requestData.method = operation.request.method;
                    requestData.headers = operation.request.headers;
                    requestData.jsonData = operation.request.jsonData;
                    
                    request = {
                            request: Ext.encode(requestData),
                            response: response.responseText
                    };
                    
                    App.ExceptionWindow.showException(data.exception, request);
                } catch (ex) {

                    alert(ex);
                    //alert(response.responseText);

                    var dt = Ext.decode(response.responseText);

                    alert(dt.success);

                    var exception = {
                            message: "Critical Error",
                            detail: "The server returned a response which we were not able to interpret."
                    };
                    
                
                    requestData.method = operation.request.method;
                    requestData.headers = operation.request.headers;
                    requestData.jsonData = operation.request.jsonData;

                    request = {
                            request: Ext.encode(requestData),
                            response: response.responseText
                    };
                    
                    App.ExceptionWindow.showException(exception, request);
                }
            }
        },
        reader: {
            type: 'json',
            root: 'response.data',
            successProperty: "success",
            messageProperty: 'message',
            totalProperty  : 'response.totalCount'
        },
        //writer: Ext.create("App.utils.JsonWithAssociations")
        
    };
    return new Ext.data.proxy.Rest(obj);
};