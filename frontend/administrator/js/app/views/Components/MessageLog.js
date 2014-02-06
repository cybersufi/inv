Ext.define('App.views.Components.MessageLog', {
	extend: 'App.views.Grid.BaseGrid',
	requires: [
		'App.models.Message'
	],

	store: {
		model: "App.models.Message"
	},

	columns: [
		{header: "Message",  dataIndex: 'message', flex: 1},
		{header: "Date", dataIndex: 'date', width: 300},
		{header: "Severity", dataIndex: 'severity'}
	],

	proxy: {
	    type: 'memory',
		reader: {
	    	type: 'json',
			root: 'items'
	    }
	},
	
	sorters: [{
	    property: 'date',
		direction:'DESC'
	}]
});