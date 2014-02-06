Ext.namespace("App");
Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        'App' : 'frontend/administrator/js/app',
        'Ext.ux' : 'frontend/administrator/js/Ext.ux'
    } 
});

App.application = null;
App.basePath = null;
App.resourcePath = window.parameters.baseResource;
App.ExceptionWindow = null;

Ext.application({
    name: "App",
    require: [
    	'Ext.container'
    ],
    appFolder: "frontend/administrator/js/app",

    launch: function () {
    	Ext.get("loading").hide();
        Ext.setLocale('en_US');
        App.ExceptionWindow = Ext.create('App.views.Dialogs.ExceptionWindow');
        this.createLayout();
        App.application = this;
        App.setBasePath(window.parameters.basePath);
        App.setResourcePath(window.parameters.baseResource);
        this.sessionManager = Ext.create("App.views.Components.Session.SessionManager");
        this.onLogin();
        Ext.fly(document.body).on("contextmenu", this.onContextMenu, this)
    },
    
    onContextMenu: function (e, target) {
        //if (!e.ctrlKey) {
            e.preventDefault();
        //} 
    },
    
    onLogin: function () {
        //this.createGlobalStores();
        //this.reloadStores();
        var a = Ext.create("App.views.Components.Dashboard.DashboardPanel", {
            title: "Dashboard",
            iconCls: "icon-brick",
            closable: false
        });
        //this.addItem(a);
        this.menuBar.enable();
        //this.doSystemStatusCheck();
        //this.doUnacknowledgedNoticesCheck();
        this.setSession(this.getSessionManager().getSession());
        this.getStatusbar().getConnectionButton().setConnected()
    },
    
    doSystemStatusCheck: function () {
        var a = new App.Util.ServiceCall("System", "getSystemStatus");
        a.setHandler(Ext.bind(this.onSystemStatusCheck, this));
        a.doCall()
    },
    
    onSystemStatusCheck: function (a) {
        if (a.data.schemaStatus !== "complete") {
            alert(i18n("Your database schema is not up-to-date! Please re-run setup immediately!"))
        }
        if (a.data.inactiveCronjobCount > 0) {
            alert(i18n("The following cronjobs aren't running:") + "\n\n" + a.data.inactiveCronjobs.join("\n"))
        }
    },
    
    getSessionManager: function () {
        return this.sessionManager
    },
    
    doUnacknowledgedNoticesCheck: function () {
        var a = new App.Util.ServiceCall("SystemNotice", "hasUnacknowledgedNotices");
        a.setHandler(Ext.bind(this.onUnacknowledgedNoticesCheck, this));
        a.doCall()
    },
    
    onUnacknowledgedNoticesCheck: function (a) {
        if (a.data.unacknowledgedNotices === true) {
            this.statusBar.systemNoticeButton.show()
        } else {
            this.statusBar.systemNoticeButton.hide()
        }
        Ext.defer(this.doUnacknowledgedNoticesCheck, 10000, this)
    },
    
    logout: function () {
        this.menuBar.disable();
        this.centerPanel.removeAll(true);
        this.getSessionManager.logout()
    },
    
    createGlobalStores: function () {
        //this.userStore = new App.stores.UserStore();
        /*this.userStore = Ext.create("Ext.data.Store", {
            model: "App.models.User",
            pageSize: -1,
            autoLoad: false
        });*/
    },

    reloadStores: function () {
        //if (this.getSessionManager().getSession()) {
            this.userStore.load();
            Ext.defer(App.getApplication().reloadStores, 100000, this)
        //}
    },
    
    storeLoaded: function (a) {
        a._loaded = true
    },
    
    setAdmin: function (a) {
        this.admin = a
    },
    
    isAdmin: function () {
        return this.admin
    },
    
    getUserStore: function () {
        return this.userStore
    },
    
    getSiPrefixStore: function () {
        return this.siPrefixStore
    },
    
    convertMicroToMu: function (a) {
        return str_replace("�", "�", a)
    },
    
    createLayout: function () {
        this.statusBar = Ext.create("App.views.Toolbar.Statusbar");
        //this.messageLog = this.createMessageLog();
        this.centerPanel = Ext.create("Ext.tab.Panel", {
            xtype: "tabpanel",
            border: false,
            region: "center",
            bodyStyle: "background:#DBDBDB",
            plugins: Ext.create("Ext.ux.TabCloseMenu")
        });
        this.menuBar = Ext.create("App.views.Toolbar.MenuBar");
        this.menuBar.disable();
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
    },
    
    addItem: function (a) {
        this.centerPanel.add(a)
    },
    
    createMessageLog: function () {
        return Ext.create("App.views.Components.MessageLog", {
            height: 200,
            hidden: true,
            split: true,
            title: "Message Log",
            titleCollapse: true,
            collapsible: true,
            region: "south",
            listeners: {
                beforecollapse: Ext.bind(function (a) {
                    this.hideMessageLog();
                    return false
                }, this)
            }
        })
    },
    
    log: function (a) {
        this.logMessage(a, "none")
    },
    
    logMessage: function (c, a) {
        if (c != "Ready.") {
            var b = Ext.ModelManager.create({
                message: c,
                severity: a,
                date: new Date()
            }, "App.Message");
            this.messageLog.getStore().add(b)
        }
    },
    
    hideMessageLog: function () {
        this.messageLog.hide()
    },
    
    showMessageLog: function () {
        this.messageLog.show()
    },
    
    toggleMessageLog: function () {
        if (this.messageLog.isHidden()) {
            this.showMessageLog()
        } else {
            this.hideMessageLog()
        }
    },
    
    getStatusbar: function () {
        return this.statusBar
    },
    
    getSession: function () {
        return this.getSessionManager().getSession()
    },
    
    setSession: function (a) {
        if (a) {
            this.getStatusbar().getConnectionButton().setConnected()
        } else {
            this.getStatusbar().getConnectionButton().setDisconnected();
            this.setUsername("")
        }
    },
    
    setUsername: function (a) {
        this.username = a;
        this.getStatusbar().setCurrentUser(a)
    },
    
    getUsername: function () {
        return this.username
    }
});

