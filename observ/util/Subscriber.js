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
			this.remote = Ext.create("observ.util.Remote", Ext.bind(remoter.callRemote, remoter, [connection], 0), theirRemoter.callable);
		};

		this.getConnector = function ()
		{
			return remoter.getConnector.apply(remoter, arguments);
		};

		if (this.observ)
		{
			var me = this, caller = this.$call;

			/**
			 * broadcast methods are called on the local object, then broadcast to the remotes, with the method run
			 * independently on each remote (an ack message is sent back to the original publisher)
			 */
			Ext.iterate(this.observ.broadcast, function (method, value)
			{
				var fn = this[method];

				this[method] = function ()
				{
					var returnValue;

					// perhaps object instance and remoter could be obtained through a method on the connection, so that these functions
					// could be redefined at the class level vs. instance level

					console.log("calling " + method);
					console.log(arguments);

					try
					{
						returnValue = fn.apply(me, arguments);
						remoter.transmit(this, method, arguments);
					}
					catch (e)
					{
						console.log("error: " + e.message);
					}

					return returnValue;
				};
			}, this);

			/**
			 * callable methods should be added as an additional object to the subscriber, e.g.
			 * var sandbox.remote.get() - which returns a promise that executes on the server and returns a value/object
			 * note that all callable methods should return a Promise object
			 */
			Ext.iterate(this.observ.callable, function (methodName, value)
			{
				remoter.createCallable(methodName, this);
			}, this);
		}
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
