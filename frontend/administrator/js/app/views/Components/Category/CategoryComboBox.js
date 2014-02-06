Ext.define("App.views.Components.Category.CategoryComboBox",{
    requires: [
        'App.models.ModuleCategory',
    ],
    extend:"Ext.form.field.ComboBox",
    alias: 'widget.CategoryComboBox',
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    triggerAction: 'all',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-reload-trigger',
    
    onTrigger1Click: function () {
    	this.onTriggerClick();
    },
    onTrigger2Click: function () {
    	this.expand();
    	this.store.load();
    },
    initComponent: function () {
		this.store = Ext.create("Ext.data.Store", {
			model: 'App.models.ModuleCategory',
			proxy: App.getAjaxProxy("categorymanager/category"),
			pageSize: -1,
			autoLoad: true
		});
		
		this.callParent();
    }
});