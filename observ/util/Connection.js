/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Connection",
{
	statics:
	{
		connect: function (location)
		{
			// protocol is the second argument
			// for clients, this may include things like "requestAuthorization", "ping", etc
			// those can be throttled to prevent servers from doing not so nice things...
			require("dnode")(this.create.bind(this, {})).connect(location);
		}
	},

	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function (protocol, noRemote, dnode)
	{
		this.callParent();

		// instance of net.Socket
		var socket = dnode.stream, me = this;

		Ext.iterate(protocol, function (key, value)
		{
			this[key] = Ext.bind(value, value, [this], 0);
		}, this);

		dnode.on("remote", function (remote)
		{
			// add in remote stuff here
			console.log(remote);

			// call this afterwards, otherwise it's sent back to the remote
			this.mixins.observable.constructor.call(this);

			this.id = socket.remoteAddress + ":" + socket.remotePort;
			this.addEvents("beforedestroy", "destroy");
			this.initHandlers(dnode);

			this.remote = remote;

		}.bind(this));
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
