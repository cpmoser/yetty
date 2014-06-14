/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global require*/

Ext.define("observ.WebClient",
{
	extend: "observ.Client",

	requires:
	[
		"observ.util.WebConnection"
	],

	connect: function (location)
	{
		return require("Q").Promise(function (resolve, reject, notify)
		{
			Ext.ClassManager.get("observ.util.WebConnection").connect(location).then(function (instance)
			{
				resolve(instance);
			});
		});
	}
});
