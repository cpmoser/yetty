/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.util.connection.Connection",
{
	extend: "Ext.Base",

	constructor: function (stream, clientConnectionId)
	{
		this.callParent();
		this.id = clientConnectionId;
		this.stream = stream;
	}
});