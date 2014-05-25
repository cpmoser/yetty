Ext.define("observ.util.persist.Mongo",
{
	extend: "Ext.Base",

	inheritableStatics:
	{
		connect: function (params, cb, scope)
		{
			var
				client = require("mongodb").MongoClient,
				conn,

				onConnect = function (err, db)
				{
					if (err)
					{
						throw err;
					}

					conn = db;

					if ("function" === typeof cb)
					{
						cb.apply(scope, [this]);
					}
				};

			this.conn = function ()
			{
				return conn;
			};

			this.load = function (id)
			{

			};

			client.connect('mongodb://127.0.0.1:27017/observ', Ext.bind(onConnect, this));
		}
	},

	constructor: function ()
	{
		var self = this.mixins.persist.self;

		console.log(self.conn());
	}
});
