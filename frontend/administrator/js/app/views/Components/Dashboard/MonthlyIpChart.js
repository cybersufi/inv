Ext.define('App.views.Components.Dashboard.MonthlyIpChart', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.MonthlyIpChart',
	
	require: [
    	'Ext.chart.*',
    	'Ext.layout.container.Fit',
    	'Ext.window.MessageBox'
    ],

    generateData: function(n, floor){
    	var data = [];
        var p = (Math.random() *  11) + 1;
            
        floor = (!floor && floor !== 0)? 20 : floor;
        
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: Ext.Date.monthNames[i % 12],
                data1: Math.floor(Math.max((Math.random() * 100), floor)),
                data2: Math.floor(Math.max((Math.random() * 100), floor)),
                data3: Math.floor(Math.max((Math.random() * 100), floor)),
                data4: Math.floor(Math.max((Math.random() * 100), floor)),
                data5: Math.floor(Math.max((Math.random() * 100), floor)),
                data6: Math.floor(Math.max((Math.random() * 100), floor)),
                data7: Math.floor(Math.max((Math.random() * 100), floor)),
                data8: Math.floor(Math.max((Math.random() * 100), floor)),
                data9: Math.floor(Math.max((Math.random() * 100), floor))
            });
        }
        return data;
    },

	initComponent: function () {

		var d = this.generateData();

		var store1 = Ext.create('Ext.data.JsonStore', {
	        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
	        data: d
	    });

		var pieModel = [
	        {
	            name: 'data1',
	            data: 10
	        },
	        {
	            name: 'data2',
	            data: 10
	        },
	        {
	            name: 'data3',
	            data: 10
	        },
	        {
	            name: 'data4',
	            data: 10
	        },
	        {
	            name: 'data5',
	            data: 10
	        }
	    ];
    
	    var pieStore = Ext.create('Ext.data.JsonStore', {
	        fields: ['name', 'data'],
	        data: pieModel
	    });
    
	    var pieChart = Ext.create('Ext.chart.Chart', {
	        width: 100,
	        height: 100,
	        animate: false,
	        store: pieStore,
	        shadow: false,
	        insetPadding: 0,
	        theme: 'Base:gradients',
	        series: [{
	            type: 'pie',
	            field: 'data',
	            showInLegend: false,
	            label: {
	                field: 'name',
	                display: 'rotate',
	                contrast: true,
	                font: '9px Arial'
	            }
	        }]
	    });
    
	    var gridStore = Ext.create('Ext.data.JsonStore', {
	        fields: ['name', 'data'],
	        data: pieModel
	    });
    
	    var grid = Ext.create('Ext.grid.Panel', {
	        store: gridStore,
	        height: 130,
	        width: 480,
	        columns: [
	            {
	                text   : 'name',
	                dataIndex: 'name'
	            },
	            {
	                text   : 'data',
	                dataIndex: 'data'
	            }
	        ]
	    });
    
    	this.chart = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: true,
            shadow: true,
            store: store1,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['data1'],
                title: false,
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: false
            }],
            series: [{
                type: 'line',
                axis: 'left',
                gutter: 80,
                xField: 'name',
                yField: ['data1'],
                tips: {
                    trackMouse: true,
                    width: 580,
                    height: 170,
                    layout: 'fit',
                    items: {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [pieChart, grid]
                    },
                    renderer: function(klass, item) {
                        var storeItem = item.storeItem,
                            data = [{
                                name: 'data1',
                                data: storeItem.get('data1')
                            }, {
                                name: 'data2',
                                data: storeItem.get('data2')
                            }, {
                                name: 'data3',
                                data: storeItem.get('data3')
                            }, {
                                name: 'data4',
                                data: storeItem.get('data4')
                            }, {
                                name: 'data5',
                                data: storeItem.get('data5')
                            }], i, l, html;
                        
                        this.setTitle("Information for " + storeItem.get('name'));
                        pieStore.loadData(data);
                        gridStore.loadData(data);
                        grid.setSize(480, 130);
                    }
                }
            }]
        });

		this.items = [ this.chart ];
	
		this.callParent();
	}
});