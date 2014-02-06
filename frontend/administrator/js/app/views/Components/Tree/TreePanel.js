Ext.define("App.views.Components.Tree.TreePanel", {
	requires			: 	[
								'App.utils.ServiceCall',
							],
	extend				: 'Ext.tree.Panel',
	alias				: 'widget.TreePanel',

	treeService			: null,
	treeResource		: null,
	treeModel			: null,
	treeStore			: null,
	displayField		: null,
	sorters				: null,
    loaded 				: false,
    rootVisible 		: false,
    parentName      	: null,
    parentID        	: null,

    
	initComponent: function () {

		this.addEvents("itemLoaded", "itemSelect", "itemDeselect");
		
		this.createToolbar();

		this.store = new Ext.data.TreeStore({
			root: {
				id: "src",
				name: "Foo"
			},
			remoteSort: false,
			folderSort: true
		});

		this.on("selectionchange", Ext.bind(this._onItemClick, this));

		this.treeStore = new App.utils.ServiceCall(this.treeService, this.treeResource);

		this.callParent();
	},

	loadItem: function () {
		this.setLoading(true);
		this.treeStore.setLoadMessage("Loading items...");
		this.treeStore.setHandler(Ext.bind(this._onItemLoaded, this));
		this.treeStore.doCall();
	},

	setParent: function (id, name) {
        this.parentID = id;
        this.parentIdName = name;
        this.treeStore.setParameter(this.parentIdName, this.parentID)
    },

	_onItemClick: function(model, records) {
		if (records.length > 0) {
			rec = records[0];
            if (rec.get("isCategory") != true ) {
                this.fireEvent("itemSelect", rec);
            } else {
            	this.fireEvent("itemDeselect", rec);
            }
        }
	},

	_onItemLoaded: function (result) {
		/* Store expand/collapse state for all nodes */

		var expandedNodes = this.getExpandedNodes(this.getRootNode());
		
		this.getRootNode().removeAll();

		this.buildTree(this.getRootNode(), result, expandedNodes);
		
		this.loaded = true;

		this.setLoading(false);

		this.getRootNode().expandChildren();
		
		this.getStore().sort("name", "ASC");

		this.fireEvent("itemLoaded");
	},

	getExpandedNodes: function (node) {
		var ret = [];
		if (node.get("expanded") === true) {
			ret.push(node.get("id"));
		}
		
		for (var i=0;i<node.childNodes.length;i++) {
			ret = ret.concat(this.getExpandedNodes(node.childNodes[i]));
		}
		return ret;
	},

	buildTree : function(root, data, expandedNodes) {
		var nodeData = {
			id :  data.id,
			name : data.name,
			tooltip : data.description,
			isCategory: data.isCategory
		};
		
		if (Ext.Array.contains(expandedNodes, data.id)) {
			Ext.apply(nodeData, {
				expanded: true
			});
		}
		
		// Hack to prevent our virtual root node from being dragged
		if (data.id == 0) {
			nodeData.allowDrag = false;
		}
		
		/* We'd like to set leaf here. For some reason, the tree
		 * is stupid.
		 * 
		 * If the node is a leaf, it's not possible to append children. I would
		 * have expected that the "leaf" flag is cleared when a child is appended.
		 * 
		 * If the node is not a leaf, the node should (in theory) use the children
		 * count. However, it doesn't do that in our case and always shows the "expand"
		 * button unless clicked once.
		 */
		
		/*if (data.children.length === 0) {
			nodeData.leaf = true;
		} else {
			nodeData.leaf = false;
		}*/
		
		nodeData.leaf = false;
        nodeData.loaded = true;

        Ext.data.NodeInterface.decorate(this.treeModel);

        var node = Ext.create(this.treeModel, nodeData);
        node = root.appendChild(node);

        for ( var i = 0; i < data.children.length; i++) {
			this.buildTree(node, data.children[i], expandedNodes);
		}
	},

	createToolbar: function () {
		this.toolbarExpandButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/toggle-expand.png'),
			tooltip: "Expand All",
			handler: this._onExpandClick,
			scope: this
		});
		
		this.toolbarCollapseButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/toggle.png'),
			tooltip: "Collapse All",
			handler: this._onCollapseClick,
			scope: this
		});
		
		this.toolbarReloadButton = Ext.create("Ext.button.Button", {
			icon: App.getResource('resources/fugue-icons/icons/refresh.png'),
			tooltip: "Reload",
			handler: this._onReloadClick,
			scope: this
		});
		
		this.toolbar = Ext.create("Ext.toolbar.Toolbar", {
			enableOverflow: true,
			dock: 'top',
			items: [ this.toolbarExpandButton, this.toolbarCollapseButton, this.toolbarReloadButton ]
		});
		
		Ext.apply(this, {
			dockedItems: [ this.toolbar ]
		});
	},

	reload: function() {
		this.loadItem();
	},

	_onReloadClick: function () {
		this.loadItem();
	},

	_onExpandClick: function () {
		this.getRootNode().firstChild.expand(true);
	},

	_onCollapseClick: function () {
		this.getRootNode().firstChild.collapse(true);
	},
});