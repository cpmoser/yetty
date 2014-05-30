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

		this.remotes = {};

		this.addEvents("receive");
	},

	/**
	 * connect a remote
	 *
	 * p2p connect: theirRemoter.connect(myRemoter, myRemoter.connect.bind(this))
	 */
	connect: function (connection, theirRemoter, remoteCallback)
	{
		console.log("connect", connection);

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
		console.log("connect: " + connection.id);
	},

	disconnect: function (connection)
	{
		delete this.remotes[connection.id];

		console.log("disconnect: " + connection.id);
	},

	getConnector: function (conn)
	{
		console.log("conn is empty?");

		console.log(conn);

		return {
			receive: Ext.bind(this.receive, this, [conn], 0),
			connect: Ext.bind(this.connect, this, [conn], 0)
		};
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
