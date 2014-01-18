Ext.define('App.views.BaseComponents.Panel.NavigationPanel', {
	extend			    : 'Ext.panel.Panel',
	alias			    : 'widget.navpanel',
	layout			    : 'fit',

    buttonTextMode      : 'hide',

    refreshButtonText   : "Refresh List",
    refreshButtonIcon   : App.getResource('resources/silkicons/arrow_refresh.png'),

	initComponent: function () {

		Ext.apply(this, {
            tbar: this.createTopBar(),
            items: this.createView(),
        });

		this.addEvents(
            'linkselect'
        );

		this.callParent();
	},

    createStore: function (config) {
        Ext.Object.merge(config, {
            autoLoad: true,
            autoSync: false, // Do not change. If true, new (empty) records would be immediately commited to the database.
            remoteFilter: true,
            remoteSort: true,
        });
        
        var st = Ext.create('Ext.data.Store', config);

        return st;
    },

	createView: function(){
        this.view = Ext.create('widget.dataview', {
            autoScroll: true,
            store: this.store,
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            },
            listeners: {
                scope: this,
                /*contextmenu: this.onContextMenu,*/
                viewready: this.onViewReady
            },
            trackOver: true,
            cls: 'nav-list',
            itemSelector: '.nav-list-item',
            overItemCls: 'nav-list-item-hover',
            tpl: '<tpl for="."><div class="nav-list-item">{linkname}</div></tpl>'
        });
        return this.view;
    },

    createTopBar: function () {

        this.refreshButton = Ext.create("Ext.button.Button", {
            text: '',
            tooltip: this.refreshButtonText, 
            icon: this.refreshButtonIcon,
            handler: Ext.bind(this.refresh, this)
        });

        var topbar = Ext.create("Ext.toolbar.Toolbar",{
            dock: 'top',
            enableOverflow: true,

            items: [
                { xtype: 'tbfill' }, '-',this.refreshButton,
            ]
        });

        return topbar;
    },

    refresh: function() {
        this.store.load();
    },

    getTopbar: function() {
        return this.getDockedItems('toolbar[dock="top"]')[0];
    },

	onViewReady: function(){
        this.view.getSelectionModel().select(this.view.store.first());
    },

	onSelectionChange: function(){
        var selected = this.getSelectedItem();
        if (selected) {
            this.loadLink(selected);
        }
    },

	loadLink: function(rec){
        if (rec) {
            this.fireEvent('linkselect', this, rec.get('linkname'), rec.get('linkurl'));
        }
    },

	getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },

	onDestroy: function(){
        this.callParent(arguments);
        this.menu.destroy();
    },

});