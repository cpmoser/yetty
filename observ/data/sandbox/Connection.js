/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.sandbox.Connection",
{
	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function (sb, remote, dnode)
	{
		// dnode events
		// end, local, remote, unpipe, drain, error, close, finish, data
		var stream = dnode.stream;

		console.log("dnode events");
		console.log(dnode._events);

		console.log("connection established", stream);

		this.callParent(arguments);
		this.mixins.observable.constructor.call(this);

		var me = this;

		this.addEvents("end");

		stream.on("error", function ()
		{
			me.fireEvent("end", me);
			stream.destroy();
			me.destroy();
		});

		stream.on("fail", function ()
		{
			console.log("connection failed");
			console.log(this);
		}, this);

		stream.on("close", function ()
		{
			console.log("closed connection");
		});

		stream.on("finish", function ()
		{
			console.log("connection finished");
		});

		stream.on("end", function ()
		{
			console.log("connection ended", arguments);
		});

		this.getInstance = function (remoteCallback)
		{
			try
			{
				console.log("sbdata", sb.getData());

				remoteCallback(sb.$className, sb.data, sb.remoter.getConnector());
			}
			catch (e)
			{
				console.log("error", e);
			}
		};

		return;

		//this.stream = stream;
		this.id = Ext.id();

		this.get        = Ext.bind(sb.get, sb, [this], 0);

		this.create     = Ext.bind(sb.create, sb, [this], 0);
		this.data       = sb.data;
		this.$className = sb.$className;
		this.addRemote  = Ext.bind(sb.addRemote, sb, [this], 0);
		this.connectionId = this.id;
	},

	onEnded: function ()
	{
		this.destroy();
	}
});
