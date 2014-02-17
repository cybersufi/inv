Ext.define('App.views.Components.Dashboard.DashboardOverviewPanel', {
	extend              : 'Ext.panel.Panel',
    requires            :   [
                                'App.views.Components.Dashboard.*'
                            ],

	alias               : 'widget.dashboardpanel',
	layout              : 'border',
	id                  : 'portal-dashboard',
	border              : false,
	padding             : 5,

    editorDialog        : null,
    detailClass         : 'App.views.Components.Groupdetail.GroupdetailPanel',
	
	initComponent: function () {

        this.navigation = Ext.create('App.views.Components.Dashboard.NavigationPanel', {
            region          : 'west',
            width           : 200,
            split           : true,
            buttonTextMode  : 'show',
        });

        this.navigation.on("linkselect",    this.onLinkSelected,  this);
        this.navigation.on("itemAdd",       this.onItemAdd,     this);

        this.contentPanel = Ext.create('App.views.Components.Dashboard.ContentPanel', {
            region          : "center",
            buttonTextMode  : 'show',
        });

        this.contentPanel.on('itemOpen',    this.onItemOpen,    this);
        
        this.items = [ this.navigation, this.contentPanel ];

		this.callParent();
	},

    createDetailPanel: function(rec) {
        var detailPanel = Ext.create(this.detailClass, {
            record      : rec,
            title       : rec.get('groupname'),
            iconCls     : "icon-server",
            closable    : true,
        });

        return detailPanel;
    },

    getRecordId: function() {
        return 'Dashboard';
    },

    onLinkSelected: function(o, title, url) {
        this.contentPanel.setFlag(url);
    },

    onItemAdd: function() {
        this.contentPanel.addItem();
    },

    onItemOpen: function(rec) {
        var pan = App.getApp().findPanel(rec.get('id'));
        
        if (pan != null) {
            pan.show();
            return;
        }

        var pan = this.createDetailPanel(rec);
        App.getApp().addItem(pan).show();

    }
});