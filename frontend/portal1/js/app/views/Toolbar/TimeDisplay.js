Ext.define('App.views.Toolbar.TimeDisplay', {
	extend         : 'Ext.Toolbar.TextItem',
	el             : null,
	dt             : null,
    enable         :Ext.emptyFn,
    disable        :Ext.emptyFn,
    focus          :Ext.emptyFn,

    beforeRender: function () {
        this.callParent();
        Ext.defer(this.onUpdate, 240, this);
    },

    onUpdate: function (obj) {
		var dt = new Date();
		this.setText(Ext.Date.format(dt, "n/j/Y H:i:s T")); 
    	delete dt;
    	Ext.defer(this.onUpdate, 240, this);
	}
});

