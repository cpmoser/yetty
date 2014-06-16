Ext.define("observ.data.instance.LocalDelegate",
{
	extend: "observ.data.instance.Instance",

	startup: function (vm)
	{
		this.child = require("child_process").fork("instance", [], {env: {instance: JSON.stringify(this.data)}});

		this.child.on("message", this.onChildMessage, this);
	},

	onChildMessage: function ()
	{
		// child message handler
	}
});
