Ext.define('App.views.Components.Groupdetail.GroupdetailPanel', {
	extend              : 'Ext.panel.Panel',
    requires            :   [
                                'App.views.Components.Servergroup.*'
                            ],

	alias               : 'widget.servergrouppanel',
	layout              : 'border',
	id                  : 'portal-servergroup',
	border              : false,
	padding             : 5,

    editorDialog        : null,
    record              : null,
	
	initComponent: function () {

        this.navigation = Ext.create('App.views.Components.Groupdetail.NavigationPanel', {
            region: 'west',
            width: 200,
            split: true,
        });

        this.navigation.on("linkselect",    this.linkSelected,  this);
        this.navigation.on("itemAdd",       this.onItemAdd,     this);
        this.navigation.on("itemEdit",      this.onItemEdit,    this);
        this.navigation.on("itemDelete",    this.onItemDelete,  this);

        this.contentPanel = Ext.create('App.views.Components.Groupdetail.ContentPanel', {
            id: 'contentpanel-' + this.record.get('groupname'),
            region: "center",
            buttonTextMode: 'show',
            record: this.record,
        });
        
        this.items = [ this.navigation, this.contentPanel ];

		this.callParent();
	},

    getRecordId: function () {
        if (this.record) {
            return this.record.get("id");
        } else {
            return null;
        }
    },

    linkSelected: function(o, title, url) {
        this.contentPanel.setFlag(url);
    },

    onItemAdd: function() {
        this.contentPanel.addItem();
    },

    onItemEdit: function() {
        return null;
    },

    onItemDelete: function() {
        return null;
    },
});