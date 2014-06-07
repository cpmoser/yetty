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

				Ext.create("observui.view.Instance")
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
		var item = this.items.get(1);

		console.log(instance);

		this.getLayout().setActiveItem(item);
		item.updateRecord(instance);

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
