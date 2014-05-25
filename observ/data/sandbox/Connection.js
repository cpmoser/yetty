/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.sandbox.Connection",
{
	extend: "Ext.Base",

	constructor: function (sb, remote, stream)
	{
		this.callParent(arguments);

		this.stream = stream;
		this.id = Ext.id();

		console.log(this.id);

		this.get        = Ext.bind(sb.get, sb, [this], 0);
	//	this.create     = Ext.bind(sb.create, sb, [connection], 0);
		this.data       = sb.data;
		this.$className = sb.$className;
		this.addRemote  = Ext.bind(sb.addRemote, sb, [this], 0);
		this.connectionId = this.id;

		stream.on("end", function ()
		{
			console.log(arguments);
			console.log("connection ended");
		});

		stream.on("fail", function ()
		{
			console.log("connection failed");
		});
	},

	create: function ()
	{

	}
});
