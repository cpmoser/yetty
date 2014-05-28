/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.connection.Connection",
{
	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function (stream, clientConnectionId)
	{
		this.callParent();

		var me = this;

		this.mixins.observable.constructor.call(this);

		this.addEvents("end");

		this.id = clientConnectionId;
		this.stream = stream;

		stream.on("error", function ()
		{
			me.fireEvent("end", me);
			me.destroy();
		});
	}
});