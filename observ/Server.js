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

	mixins:
	{
		observable: "observ.util.Publisher"
	},

	constructor: function (port, httpPort)
	{
		this.callParent(arguments);

		/**
		 * the observ.data.Model class defaults to observ.util.observable.Subscriber as its observable mixin unless
		 * we set the alias for observ.util.Observable.
		 *
		 * this needs to happen before any observ.data.Model classes are instantiated
		 */
		Ext.ClassManager.setAlias("observ.util.Publisher", "observ.util.Observable");

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

	createInstance: function (db)
	{
		this.instance = Ext.create("observ.data.sandbox.Sandbox",
		{
			name:        "www.observjs.com",
			description: "ObservJS Master Instance",
			ns:          "observ",
			location:    "https://www.observjs.com",
			foo:         "bar"
		}, db);

		this.instance.startup(Ext);

		// create a test object for this sandbox
		//var test = this.instance.create(this, "observ.data.Test", {foo: "bar"});

		//test.alter();

//		this.instance.add(test);

//		this.instance.add(Ext.create("observ.data.Test", {foo: "bar"}));

		this.fireEvent("ready", this);

//		this.instance.get(2);
	},

	listen: function (port, httpPort)
	{
		var
			dnode = require('dnode'),
			net   = require('net'),
			i     = this.instance,
			c     = Ext.bind(Ext.create, Ext, ["observ.util.Connection", i], 0),
			d     = dnode(c),
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
				wc = Ext.bind(Ext.create, Ext, ["observ.util.Connection", i], 0),
				wd = dnode(wc);
		//	var d = dnode(Ext.bind(Ext.create, Ext, ["observ.data.sandbox.Connection", i], 0));

		//	var
		//		c = Ext.bind(Ext.create, Ext, ["observ.util.Connection"], i], 0),
		//		d = dnode(c);
			wd.stream = stream;

			wd.pipe(stream).pipe(wd);
		});

		sock.install(httpServer, "/observ-connect");

		return this;
	}
});
