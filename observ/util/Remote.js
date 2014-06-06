Ext.define("observ.util.Remote",
{
	extend: "Ext.Base",

	constructor: function (remoteCallable, callableMethods)
	{
		var q = require("Q");

	//	console.log(q);

		Ext.iterate(callableMethods, function (methodName)
		{
			// this is where the promise is made for each remote method
			this[methodName] = function ()
			{
				var methodArgs = arguments;

				return q.Promise(function (resolve, reject, notify)
				{
					try
					{
						remoteCallable(methodName, methodArgs, resolve);
					}
					catch (e)
					{
						reject();
					}
				});
			};
		}, this);
	}
});
