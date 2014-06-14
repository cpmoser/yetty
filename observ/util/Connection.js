/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Connection",
{
	statics:
	{
		connections: [],

		connect: function (location, protocol)
		{
			var me = this;

			return require("Q").Promise(function (resolve, reject, notify)
			{
				// protocol is the second argument
				// for clients, this may include things like "requestAuthorization", "ping", "handoff" (pass request to another instance) etc
				// those can be throttled to prevent servers from doing not so nice things...
				var d = require("dnode")(me.create.bind(me, {})).connect(location);

				d.on("local", function (connection)
				{
					d.on("remote", function ()
					{
						me.connections.push(me);

						connection.remote.instance().then(function (spec)
						{
							connection.instance = connection.instantiate(spec.$className, spec.data, spec.connector);
							resolve(connection.instance);
						});
					});
				});
			});
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
			this.addEvents("connect", "beforedestroy", "destroy");
			this.initHandlers(dnode);

			this.remote = {};

			Ext.iterate(remote, function (name, remoteCallback)
			{
				this.remote[name] = function ()
				{
					return require("Q").Promise(function (resolve, reject, notify)
					{
						remoteCallback(resolve);
					});
				};
			}, this);

			this.fireEvent("connect", this);

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
	},

	instance: null,

	/**
	 * Instantiate a remote object
	 */
	instantiate: function ($className, data, theirRemoter)
	{
		var object;

		object = Ext.create($className, data);
		object.connect(this, theirRemoter, theirRemoter.connect);

		return object;
	}
});
