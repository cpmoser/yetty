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
							width: 240,
							bodyStyle: "padding: 1em;",
							title: "instance",
							region: "east",
							itemId: "instance"
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
		var item = this.items.get(1), ip = item.items.get("instance");

		this.getLayout().setActiveItem(item);
		ip.loadRecord(instance);

		instance.on("remote-set", Ext.bind(this.onInstanceUpdate, this, [ip, instance], false));

		instance.remote.getObjects().then(function (objects)
		{
			console.log("we received these objects");
			console.log(objects);
		});
	},

	onInstanceUpdate: function (panel, instance)
	{
		panel.loadRecord(instance);
		panel.setTitle(instance.get("name"));
	}
});
