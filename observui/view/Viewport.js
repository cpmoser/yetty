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
							title:  "objects",

							tbar:
							[
								{
									fieldLabel: "Class",
									xtype: "textfield",
									enableKeyEvents: true,

									listeners:
									{
										keypress: function (field, e)
										{
											if (e.getCharCode() === e.RETURN)
											{
												this.getObjects(field.getValue());
											}
										},

										scope: this
									}
								}
							],

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
									name:      "Class Name",
									dataIndex: "className",
									header:    "Class Name",
									flex:      1
								}
							],

							listeners:
							{
								itemdblclick: this.inspectModel,
								scope: this
							}
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

		this.getObjects();
	},

	getObjects: function (value)
	{
		var grid = this.items.get(1).items.get("objectsGrid");

		grid.getEl().mask("Loading&hellip;");

		this.instance.remote.getObjects(value).then(function (objects)
		{
			grid.getStore().loadData(objects);
			grid.getEl().unmask();
		});
	},

	onInstanceUpdate: function (panel, instance)
	{
		panel.loadRecord(instance);
		panel.setTitle(instance.get("name"));
	},

	createObject: function ()
	{
		this.instance.remote.createObject("observ.data.sandbox.Sandbox", {ns: "someotherns", location: "https://some.other.ns"}).then(function (object)
		{
			console.log("we got the object ", object);
		});

		console.log("ran CO");
	},

	inspectModel: function (grid, record)
	{
		var className = record.get("className"), id = record.get("_id");

		var win = new Ext.Window(
		{
			title: "Inspector",
			layout: "fit",
			width: 400,
			height: 240,

			items:
			[
			]
		});

		win.on("render", function ()
		{
			win.getEl().mask("Loading&hellip;");

			this.instance.remote.getObject(id).then(function (object)
			{
				try
				{
					var item = Ext.create("observui.view.data.Model", {}, object);
					win.add(item);
				}
				catch (e)
				{
					console.log(e);
				}
				win.getEl().unmask();
			});
		}, this);

		win.show();
	}
});
