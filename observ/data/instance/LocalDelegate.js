Ext.define("observ.data.instance.LocalDelegate",
{
	extend: "observ.data.instance.Instance",

	startup: function ()
	{
		this.child = require("child_process").fork("instance", [], {env: {instance: JSON.stringify(this.data)}});
		this.child.on("message", this.onMessage.bind(this));
	},

	onMessage: function (message)
	{
		if (message === "ready")
		{
			this.fireEvent("ready", this);
		}
		// child message handler
	},

	rpc: function (stream)
	{
		var net = require("net");

		var passthru = net.connect("/tmp/localinstance");

		passthru.on("connect", function ()
		{
			stream.pipe(passthru).pipe(stream);
		});
	}
});
