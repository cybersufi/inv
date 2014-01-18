Ext.define('App.views.Components.Dashboard.ItemPanel', {
	extend			: 'Ext.panel.Panel',
	alias			: 'widget.ItemPanel',

	height			: 100,
    width			: 200,
    bodyPadding		: 10,
    rec             : null,
    //bodyCls         : 'itemPanelYellow',

	initComponent: function() {

		this.addEvents(
            'deletepanel',
            'editpanel',
            'editlists'
        );

		this.dockedItems = {
            dock: 'left',
            xtype: 'toolbar',
            items: [{
                glyph: 61,
                xtype: 'button',
                handler: this.onCloseButtonClick,
                scope: this,
            }, '-', {
                glyph: 88,
                xtype: 'button',
                handler: this.onEditButtonClick,
                scope: this,
            }, {
                glyph: 70,
                xtype: 'button',
                handler: this.onListButtonClick,
                scope: this,
            }]
        };

        //alert (this.record.get('itemname'));

        this.callParent();

        if (this.rec != null) {
            this.bodyCls = this.getBgClass();
        }

        if (this.rec != null) {
            this.html = '<div><h1>'+ this.rec.get('itemname') +'</h1><span>Overal Status: '+ this.rec.get('status') +'</span></div>';
        } else {
            this.html = '<div><h1><Item Name></h1><hr><span>Overal Status: <Group Status></span></div>';
        }
	},

    getBgClass: function() {

        var stat = this.rec.get('status');
        var cls = null;

        switch (stat) {
            case 1:
                cls = 'green';
                break;

            case 2:
                cls = 'yellow';
                break;

            case 3:
                cls = 'red';
                break;

            default:
                cls = 'netral';
        }

        return cls;

    },

	onCloseButtonClick: function() {
		//alert('deletepanel');
		this.fireEvent('deletepanel');
	},

	onEditButtonClick: function() {
		//alert('editpanel');
		this.fireEvent('editpanel');
	},

	onListButtonClick: function() {
		//alert('editlists');
		this.fireEvent('editlists');
	},

});