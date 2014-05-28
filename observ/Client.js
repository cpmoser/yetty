/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global require,EventEmitter,console*/
Ext.define("observ.Client",
{
	extend: "Ext.data.Model",

	constructor: function (config)
	{
		this.callParent(arguments);

		var
			me    = this,
			dnode = require("dnode");

		// this.connection = dnode.connect(5050, Ext.bind(this.onConnect, this));

		// this.connect();

		Ext.ClassManager.setAlias("observ.util.persist.Persist", "observ.util.Persist");
		Ext.require("observ.util.persist.Persist");

		this.addEvents("connect");
	},

	connect: function ()
	{
		var
			dnode = require('dnode'),
			connection = dnode.connect(5050, Ext.bind(this.onConnect, this));
	},

	connectHttp: function ()
	{
		var
			shoe   = require("shoe"),
			stream = shoe('/observ-connect'),
			dnode  = require("dnode"),
			d      = dnode();

		d.on("remote", Ext.bind(this.onHttpConnect, this, [stream], true));
		d.pipe(stream).pipe(d);
	},

	onHttpConnect: function (remote, dnode, stream)
	{
		this.onConnect(remote, stream);
	},

	onConnect2: function (remote, stream)
	{
		remote.get("test");
	},

	onConnect: function (remote, stream)
	{
		console.log("remote");
		console.log(remote);

		stream.on("fail", function ()
		{
			console.log("connection failed", arguments);
		});

		var connection = Ext.create("observ.util.connection.Connection", stream, remote.connectionId);

		this.connection = connection;

		var
			sb      = Ext.create(remote.$className),
			remoter = Ext.create("observ.util.Remoter");

		sb.setRemoter(remoter);
		remote.addRemote(remoter);

		this.sb       = sb;
		this.remoteSb = remote;

		this.fireEvent("connect", this, remote);
	},

	onConnectRemoter: function ()
	{

	},

	get: function (id, cb, scope)
	{
		if (!this.remoteSb)
		{
			this.on("connect", Ext.bind(this.get, this, arguments, false));
			return;
		}

		var myRemoter = Ext.create("observ.util.Remoter");

		this.remoteSb.get(
			id,
			{
				receive: Ext.bind(myRemoter.receive, myRemoter, [this.connection], 0)
			},
			Ext.bind(this.onGet, this, [myRemoter, cb, scope], true)
		);
	},

	onGet: function (id, className, config, theirRemoter, myRemoter, cb, scope)
	{
		var o = Ext.create(className, config);

		console.log(this.connection);

		// object.addSubscriber(objectRemoter)
		o.setRemoter(myRemoter);
		o.addRemote(this.connection, theirRemoter);

		if ("function" === typeof cb)
		{
			cb.call(scope || cb, o, id);
		}
	},

	create: function (className, data, cb, scope)
	{
		if (!this.remoteSb)
		{
			this.on("connect", Ext.bind(this.create, this, arguments, false));
			return;
		}

		var myRemoter = Ext.create("observ.util.Remoter");

		this.remoteSb.create(
			className,
			data,
			myRemoter,
			Ext.bind(this.onGet, this, [myRemoter, cb, scope], true)
		);
	}
});
