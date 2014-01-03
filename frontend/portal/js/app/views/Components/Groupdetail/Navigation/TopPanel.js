Ext.define('App.views.Components.Groupdetail.Navigation.TopPanel', {
	extend			    : 'Ext.panel.Panel',
	alias			    : 'widget.topnavpanel',
	layout			    : 'fit',

    buttonTextMode      : 'hide',

    initComponent: function () {

    	this.template = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="{[this.switchClass(values.status)]}">',
                    '<p><h1>{groupname}</h1></p>',
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

		this.callParent();
	},

});