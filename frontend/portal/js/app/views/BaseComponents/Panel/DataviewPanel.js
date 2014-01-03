Ext.define('App.views.BaseComponents.Panel.DataviewPanel', {
    extend              : 'Ext.panel.Panel',
    requires            :   [
                                'Ext.toolbar.TextItem',
                                'Ext.view.View',
                                'Ext.ux.DataView.Animated',
                            ],
                        
    layout              : 'fit',
    store               : null,
    model               : null,
    template            : null,

    initComponent: function() {

        this.viewpanel = this.createViewPanel();

        Ext.apply(this, {
            tbar: this.createTopBar(),
            items: this.viewpanel,
        });

        this.addEvents(
            'itemClick',
            'selectionChange'
        );

        this.callParent();
    },

    createViewPanel: function() {

        var viewpanel = Ext.create('Ext.view.View', {
            id: 'viewpanel',
            trackOver: true,
            overItemCls: 'dataview-multisort-item-select',
            itemSelector: 'div.dataview-multisort-item',
            selectedItemCls: 'x-item-selected',
            tpl: this.template,
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            },
            autoScroll: true,
            plugins: Ext.create('Ext.ux.DataView.Animated',{}),
            store: this.store,
        });

        viewpanel.on('itemclick',   this.onItemClick, this);

        return viewpanel;
    },

    reload: function() {
        this.store.load();
        this.updateStoreSorters();
    },

    setFlag: function(flag) {
        if (this.store != null ) {
            this.store.getProxy().extraParams['flag'] = flag;
            this.reload();
        }
    },

    createSortButton: function(name, dataIndex) {
        var sortButton = Ext.create("App.views.BaseComponents.Button.MultiSortButton", {
            text : name,
            dataIndex: dataIndex,
            listeners: {
                scope: this,
                changeDirection: this.updateStoreSorters
            }
        });

        return sortButton;
    },

    createTopBar: function () {
        this.searchField = Ext.create("Ext.ux.SearchField",{
            store: this.store,
            reorderable: false,
        });

        var topbar = Ext.create("Ext.toolbar.Toolbar",{
            dock: 'top',
            enableOverflow: true,

            plugins: Ext.create('Ext.ux.BoxReorderer', {
                listeners: {
                    scope: this,
                    drop: this.updateStoreSorters,
                }
            }),

            items: [
                Ext.create('Ext.toolbar.TextItem', {
                    text: 'Sort on these fields:',
                    reorderable: false
                }),
                { xtype: 'tbfill' }, '-',
                this.searchField
            ]
        });

        return topbar;
    },

    getSorters: function() {
        var topbar = this.getDockedItems('toolbar[dock="top"]')[0];
        var buttons = topbar.query('button-multisort-sortbutton'),
            sorters = [];
        Ext.Array.each(buttons, function(button) {
            sorters.push({
                property : button.getDataIndex(),
                direction: button.getDirection()
            });
        });
        
        return sorters;
    },

    getSelected: function() {
        var sm = this.viewpanel.getSelectionModel();
        var ls = sm.getLastSelected();
        if (sm.isSelected(ls)) {
            return ls;
        } else {
            return null;
        }
    },
    
    updateStoreSorters: function() {
        var sorters = this.getSorters();
        this.store.sort(sorters);
    },

    onSelectionChange: function(dv, nodes) {
        this.fireEvent('selectionChange', dv, nodes);
    },

    onItemClick: function(view, record, item, index, event, object) {
        this.fireEvent('itemClick', view, record, event.getXY(), object);
    },
});