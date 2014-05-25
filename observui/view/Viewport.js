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
					border: false,
					title: "ObservJS",
					layout: "form",

					fieldDefaults:
					{
						labelAlign: "top"
					},

					items:
					[
						{
							xtype: "textfield",
							value: "",
							itemId: "foo",
							fieldLabel: "foovalue",
							enableKeyEvents: true
						}
					]
				}
			]
		});


	//	this.client = Ext.create("observ.Client");
	//	this.client.connectHttp();

		this.callParent([config]);
	},

	initComponent: function ()
	{
		this.callParent();

		this.on("render", function ()
		{
			this.client = Ext.create("observ.Client");
			this.client.on("connect", this.onConnection, this);
			this.client.connectHttp();
		}, this);
	},

	onConnection: function ()
	{
		this.getLayout().setActiveItem(1);
		this.client.get(2, this.onObjectReceived, this);
	},

	onObjectReceived: function (obj)
	{
		this.setField(obj);

		this.items.get(1).items.get(0).on("keyup", function (field)
		{
			obj.set("foo", field.getValue());
		}, this, {buffer: 100});

		obj.on("remote-set", this.setField, this);
	},

	setField: function (obj)
	{
		this.items.get(1).items.get(0).setValue(obj.get("foo"));
	},

	updateField: function ()
	{

	}
});
