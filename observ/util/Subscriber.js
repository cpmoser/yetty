/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Subscriber",
{
	extend: "Ext.util.Observable",

	/*onClassMixedIn: function (cls)
	{
		console.log("MIXED INTO CLASS");
		console.log(cls.observ);
		console.log(cls.prototype);

		Ext.iterate(cls.observ, function (method, value)
		{
		});
	},
	*/
	constructor: function ()
	{
		this.callParent();

		this.remotes = {};

		// just work with the "set" method right now
		// this.set = Ext.Function.createSequence(this.set, Ext.bind(this.publish, this, ["set"], 0));

		// this.set = Ext.bind(this.$call, this, [this, "set", this.set], 0);

		if (this.observ)
		{
			var me = this, caller = this.$call;

			Ext.iterate(this.observ.peer, function (method, value)
			{
				var fn = this[method];

				this[method] = function ()
				{
					caller.apply(this, [me, method, fn, arguments]);
				};

				this.addEvents("remote-" + method);
			}, this);
		}

		/*var me = this, fn = this.set, name = "set", caller = this.$call;

		this.set = function ()
		{
			try
			{
				caller.apply(this, [me, name, fn, arguments]);
			}
			catch (e)
			{
				// perhaps fire an event here
			}
		};

		this.addEvents("remote-set");*/
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
				console.log("broadcasting to " + remoteId);
				remote.remoter.receive(method, args);
			}
			else
			{
				console.log("send ack");
			}
		}, this);

		return;
	},

	onBeforePublish: function (source)
	{
		if (source === this)
		{
			console.log("source is this?");
			return true;
		}

		return false;
	},

	/**
	 * Add a remote publisher
	 *
	 * @param {EventEmitter}
	 */
	setRemoter: function (remoter)
	{
		this.remoter = remoter;
		this.remoter.on("receive", this.onReceive, this);
	},

	/**
	 * Add a remote
	 *
	 * @param {EventEmitter} emitter     Subscriber emitter
	 * @param {Object} client connection Subscriber connection
	 */
	addRemote: function (connection, remoter)
	{
		this.remotes[connection.id] =
		{
			remoter: remoter
		};

		var ended = Ext.bind(this.onRemoteEnded, this, [connection.connection], false);

		connection.stream.on("end", ended);
		connection.stream.on("error", ended);

		var myRemoter =
		{
			receive: Ext.bind(this.remoter.receive, this.remoter, [connection], 0)
		};

		return myRemoter;
	},

	/**
	 * Remove a remote
	 *
	 * @param {String} id Client connection ID
	 */
	dropRemote: function (id)
	{
		delete this.remotes[id];
	},

	onRemoteEnded: function (clientId)
	{
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
