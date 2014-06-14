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

		this.instance = Ext.create("observ.data.sandbox.Sandbox",
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

			dnode = require("dnode"),

			c = Ext.ClassManager.get("observ.util.Connection"),
			i = this.instance,
			d = dnode(c.create.bind(c, protocol)),

			server;

		server = d.listen(port);

		var
			ec   = require('ecstatic')({root: ".", autoIndex: true, baseDir: "/"}),
			http = require('http'),
			shoe = require('shoe');

		var httpServer = http.createServer(ec);

		httpServer.listen(httpPort);

		var sock = shoe(function (stream)
		{
			var
				wc = Ext.ClassManager.get("observ.util.WebConnection"),
				wd = dnode(wc.create.bind(wc, protocol));

			wd.on("error", function (error)
			{
				this.log("observ.Server Dnode client error (" + error + ")");
			}.bind(this));

			wd.on("fail", function (error)
			{
				this.log("observ.Server Dnode client failure (" + error + ")");
			}.bind(this));

			wd.stream = stream;

			wd.pipe(stream).pipe(wd);
		});

		sock.install(httpServer, "/observ-connect");

		sock.on("connection", function (conn)
		{
			console.log("conn received");
			console.log(conn);
		});

		this.log("observ.Server Listening for client connections on " + port + ", http connections on " + httpPort);

		return this;
	}
});
