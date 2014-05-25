/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.Remoter",
{
	extend: "Ext.Base",

	mixins:
	{
		observable: "Ext.util.Observable"
	},

	constructor: function ()
	{
		this.callParent(arguments);

		this.mixins.observable.constructor.apply(this, arguments);

		this.addEvents("receive");
	},

	receive: function (conn, method, args)
	{
		this.fireEvent("receive", conn, method, args);
	}
});