Ext.locales = {
    de_DE: {
        flag: "de",
        name: "Deutsch (Deutschland)",
        dateformat: "d.m.Y H:i:s T"
    },
    en_US: {
        flag: "us",
        name: "English (USA)",
        dateformat: "n/j/Y H:i:s T"
    }
};

App.getApplication = function () {
    return App.application
};

App.setBasePath = function (a) {
	App.basePath = a;
};

App.getBasePath = function () {
    return App.basePath;
};

App.setResourcePath = function (a) {
	App.resourcePath = a;
};

App.getResourcePath = function () {
    return App.resourcePath;
};

App.getResource = function (resource) {
    return App.getResourcePath() + resource;
};  

App.bytesToSize = function (a) {
    var c = ["Bytes", "KB", "MB", "GB", "TB"];
    if (a === 0) {
        return "n/a"
    }
    var b = parseInt(Math.floor(Math.log(a) / Math.log(1024)), 10);
    return Math.round(a / Math.pow(1024, b), 2) + " " + c[b]
};

App.serializeRecords = function (b) {
    var a = [];
    for (var c = 0; c < b.length; c++) {
        a.push(b[c].data)
    }
    return a
};

App.getAjaxProxy = function (a) {
    var b;
    var c = {
        batchActions: false,
        url: App.getBasePath() + "/" + a,
        listeners: {
            exception: function (h, e, d) {
                try {
                    var i = Ext.decode(e.responseText);
                    b = {
                        response: e.responseText
                    };
                    App.ExceptionWindow.showException(i.exception, b)
                } catch (g) {
                    var f = {
                        message: "Critical Error",
                        detail: "The server returned a response which we were not able to interpret."
                    };
                    b = {
                        response: e.responseText
                    };
                    App.ExceptionWindow.showException(f, b)
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
    return new Ext.data.proxy.Ajax(c)
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


Ext.setLocale = function (a) {
    Ext.jm_locale = a
};

Ext.getLocale = function () {
    return Ext.jm_locale
};

Ext.getLocaleFlag = function () {
    return Ext.locales[Ext.jm_locale].flag
};

Ext.getDateFormat = function () {
    return Ext.locales[Ext.jm_locale].dateformat
};