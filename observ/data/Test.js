/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.Test",
{
	extend: "observ.data.Model",

	observ:
	{
		broadcast:
		{
			set: true
		},

		callable:
		{
			alter: true
		}
	},

	fields:
	[
		{
			name: "foo",
			type: "string"
		},

		{
			name: "isAltering",
			type: "boolean"
		}
	],

	alter: function ()
	{
		var promise = require("Q").Promise(function (resolve, reject)
		{
			var foo = Math.random().toString(36).replace(/[^a-z]+/g, '');
			this.set("foo", foo);
			this.commit();

			this.alterTask.delay(3000);

			resolve(true);

		}.bind(this));

		return promise;
	},

	constructor: function ()
	{
		this.callParent(arguments);

		this.alterTask = Ext.create("Ext.util.DelayedTask", this.alter, this);
	}
});
