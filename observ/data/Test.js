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
		var foo = Math.random().toString(36).replace(/[^a-z]+/g, '');

		try
		{
			this.set("foo", foo);
		}
		catch (e)
		{
			console.log(e.message);
		}

		this.commit();

		setTimeout(Ext.bind(this.alter, this), 3000);
	}
});
