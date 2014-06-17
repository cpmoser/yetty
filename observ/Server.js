/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global console,require,__dirname*/

/**
 * Server.js
 */
 Ext.define("observ.Server",
 {
	extend: "Ext.data.Model",

	requires:
	[
		"observ.util.Connection",
		"observ.util.WebConnection"
	],

	constructor: function (port, httpPort)
	{
		this.callParent(arguments);

		this.log = require("util").log;

		this.addEvents(
			"start",
			"stop",
			"ready"
		);

		this.on("ready", Ext.bind(this.listen, this, [port || 5050, httpPort || 5051], false));

		this.connectPersistence();
	},

	connectPersistence: function ()
	{
		Ext.ClassManager.setAlias("observ.util.persist.Mongo", "observ.util.Persist");

		Ext.require("observ.util.persist.Mongo");

		var persist = Ext.ClassManager.get("observ.util.persist.Mongo");

		persist.connect(null, this.createInstance, this);
	},

	onInstantiate: function (sandbox, object)
	{
		if (object.$className === "observ.data.sandbox.Sandbox")
		{
			// when our own instance has instantiated another instance, we can set the VM to a new sandboxed environment here
			// you can change require("extjs-vm") to Ext to have multiple instances running in the same node process
			object.startup(require("./extjs-vm"));
		}
	},

	createInstance: function (db)
	{
		this.log("observ.Server Persistence connected");

		this.instance = Ext.create("observ.data.instance.Instance",
		{
			name:        "www.observjs.com",
			description: "ObservJS Master Instance",
			ns:          "observ",
			location:    "https://www.observjs.com",
			foo:         "bar",
			cacheCount:  0,
			objectCount: 0
		});

		this.instance.on("instantiate", this.onInstantiate, this);

		this.instance.setPersistence(db);

		this.instance.getObjectCount().then(function (count)
		{
			this.log("observ.Server Object count received (" + count + ")");

			this.instance.set("objectCount", count);
			this.instance.startup(Ext);

			this.log("observ.Server Instance ready for namespace " + this.instance.get("ns"));

			this.fireEvent("ready", this);
		}.bind(this), function (err)
		{
			console.log("some error occurred", err);
		});
	},

	getInstance: function (connection, remoteCallback)
	{
		remoteCallback(
		{
			"$className": this.instance.$className,
			data:         this.instance.data,
			connector:    this.instance.getConnector(connection)
		});
	},

	listen: function (port, httpPort)
	{
		var
			// these are the available remote methods on the client when the connection is established
			protocol =
			{
				instance: this.getInstance.bind(this)
			},

			i = this.instance,

			dnode = require("dnode"),

			c = Ext.ClassManager.get("observ.util.Connection"),
			d = dnode(c.create.bind(c, protocol)),

			server;

		server = require("net").createServer(i.rpc.bind(i));

		server.listen(port);

		var
			ec   = require('ecstatic')({root: ".", autoIndex: true, baseDir: "/"}),
			shoe = require('shoe'),
			http = require("http").createServer(ec);

		http.listen(httpPort);

		var sock = shoe(i.rpc.bind(i));

		sock.install(http, "/observ-connect");

		this.log("observ.Server Listening for client connections on " + port + ", http connections on " + httpPort);

		var localInstance = Ext.create("observ.data.instance.LocalDelegate",
		{
			name:        "stocks.observjs.com",
			description: "ObservJS Stock Database",
			ns:          "observ-stock",
			location:    "https://www.observjs.com",
			foo:         "stock",
			cacheCount:  0,
			objectCount: 0
		});

		localInstance.on("ready", this.onLocalReady.bind(this));

		localInstance.startup();

		this.http = http;

		return this;
	},

	onLocalReady: function (instance)
	{
		var sock = require("shoe")(instance.rpc.bind(instance));

		sock.install(this.http, "/local");
	}
});
