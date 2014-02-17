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

    initComponent: function() {
        Ext.apply(this, {
            tbar: this.createTopBar(),
            items: this.createViewPanel(),
        });

        this.addEvents(
            'itemClick',
            'selectionChange'
        );

        this.callParent();
    },

    createViewPanel: function() {
        var template = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="dataview-multisort-item">',
                    '<div class="{[this.switchClass(values.status)]}">',
                        '<p><h1>{groupname}</h1></p>',
                        '<p><span>Overal Status: <c>{[this.switchValue(values.status)]}</c></span></p>',
                    '</div>',
                '</div>',
            '</tpl>',{
                switchClass: function(value) {
                    var cls = "";
                    switch(value) {
                        case 1      : cls = 'green'; break;
                        case 2      : cls = 'yellow'; break;
                        case 3      : cls = 'red'; break;
                        default     : cls = 'netral';
                    }
                    return cls;
                },

                switchValue: function(value) {
                    var text = '';
                    switch(value) {
                        case 1      : text = 'Good'; break;
                        case 2      : text = 'Warning'; break;
                        case 3      : text = 'Alert'; break;
                        default     : text = 'N/A';
                    }
                    return text;
                },
            }
        );

        var viewpanel = Ext.create('Ext.view.View', {
            id: 'viewpanel',
            trackOver: true,
            overItemCls: 'dataview-multisort-item-select',
            itemSelector: 'div.dataview-multisort-item',
            selectedItemCls: 'x-item-selected',
            tpl: template,
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

    addSorter: function(name, dataIndex) {
        var sortButton = Ext.create("App.views.BaseComponents.Button.MultiSortButton", {
            text : name,
            dataIndex: dataIndex,
            listeners: {
                scope: this,
                changeDirection: this.updateStoreSorters
            }
        });

        this.getDockedItems('toolbar[dock="top"]')[0].insert(1, this.sortButton);
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
                    drop: this.updateStoreSorters
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
        var buttons = this.topbar.query('button-multisort-sortbutton'),
            sorters = [];
        Ext.Array.each(buttons, function(button) {
            sorters.push({
                property : button.getDataIndex(),
                direction: button.getDirection()
            });
        });
        
        return sorters;
    },
    
    updateStoreSorters: function() {
        var sorters = this.getSorters(),
        this.store.sort(sorters);
    },

    onItemClick: function(view, record, item, index, event, object) {
        this.fireEvent('itemClick', view, record, event, object);
    },
});