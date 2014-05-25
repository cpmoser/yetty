/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */


Ext.define("observ.data.sandbox.Sandbox", function ()
{
	var objects = {}, counter = 1;

	var load = function (objectId)
	{

	};

	return {

		extend: "observ.data.Model",

		fields:
		[
			{
				name: "ns",
				type: "string"
			},

			{
				name: "location",
				type: "string"
			}
		],

		add: function (obj)
		{
			objects[counter++] = obj;
		},

		startup: function (vm)
		{
			if (vm === undefined)
			{
				console.log("instantiating VM");
			}
			else
			{
				console.log("using existing VM");
				this.vm = vm;
			}
		},

		shutdown: function ()
		{

		},

		constructor: function (data, vm)
		{
			this.callParent(arguments);

			this.add(this);

			if (!this.vm)
			{
				// create a new vm and set the loader path
			}

			this.vm = vm;
		},

		get: function (connection, id, theirRemoter, clientCb)
		{
			var o = objects[id];

			try
			{
				var myRemoter = o.addRemote(connection, theirRemoter);

				clientCb(
					id,
					o.$className,
					o.data,
					myRemoter // addRemote returns remoters receive method
				);
			}
			catch (e)
			{
				clientCb(false, null, null, null);
			}
		},

		create: function ()
		{

		}
	};
});
