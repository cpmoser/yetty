Ext.define("observ.data.instance.Local",
{
	extend: "observ.data.instance.Instance",

	constructor: function (config)
	{
		this.callParent(arguments);

		Ext.process.on("message", this.onMessage.bind(this));
		Ext.process.send("ready");
	},

	onMessage: function (message, handle)
	{
		if (message === "stream")
		{
			this.rpc(handle);
		}
	}
});
