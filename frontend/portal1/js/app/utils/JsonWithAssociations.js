Ext.define("App.utils.JsonWithAssociations", {
	extend			: 'Ext.data.writer.Json',
	alias 			: 'writer.jsonwithassociations',
	associations 	: [],

	getRecordData: function(record) {
		var me = this, i, key, subStore,
		data = me.callParent(arguments);

		var storeName;
		
		Ext.apply(data, record.getAssociatedData());
		
		return data;
	}
});