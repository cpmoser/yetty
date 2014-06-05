/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Remoter",
{
	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function ()
	{
		this.callParent(arguments);
		this.mixins.observable.constructor.apply(this, arguments);

		this.remotes  = {};
		this.callable = {};

		this.addEvents("remote");
	},

	createPromise: function (remoteMethod)
	{
		var promise =
		{
			then: {}
		};

		return promise;
	},

	/**
	 * connect a remote
	 *
	 * p2p connect: theirRemoter.connect(myRemoter, myRemoter.connect.bind(this))
	 */
	connect: function (connection, theirRemoter, remoteCallback)
	{
		this.fireEvent("beforeconnect", this, connection, theirRemoter);

		this.remotes[connection.id] = theirRemoter;

		if ("function" === typeof remoteCallback)
		{
			remoteCallback(this.getConnector(connection));
		}

		try
		{
			connection.on("destroy", Ext.bind(this.disconnect, this));
		}
		catch (e)
		{
			console.log(connection);
		}

		this.fireEvent("connect", this, connection, theirRemoter);

		return theirRemoter;
	},

	disconnect: function (connection)
	{
		this.fireEvent("beforedisconnect", this, connection);
		delete this.remotes[connection.id];
		this.fireEvent("disconnect", this, connection);
	},

	/**
	 * Local call to object method
	 *
	 * This call is executed by a remote beacon and passed to the callable set by this beacon's object.  Note that all
	 * remotely callable functions must return a promise.
	 */
	call: function (connection, methodName, args, remoteCallback)
	{
		console.log("calling local method from remote");
		console.log(arguments);

		this.callable[methodName].apply(this, args).then(function ()
		{
			console.log("without cb", arguments);
		});
		this.callable[methodName].apply(this, args).then(Ext.bind(this.onCall, this, [remoteCallback], true));
	},

	/**
	 * Callback to the local object method call.  Passes back the result of the
	 */
	onCall: function (result, remoteCallback)
	{
		// translate result if necessary?
		console.log("on call done, sending back to requester", arguments);
		remoteCallback(result);
	},

	callRemote: function (connectionId, methodName, args, callback)
	{
		this.remotes[connectionId].call(methodName, args, Ext.bind(this.onCallRemote, this, [callback], 0));
	},

	onCallRemote: function (callback, response)
	{
		if ("function" === typeof callback)
		{
			callback(response);
		}
	},

	getConnector: function (conn)
	{
		var callable = [];

		Ext.iterate(this.callable, function (methodName)
		{
			callable.push(methodName);
		});

		return {
			receive:  Ext.bind(this.receive, this, [conn], 0),
			connect:  Ext.bind(this.connect, this, [conn], 0),
			call:     Ext.bind(this.call, this, [conn], 0),
			callable: callable
		};
	},

	createCallable: function (methodName, object)
	{
		this.callable[methodName] = Ext.bind(object[methodName], object);
	},

	/**
	 * Broadcast to all peers *except* the originating peer
	 */
	broadcast: function (sourceConn, method, args)
	{

	},

	/**
	 * Receive a message from a peer
	 */
	receive: function (conn, method, args)
	{
		this.fireEvent("receive", conn, method, args);
	},

	ack: function ()
	{

	},

	return: function (conn, method, args)
	{

	}
});
