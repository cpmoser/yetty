Ext.define("observui.view.Viewport",
{
	extend: "Ext.container.Viewport",

	constructor: function (config)
	{
		config = Ext.apply({}, config,
		{
			layout: "card",
			activeItem: 0,

			items:
			[
				{
					border: false,
					title:  "Loading ObservJS",
					html:   "Loading&hellip;"
				},

				{
					layout: "border",

					items:
					[
						Ext.create("observui.view.Instance",
						{
							tbar:
							[
								'->',
								{
									text: "Create",
									handler: this.createObject,
									scope:   this
								}
							],

							width: 240,
							bodyStyle: "padding: 1em;",
							title: "instance",
							region: "west",
							itemId: "instance"
						}),

						Ext.create("Ext.grid.Panel",
						{
							itemId: "objectsGrid",
							region: "center",
							title: "objects",

							store: Ext.create("Ext.data.Store",
							{
								fields: ["_id", "className"],

								data: [],

								proxy:
								{
									type: "memory",
									reader:
									{
										type: "json",
										root: "data"
									}
								}
							}),

							columns:
							[
								{
									name:      "ID",
									dataIndex: "_id",
									header:    "Object ID",
									width: 240
								},

								{
									name: "Class Name",
									dataIndex: "className",
									header:    "Class Name",
									flex: 1
								}
							]
						})
					]
				}
			]
		});

		this.callParent([config]);
	},

	initComponent: function ()
	{
		this.callParent();

		this.on("render", function ()
		{
			this.client = Ext.create("observ.WebClient");
			this.client.on("instance", this.onInstance, this);
			this.client.connect();
		}, this);
	},

	onInstance: function (instance)
	{
		this.instance = instance;

		var item = this.items.get(1), ip = item.items.get("instance");

		this.getLayout().setActiveItem(item);
		ip.loadRecord(instance);

		instance.on("remote-set", Ext.bind(this.onInstanceUpdate, this, [ip, instance], false));

		instance.remote.getObjects().then(function (objects)
		{
			var grid = this.items.get(1).items.get("objectsGrid");
			console.log("grid should load data");
			console.log(objects);

			grid.getStore().loadData(objects);
		}.bind(this));
	},

	onInstanceUpdate: function (panel, instance)
	{
		panel.loadRecord(instance);
		panel.setTitle(instance.get("name"));
	},

	createObject: function ()
	{
		this.instance.remote.createObject("observ.data.Test", {}).then(function (object)
		{
			console.log("we got the object ", object);
		});

		console.log("ran CO");
	}
});
