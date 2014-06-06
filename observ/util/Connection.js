/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Connection",
{
	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function (object, remote, dnode)
	{
		console.log("connection instance");
		console.log(remote);
		console.log(dnode);


		// instance of net.Socket
		var socket = dnode.stream, me = this;

		this.id = socket.remoteAddress + ":" + socket.remotePort;

		this.callParent(arguments);
		this.mixins.observable.constructor.call(this);

		this.addEvents("beforedestroy", "destroy");

		this.initHandlers(dnode);

		this.instance = function (remoteCallback)
		{
			try
			{
				remoteCallback(object.$className, object.data, object.getConnector(me));
			}
			catch (e)
			{
				console.log("error", e);
			}
		};
	},

	initHandlers: function (dnode)
	{
		// dnode events
		// end, local, remote, unpipe, drain, error, close, finish, data

		dnode.on("end", this.destroy.bind(this));
		dnode.on("error", this.destroy.bind(this));
	},

	destroy: function ()
	{
		this.fireEvent("destroy", this);

		this.callParent(arguments);
	}
});
