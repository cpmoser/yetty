Ext.define("observ.data.instance.Local",
{
	requires:
	[
		"observ.util.Connection"
	],

	extend: "observ.data.instance.Instance",

	constructor: function (config)
	{
		this.callParent(arguments);

		Ext.process.on("message", this.onMessage.bind(this));
		Ext.process.send("ready");

		var net = require("net");

		this.server = net.createServer(this.rpc.bind(this));

		this.server.listen("/tmp/localinstance");
	},

	onMessage: function (message, handle)
	{
		if (message === "stream")
		{
			this.rpc(handle);
		}
	}
});
