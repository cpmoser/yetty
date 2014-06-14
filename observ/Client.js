/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global require,EventEmitter,console*/

Ext.define("observ.Client",
{
	extend: "Ext.data.Model",

	requires:
	[
		"observ.util.Connection",
		"observ.util.persist.Null" // should be null persist eventually
	],

	constructor: function (config)
	{
		this.callParent(arguments);

		this.addEvents("connect", "instance");
	},

	connect: function (location)
	{
		return require("Q").Promise(function (resolve, reject, notify)
		{
			Ext.ClassManager.get("observ.util.Connection").connect(location).then(function (instance)
			{
				resolve(instance);
			});
		});
	}
});
