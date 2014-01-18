Ext.define('App.views.Components.Dashboard.DashboardDataView', {
    extend              : 'App.views.BaseComponents.Panel.DataviewPanel',
    require             :   [
                                'App.models.DashboardItem',
                                'App.stores.DashboardItemStore',
                            ], 
	alias               : 'widget.DashboardDataView',
    layout              : 'fit',
	
	initComponent: function () {

        this.template = new Ext.XTemplate(
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

        this.callParent();

        this.statusSortButton = this.createSortButton('Status', 'status');        
        this.getDockedItems('toolbar[dock="top"]')[0].insert(1, this.statusSortButton);

        this.nameSortButton = this.createSortButton('Name', 'groupname');
        this.getDockedItems('toolbar[dock="top"]')[0].insert(2, this.nameSortButton);
    },

});
