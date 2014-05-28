Ext.define("observ.util.persist.Mongo",
{
	extend: "Ext.Base",

	inheritableStatics:
	{
		connect: function (params, cb, scope)
		{
			var
				mongo  = require("mongodb"),
				client = mongo.MongoClient,
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

			this.id = function (stringId)
			{
				return new mongo.ObjectID(stringId);
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
		var
			self   = this.mixins.persist.self,
			conn   = self.conn(),
			c      = conn.collection("objects"),
			commit = Ext.bind(this.commit, this);

		this.commit = function (silent, modifiedFieldNames)
		{
			c.update({_id: this.getId()}, {"$set": {data: this.getData()}}, {safe: true, multi: false, upsert: false}, function (err, db)
			{
				if (!err)
				{
					commit(silent, modifiedFieldNames);
				}
			});
		};
	}
});
