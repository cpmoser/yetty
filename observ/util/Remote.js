Ext.define("observ.util.Remote",
{
	extend: "Ext.Base",

	constructor: function (myRemoter, theirRemoter)
	{
		Ext.iterate(theirRemoter.callable, function (methodName)
		{
			// this is where the promise is made for each remote method
			this[methodName] = function ()
			{
				theirRemoter.call(methodName, arguments);
			};
		}, this);
	}
});