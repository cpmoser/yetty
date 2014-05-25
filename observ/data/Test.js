/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.Test",
{
	extend: "observ.data.Model",

	fields:
	[
		{
			name: "foo",
			type: "string"
		}
	],

	alter: function ()
	{
		console.log("calling alter");

		try
		{
			this.set("foo", Math.random().toString(36).replace(/[^a-z]+/g, ''));
		}
		catch (e)
		{
			console.log(e.message);
		}

		setTimeout(Ext.bind(this.alter, this), 3000);
	}
});
