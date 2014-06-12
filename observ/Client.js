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

	connect: function (address)
	{
		var
			dnode      = require('dnode'),
			connection = dnode.connect(5050, Ext.bind(this.onConnect, this));
	},

	instance: function (name)
	{

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

		this.fireEvent("instance", this.instance);
	}
});
