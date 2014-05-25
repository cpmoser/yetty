/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global require*/

Ext.define("observ.WebClient",
{
	extend: "observ.Client",

	connect: function ()
	{
		var
			shoe   = require("shoe"),
			stream = shoe('/observ-connect'),
			dnode  = require("dnode"),
			d      = dnode();

		d.on("remote", Ext.bind(this.onConnect, this));
		d.pipe(stream).pipe(d);
	}
});
