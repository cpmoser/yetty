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

	pass: function (stream)
	{
		console.log(stream.constructor.name);

		this.child.send("stream", stream);
	},

	rpc: function (stream)
	{
		var net = require("net");

		// create another stream to the forked process
		var passthrough = new net.Socket();

		this.pass(passthrough);

		passthrough.pipe(stream).pipe(passthrough);
	}
});
