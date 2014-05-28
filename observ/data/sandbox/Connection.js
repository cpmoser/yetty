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

	constructor: function (sb, remote, stream)
	{
		this.callParent(arguments);

		var me = this;

		this.mixins.observable.constructor.call(this);
		this.addEvents("end");

		//this.stream = stream;
		this.id = Ext.id();

		this.get        = Ext.bind(sb.get, sb, [this], 0);

		this.create     = Ext.bind(sb.create, sb, [this], 0);
		this.data       = sb.data;
		this.$className = sb.$className;
		this.addRemote  = Ext.bind(sb.addRemote, sb, [this], 0);
		this.connectionId = this.id;

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
			console.log("connection ended");
		});
	},

	onEnded: function ()
	{
		this.destroy();
	}
});
