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

		Ext.ClassManager.setAlias("observ.util.persist.Persist", "observ.util.Persist");
		Ext.require("observ.util.persist.Persist");

		this.addEvents("connect", "instance");
	},

	connect: function ()
	{
		var
			dnode      = require('dnode'),
			connection = dnode.connect(5050, Ext.bind(this.onConnect, this));
	},

	onConnect: function (remote, dnode)
	{
		var connection = Ext.create("observ.util.Connection", this, remote, dnode);

		this.connection = connection;

		remote.instance(Ext.bind(this.onInstance, this));

		return;
	},

	onInstance: function ($className, data, theirRemoter)
	{
		try
		{
			this.instance = Ext.create($className, data);
			this.instance.connect(this.connection, theirRemoter, theirRemoter.connect);
		}
		catch (e)
		{
			console.log("error", e.stack);
		}

		console.log("created instance with data", data);

		this.fireEvent("instance", this.instance);
	},

	onConnectRemoter: function ()
	{

	},

	get: function (id, cb, scope)
	{
		if (!this.remote)
		{
			this.on("connect", Ext.bind(this.get, this, arguments, false));
			return;
		}

		var myRemoter = Ext.create("observ.util.Remoter");

		this.remote.get(
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
		if (!this.remote)
		{
			this.on("connect", Ext.bind(this.create, this, arguments, false));
			return;
		}

		var myRemoter = Ext.create("observ.util.Remoter");

		this.remote.create(
			className,
			data,
			myRemoter,
			Ext.bind(this.onGet, this, [myRemoter, cb, scope], true)
		);
	}
});
