Ext.define("observ.util.WebConnection",
{
	extend: "observ.util.Connection",

	inheritableStatics:
	{
		connect: function (location, protocol)
		{
			var me = this;

			return require("Q").Promise(function (resolve, reject, notify)
			{
				// protocol is the second argument
				// for clients, this may include things like "requestAuthorization", "ping", "handoff" (pass request to another instance) etc
				// those can be throttled to prevent servers from doing not so nice things...
				var
					s = require("shoe")("/local"),
					d = require("dnode")(me.create.bind(me, {}));

				d.stream = s;
				d.pipe(s).pipe(d);

				d.on("local", function (connection)
				{
					d.on("remote", function ()
					{
						me.connections.push(me);

						connection.remote.instance().then(function (spec)
						{
							connection.instance = connection.instantiate(spec.$className, spec.data, spec.connector);
							resolve(connection.instance);
						});
					});
				});
			});
		}
	}
});
