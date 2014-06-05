Ext.define("observ.util.Remote",
{
	extend: "Ext.Base",

	constructor: function (remoteCallable, callableMethods)
	{
		console.log(callableMethods);

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
					remoteCallable(methodName, methodArgs);
				});

			//	theirRemoter.call(methodName, arguments);
			};
		}, this);
	}
});