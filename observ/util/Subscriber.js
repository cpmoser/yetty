/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Subscriber",
{
	extend: "Ext.util.Observable",

	/** onClassMixedIn: -- may be useful to update exisiting class methods
	{
		Ext.iterate(cls.observ, function (method, value)
		{
		});
	},
	**/

	constructor: function ()
	{
		this.callParent();

		var remoter = Ext.create("observ.util.Remoter");

		remoter.on("receive", this.onReceive, this);

		this.connect = function (connection, theirRemoter, remoteConnectCallback)
		{
			remoter.connect.apply(remoter, arguments);
			this.remote = Ext.create("observ.util.Remote", Ext.bind(remoter.callRemote, remoter, [connection.id], 0), theirRemoter.callable);

			this.remote.getFoo().then(function (b)
			{
				console.log("remote foo");
				console.log("WE GOT " + b);
			});
		};

		this.getConnector = function ()
		{
			return remoter.getConnector.apply(remoter, arguments);
		};

		if (this.observ)
		{
			var me = this, caller = this.$call;

			// peered methods are ones which are called on the subscriber first, then broadcast to the remotes, with the method run
			// independently on each remote (an ack message is sent back to the original publisher)
			Ext.iterate(this.observ.peer, function (method, value)
			{
				var fn = this[method];

				this[method] = function ()
				{
					caller.apply(this, [me, method, fn, arguments]);
				};

				this.addEvents("remote-" + method);
			}, this);

			// remote methods are ones which are proxied to a remote, and the results are passed back to the client
			/**
			 * remote methods should be added as an additional object to the subscriber, e.g.
			 * var sandbox.remote.get() - which returns a promise that executes on the server and returns a value/object
			 */


			this.observ.callable = {getFoo: true};

			Ext.iterate(this.observ.callable, function (methodName, value)
			{
				remoter.createCallable(methodName, this);
			}, this);
		}
	},

	"$call": function (me, method, fn, args)
	{
		try
		{
			fn.apply(me, args);
		}
		catch (e)
		{
			throw e;
		}

		me.publish.apply(me, [this, method, args]);
	},

	onReceive: function (connection, method, args)
	{
		// args are received as an object - this should probably be changed in the publish method
		var a = [];
		for (var i in args)
		{
			a.push(args[i]);
		}

		try
		{
			this[method].apply(connection, Array.prototype.slice.call(a, 0));
		}
		catch (e)
		{
			// event might fire here
		}

		a.splice(0, 0, this);
		a.splice(0, 0, "remote-" + method);

		try
		{
			this.fireEvent.apply(this, a);
		}
		catch (e)
		{
		}
	//	this.fireEvent("remote-set", this, args[0], args[1]);
	},

	publish: function (connection, method, args)
	{
		/**
		 * temporary hack - subscriber A would send to server S, which would then publish to subscriber B.  B would then publish to S,
		 * and S would then publish back to A.  We need to figure out a way to track the source of the original message, and make sure
		 * it doesn't get republished back and forth.
		 * in the meantime, the Subscriber class will check if it's the originating source, and then publish, while a Publisher class will
		 * always broadcast.
		 *
		 * update - this may not be necessary
		 */
		if (!this.onBeforePublish(connection))
		{
		//	return;
		}

		Ext.iterate(this.remotes, function (remoteId, remote)
		{
			if (connection.id !== remoteId)
			{
				remote.remoter.receive(method, args);
			}
			else
			{
			//	console.log("send ack");
			}
		}, this);

		return;
	},

	onBeforePublish: function (source)
	{
		if (source === this)
		{
			return true;
		}

		return false;
	},

	onRemoteEnded: function (clientId)
	{
	//	console.log("ended connection");
		this.dropRemote(clientId);
	},
	/**
	 * Executes on a remote event
	 *
	 * @param {String} remoteEventName
	 * @param {Object} args
	 */
	onPublisherEvent: function (remoteEventName, args)
	{
		var a = ["remote-" + remoteEventName];

		Ext.each(args, function (arg)
		{
			if (arg === "this")
			{
				a.push(this);
			}
			else
			{
				a.push(arg);
			}
		}, this);

		this.fireEvent.apply(this, a);
	}
});
